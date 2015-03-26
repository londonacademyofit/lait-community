app.config(function($routeProvider, $locationProvider) {
    
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

});