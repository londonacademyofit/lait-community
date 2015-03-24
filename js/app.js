console.log('--- executing app.js');

var app = angular.module('LAIT-Community', [

    'firebase'

]);

// Storing our main Firebase URI is handy
app.constant('FIREBASE_URI', 'https://lait-community.firebaseio.com/');

// This factory allows us to access the Firebase 'auth' object whenever we need to
app.factory('Auth', function($firebaseAuth, FIREBASE_URI) {
    
    var ref = new Firebase(FIREBASE_URI);
    
    return $firebaseAuth(ref);

});

// This service allows us to watch the user's authentication status
app.service('AuthWatch', function(Auth) {
    
   Auth.$onAuth(function(authData) {
      
      if (authData) {
      
        console.log('You are logged in as:', authData.uid);
      
      } else {
      
        console.log('You are not logged in');
      
      }
    
    });
    
});

app.factory('UsersService', function(FIREBASE_URI, $firebaseObject) {
    
    // store a reference to this service    
    var service = this;

    // store a reference to the /users/ section of your Firebase
    var usersRef = new Firebase(FIREBASE_URI + '/users/');
    
    // download the contents of this section of the Firebase into an array
    // with 3-way binding, so updates to this array are saved to the Firebase
    var users = $firebaseObject(usersRef);
    
    // allow this service to return the array of users
    service.getUsers = function() {
        return users;    
    };
    
    // allow this service to add to the array of users
    service.addUser = function(user) {
        users.$add(user);    
    };
    
    // allow this service to update a user in the array
    service.saveUser = function(user) {
        users.$save(user);    
    };
    
    // allow this service to remove a user from the array
    service.saveUser = function(user) {
        users.$remove(user);    
    };
    
    return service;
    
});

app.controller('MainCtrl', function(AuthWatch, $scope, UsersService) {
    
    // the UsersService.getUsers() method will give us an array of users ?
    var usersArray = UsersService.getUsers();
    
    // we can bind this array of users to the $scope, to show it in the DOM
    usersArray.$bindTo($scope, 'users');

});
