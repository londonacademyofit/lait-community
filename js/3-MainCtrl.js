/*
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

});