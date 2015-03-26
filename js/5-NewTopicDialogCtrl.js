/*
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
    
}