angular.module('dashboard').config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(true);
    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    }).state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    }).state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function($timeout) {
                    $timeout(function() {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    }).state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function($timeout) {
                    $timeout(function() {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    }).state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    }).state('app.userProfile', {
    	cache: false,
        url: '/userProfile',
        views: {
            'menuContent': {
                templateUrl: 'templates/userProfile.html',
                controller: 'UserProfileCtrl'
            },
            'fabContent': {
                template: '',
                controller: function($timeout) {
                    $timeout(function() {
                    	  document.getElementById('fab-friends').classList.toggle('on');
                    }, 800);
                }
            }
        }
    }).state('app.profile', {
    	cache: false,
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: '',
                controller: function($timeout) {
                    $timeout(function() {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);
                }
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});