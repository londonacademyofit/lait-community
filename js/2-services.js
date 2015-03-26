app.service('TopicsService', function($firebaseArray, FIREBASE_URI) {
    
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
    
});