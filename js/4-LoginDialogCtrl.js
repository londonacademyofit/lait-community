/*
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
  
}