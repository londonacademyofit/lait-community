// This factory allows us to access the Firebase 'auth' object whenever we need to
app.factory('Auth', function($firebaseAuth, FIREBASE_URI) {
    
    var ref = new Firebase(FIREBASE_URI);
    
    return $firebaseAuth(ref);

});