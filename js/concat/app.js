console.log('--- executing app.js');

var app = angular.module('LAIT-Community', [

    'ngRoute',
    'ngMaterial',
    'firebase'

]);

// Storing our main Firebase URI is handy
app.constant('FIREBASE_URI', 'https://lait-community.firebaseio.com/');;// This factory allows us to access the Firebase 'auth' object whenever we need to
app.factory('Auth', function($firebaseAuth, FIREBASE_URI) {
    
    var ref = new Firebase(FIREBASE_URI);
    
    return $firebaseAuth(ref);

});;app.service('TopicsService', function($firebaseArray, FIREBASE_URI) {
    
    var service = this;

    var topicsRef = new Firebase(FIREBASE_URI + '/topics/');
    
    var topicsArray = $firebaseArray(topicsRef);
    
    service.getTopics = function() {
        
        return topicsArray;
    
    };
    
    service.addTopic = function(newTopic) {
    
        console.log('Adding new topic:', newTopic);
    
    };
    
    service.removeTopic = function(topicId) {
        
        // call a dialog to confirm topic removaL
    
        console.log('Removing topic:', topicId);
        
        // save this topic to a /topics-removed/ section of the Firebase
        // before removing it from the /topics/ section
        
    }
    
});

app.service('CurrentUserService', function($firebaseObject, FIREBASE_URI) {

    var service = this;
    
    service.getUser = function(userId) {
      
        var userRef = new Firebase(FIREBASE_URI + '/users/' + userId);
        
        var userObj = $firebaseObject(userRef);
        
        return userObj;
        
    };
    
});;app.config(function($routeProvider, $locationProvider) {
    
    // if in doubt about routing/views, show the user the home view
	$routeProvider.otherwise({redirectTo:'/'});
    
    $routeProvider
        .when('/', {
            
            templateUrl: 'templates/main.tmpl.html',
            controller: 'MainCtrl',
            resolve: {
            
                currentAuth: function(Auth) {
                    
                    return Auth.$waitForAuth();
                
                }
                
            }
            
        })
        
        .when('/profile', {
            templateUrl: 'templates/userprofile.tmpl.html',
            controller: 'UserProfileCtrl',
            resolve: {
                
                currentAuth: function(Auth) {
                    
                    return Auth.$waitForAuth();
                    
                }
              
            }
        
        })
        
        // if in doubt about routing/views, show the user the home view
	    .otherwise({redirectTo:'/'});

});;/*
    Our app's main controller
*/

app.controller('MainCtrl', function($scope, Auth, FIREBASE_URI, $firebaseObject, $mdDialog, CurrentUserService, TopicsService) {
    
    console.log('-- executing MainCtrl');
    
    $scope.topics = TopicsService.getTopics();
    $scope.sortOrder = '-date';
    
    // need to use $scope.waiting property to show/hide loader vs content
    $scope.waiting = false;
    
    // get the user's data, if they're logged in (& update this data if
    // their authentication status changes)
    $scope.user = null;
    
    Auth.$onAuth(function(authData) {
        
        if (authData) {
            
            $scope.user = CurrentUserService.getUser(authData.uid);
            
            console.log('$scope.user:', $scope.user); 
            
        } else {
            
            $scope.user = null;
            
            console.log('$scope.user:', $scope.user);  
        
        }
    
    });
    
    // this function handles user logout, if the logout button is clicked
    $scope.logout = function() {
        
        Auth.$unauth();
            
    };
    
    $scope.removeTopic = function(topicId) {
    
        console.log('Clicked remove topic:', topicId);    
        
        if ($scope.user && $scope.user.admin > 0) {
            
            TopicsService.removeTopic(topicId);
            
        } else {
            
            console.log('Error: Must be logged in + admin to remove topics');    
            
        }
        
    };
    
    // this function shows the login dialog box, if the login button is clicked
    $scope.showLoginDialog = function(event) {
        
        $mdDialog.show({
        
          controller: LoginDialogController,
          templateUrl: 'templates/logindialog.tmpl.html',
          targetEvent: event
        
        })
        
        .then(function() { // this is called if the 'OK' button is clicked
        
          console.log('The OK button was clicked');
        
        }, function() { // this is called if the 'Cancel' button is clicked
        
          console.log('The cancel button was clicked');
        
        });
        
    };
    
    // this function shows the createPost dialog box
    $scope.showNewTopicDialog = function(event) {
        
        $mdDialog.show({
            
            controller: NewTopicDialogController,
            templateUrl: 'templates/newtopic.tmpl.html',
            targetEvent: event
        
        })
        
        .then(function() { // this is called if the 'Create Post' button is clicked
        
          console.log('The Create Post button was clicked');
            
        }, function() { // this is called if the 'Cancel' button is clicked
        
          console.log('The cancel button was clicked');
            
        });
    
    };

});;/*
    This controller contains the functions for our login dialog
*/

function LoginDialogController(Auth, $scope, $mdDialog, FIREBASE_URI, $firebaseObject) {
    
    // initially, there should be no error message to show
    $scope.errorMsg = false;
    
    $scope.login = function() { // this is run if the 'OK' button is clicked
    
        // hide the buttons and show a small loader
        $scope.waiting = true;
        
        // hide any error message shown before
        $scope.errorMsg = false;
        
        // use the Auth object to try logging the user in
        Auth.$authWithPassword({
        
          email: $scope.email,
          password: $scope.password
        
        }).then(function(authData) {
            
            $scope.waiting = false;
            
            console.log("Logged in as:", authData.uid);
        
            $mdDialog.hide();
        
        }).catch(function(error) {
            
            $scope.waiting = false;
            
            console.log('Authentication failed:', error);
        
            if (error.code) {
                    
                $scope.errorMsg = error.message;
            
            }
        
        });
    
    };
    
    $scope.signup = function() { // this runs if the 'Sign Up' button is clicked
      
        Auth.$createUser({
            
          email: $scope.email,
          password: $scope.password
        
        }).then(function(userData) {
        
            console.log("User " + userData.uid + " created successfully!");
          
            // update this user's section in the Firebase
            var userRef = new Firebase(FIREBASE_URI + '/users/' + userData.uid);
            userRef.update({
                name: $scope.name
            }, function(error) {
                if (error) {
                    console.log('Error updating Firebase:', error);    
                } else {
                    console.log('User\'s Firebase section updated successfully');    
                }
            });
        
            // then log the user into their new account
            return Auth.$authWithPassword({
              
                email: $scope.email,
                password: $scope.password

            });
        
        }).then(function(authData) {
        
            console.log("Logged in as:", authData.uid);
        
            $mdDialog.hide();
        
        }).catch(function(error) {
        
            console.error("Error creating new user: ", error);
            
            if (error.code) {
            
                $scope.errorMsg = error.message;
            
            }
        
        });
        
    };
    
    $scope.cancel = function() { // this is run if the 'Cancel' button is clicked
    
        $mdDialog.cancel();
    
    };
  
};/*
    This controller contains the functions for our newTopic dialog
*/    

function NewTopicDialogController(Auth, $scope, $mdDialog, FIREBASE_URI, $firebaseObject, CurrentUserService, TopicsService) {
    
    $scope.errorMsg = false;
    
    $scope.waiting = false;
    
    // get the current user's auth data, if it exists
    var authData = Auth.$getAuth();
    
    if (authData) {
        
        // access the user's Firebase section to download & bind it to the DOM
        $scope.user = CurrentUserService.getUser(authData.uid);
        
    } else {
        
        $scope.user = false; // the login/signup form will be shown
            
    }
    
    $scope.createTopic = function() { // this is run if 'Create Topic' is clicked
        
        $scope.waiting = true;
        
        if (!$scope.user) {
            
            $scope.waiting = false;
            
            $scope.errorMsg = 'You need to be logged in to create a new topic.';
            
        } else {
        
            TopicsService.addTopic();
            
        }
        
    };
 
    $scope.cancel = function() { // this is run if the 'Cancel' button is clicked
    
        $mdDialog.cancel();
    
    };
    
};app.controller('UserProfileCtrl', function($scope) {

    console.log('-- executing UserProfileCtrl');    
    
});