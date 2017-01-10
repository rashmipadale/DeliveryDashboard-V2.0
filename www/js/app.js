angular.module('dashboard', ['ionic', 'ionic-material', 'ionMdInput', 'chart.js']).run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
}).run(function($rootScope, $state, $ionicPopup) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
        var authToken = window.localStorage.getItem('token');
        if (authToken === "undefined" || authToken === null) {
            if (next.name !== 'app.login') {
                event.preventDefault();
                $state.go('app.login');
            }
        }
    });
}).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // Turn off caching for demo simplicity's sake
});