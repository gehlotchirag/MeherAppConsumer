// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
  var db = null;
var MeherUser ={};
var MeherMobile = null;
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','greatCircles','ion-google-place','ti-segmented-control','jett.ionic.filter.bar','ionic-pullup'])


    .run(function($ionicPlatform,$state,$cordovaSQLite) {
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
        document.addEventListener("resume", function() {
          if($state.current.name == "app.storelist" || $state.current.name == "app.postorder" || $state.current.name == "app.postorder")
          {
            $state.go($state.current, {}, {reload: true});
          }

        }, false);
        db = $cordovaSQLite.openDB("meheruserd.db");
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Meher_user (deviceId text, mobile integer,addLine1 text,addLine2 text)");
      });
    })



    .config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$ionicFilterBarConfigProvider) {
      $ionicConfigProvider.views.forwardCache(true);
      $ionicFilterBarConfigProvider.theme('stable');
      $ionicFilterBarConfigProvider.clear('ion-close');
      $ionicFilterBarConfigProvider.search('ion-search');
      $ionicFilterBarConfigProvider.backdrop(false);
      $ionicFilterBarConfigProvider.transition('vertical');
      $ionicFilterBarConfigProvider.placeholder('Search Products');

      $stateProvider

          .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
          })
          .state('app.pastorder', {
            url: '/pastorder',
            views: {
              'menuContent': {
                templateUrl: 'templates/pastorder.html',
                controller: 'pastOrderCtrl'
              }
            }
          })

          .state('app.postorder', {
            url: '/postorder/:orderId',
            cache: false,
            views: {
              'menuContent': {
                templateUrl: 'templates/post-order.html',
                controller: 'postOrderCtrl'
              }
            }
          })

          .state('app.contact', {
            url: '/contact',
            views: {
              'menuContent': {
                templateUrl: 'templates/contact.html',
                controller: 'contactCtrl'
              }
            }
          })
          .state('app.categories', {
            url: '/categories',
            views: {
              'menuContent': {
                templateUrl: 'templates/categories.html',
                controller: 'CategoriesCtrl'
              }
            }
          })
          .state('app.showcase', {
            url: '/categories/:storelistId/:storeId/:subProductId/:productId',
            views: {
              'menuContent': {
                templateUrl: 'templates/showCase.html',
                controller: 'showCaseCtrl'
              }
            }
          })
          .state('app.about', {
            url: '/about',
            views: {
              'menuContent': {
                templateUrl: 'templates/about.html'
              }
            }
          })
          .state('app.storelist', {
            url: '/categories/:storelistId',
            cache: false,
            views: {
              'menuContent': {
                templateUrl: 'templates/storelist.html',
                controller: 'StorelistCtrl'
              }
            }
          })
          .state('app.store', {
            url: '/categories/:storelistId/:storeId',
            views: {
              'menuContent': {
                templateUrl: 'templates/store.html',
                controller: 'storeCtrl'
              }
            }
          })
          .state('app.orderPage', {
            url: '/order',
            views: {
              'menuContent': {
                templateUrl: 'templates/order.html',
                controller: 'orderCtrl'
              }
            }
          })
          .state('app.login', {
            url: '/login',
            views: {
              'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
              }
            }
          })
      .state('app.otp', {
        url: '/otp',
        views: {
          'menuContent': {
            templateUrl: 'templates/otp.html',
            controller: 'otpCtrl'
          }
        }
      })
      .state('app.share', {
        url: "/share",
        views: {
          'menuContent': {
            templateUrl: "templates/share.html",
            controller: 'shareCtrl'
          }
        }
      });

      //.state('app.singleStore', {
      //  url: '/categories/:storelistId',
      //  views: {
      //    'menuContent': {
      //      templateUrl: 'templates/storelist.html',
      //      controller: 'StorelistCtrl'
      //    }
      //  }
      //});

      // if none of the above states are matched, use this as the fallback
      //$urlRouterProvider.otherwise('/app/postorder/567d2a774f51030747c496cf');
      $urlRouterProvider.otherwise('/app/categories');
      //$urlRouterProvider.otherwise('/app/login');
    });


