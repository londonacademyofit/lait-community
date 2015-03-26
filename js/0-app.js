console.log('--- executing app.js');

var app = angular.module('LAIT-Community', [

    'ngRoute',
    'ngMaterial',
    'firebase'

]);

// Storing our main Firebase URI is handy
app.constant('FIREBASE_URI', 'https://lait-community.firebaseio.com/');