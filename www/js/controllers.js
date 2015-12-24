angular.module('starter.controllers', [])

    .controller('LoadCtrl', function($scope, $cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, ionPlatform, $http,CartData,$location,$cordovaDevice,$state,$rootScope,$ionicPopup) {$scope.notifications = [];
      $scope.cartList=CartData.getCart();
      $scope.grandTotal;
        $scope.requestDelete = false;
        window.localStorage['MeherDeviceId'];

        $scope.cartList=CartData.getCart();
        $scope.cartItems = CartData.getCart();
        $scope.delete=function(){
            alert('you have delete item')
        }
        $scope.showConfirm = function(productItem) {

            var confirmPopup = $ionicPopup.confirm({

                title: 'Conformation',

                template: 'are you sure you want to delete',

            });

            //alert(JSON.stringify(productItem));
            confirmPopup.then(function(res) {

                if (res) {
                    var index = $scope.cartList.indexOf(productItem);
                    if (index != -1) {
                        $scope.cartList.splice(index, 1);
                        //CartData.removeCart($scope.productItem);
                    }


                    $scope.$broadcast('someEvent', productItem);

                    console.log('You clicked on "OK" button');

                } else {

                    console.log('You clicked on "Cancel" button');

                }

            });

        };


        $scope.increaseQuantity = function (productItem) {
            if (productItem.quantity > 1) {
                productItem.price = productItem.price + (productItem.price / productItem.quantity);
                productItem.quantity = productItem.quantity + 1;
            }
            else {
                productItem.quantity = productItem.quantity + 1;
                productItem.price = productItem.price * productItem.quantity;
            }
            $scope.updateCart(productItem)
        };

        $scope.decreaseQuantity = function (productItem) {
            if (productItem.quantity > 1) {
                productItem.price = productItem.price - (productItem.price / productItem.quantity);
                productItem.quantity = productItem.quantity - 1;
                $scope.updateCart(productItem)
            }
            else{
                $scope.showConfirm(productItem);
            }
        };

        $scope.updateCart = function (productItem) {
            $scope.cartItems = $scope.cartItems.filter(function (obj) {
                //console.log(obj);
                if (obj.name == productItem.name) {
                    console.log(obj);
                    obj.quantity = productItem.quantity;
                    obj.price = productItem.price;
                }
                return obj;
            });
            console.log($scope.cartItems);
            CartData.copyCart($scope.cartItems);
            $scope.cartTotal = $scope.getCartTotal();
        };

        $scope.$watchCollection('cartItems', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                console.log("watch triggered !!");
                CartData.setCart(newValue);
                $scope.cartTotal = $scope.getCartTotal();
            }
        });




        $scope.getCartTotal = function () {
            var total = 0;
            console.log($scope.cartItems);
            //CartData.setCart($scope.cartItems)
            angular.forEach($scope.cartItems, function (item) {
                console.log(item);
                if ($scope.cartItems.length > 0 && item.price)
                    total = total + (item.price);
                else
                    total = 0
            })
            return total;
        };

        $scope.cartTotal = $scope.getCartTotal();














        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
          //used for menu buttons based on current page logics
        $scope.currentPage = toState.url;
      });

      $scope.takeTODelete = function() {
          $scope.requestDelete = !$scope.requestDelete;
        $rootScope.$emit("CallDelete", {});
      }

      $scope.$on('$locationChangeSuccess', function(event) {
        console.log($location.path())
        $scope.currentPath = $location.path();
      });

      $scope.composeSMS = function() {
        $scope.$broadcast('composeSMS');
      };

      $scope.$watchCollection(function () { return CartData.getCart(); }, function (newValue, oldValue) {
        if (newValue !== oldValue)
        {
          $scope.cartList=CartData.getCart();
          $scope.grandTotal = $scope.getcartTotal();
        }
      });

      $scope.getcartTotal = function() {
        angular.forEach($scope.cartList, function(item, key){
          if(item.price) {
            $scope.grandTotal = $scope.grandTotal + (item.price);
          }
        });
      }
      // call to register automatically upon device ready
      ionPlatform.ready.then(function (device) {
        //alert(device);
        window.localStorage['MeherDeviceId']  = $cordovaDevice.getUUID();
        $scope.register();
      });


      // Register
      $scope.register = function () {
        var config = null;

        if (ionic.Platform.isAndroid()) {

          config = {
            "senderID": "181306712234" // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
          };
        }
        else if (ionic.Platform.isIOS()) {
          config = {
            "badge": "true",
            "sound": "true",
            "alert": "true"
          }
        }

        $cordovaPush.register(config).then(function (result) {
          console.log("Register success " + result);
          //$cordovaToast.showShortCenter('Registered for push notifications');
          $scope.registerDisabled=true;
          // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
          if (ionic.Platform.isIOS()) {
            $scope.regId = result;
            storeDeviceToken("ios");
          }
        }, function (err) {
          console.log("Register error " + err)
        });
      }

      // Notification Received
      $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
        console.log(JSON.stringify([notification]));
        if (ionic.Platform.isAndroid()) {
          handleAndroid(notification);
        }
        else if (ionic.Platform.isIOS()) {
          handleIOS(notification);
          $scope.$apply(function () {
            $scope.notifications.push(JSON.stringify(notification.alert));
          })
        }
      });

      // Android Notification Received Handler
      function handleAndroid(notification) {
        // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
        //             via the console fields as shown.
        console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);
        if (notification.event == "registered") {
          $scope.regId = notification.regid;
          storeDeviceToken("android");
        }
        else if (notification.event == "message") {
          $cordovaDialogs.alert(notification.message, "Push Notification Received");
          $scope.$apply(function () {
            $scope.notifications.push(JSON.stringify(notification.message));
          })
        }
        else if (notification.event == "error")
          $cordovaDialogs.alert(notification.msg, "Push notification error event");
        else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
      }

      // IOS Notification Received Handler
      function handleIOS(notification) {
        // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
        // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
        // the notification when this code runs (weird).
        if (notification.foreground == "1") {
          // Play custom audio if a sound specified.
          if (notification.sound) {
            var mediaSrc = $cordovaMedia.newMedia(notification.sound);
            mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
          }

          if (notification.body && notification.messageFrom) {
            $cordovaDialogs.alert(notification.body, notification.messageFrom);
          }
          else $cordovaDialogs.alert(notification.alert, "Push Notification Received");

          if (notification.badge) {
            $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
              console.log("Set badge success " + result)
            }, function (err) {
              console.log("Set badge error " + err)
            });
          }
        }
        // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
        // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
        // the data in this situation.
        else {
          if (notification.body && notification.messageFrom) {
            $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
          }
          else $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
        }
      }

      // Stores the device token in a db using node-pushserver (running locally in this case)
      //
      // type:  Platform type (ios, android etc)
      function storeDeviceToken(type) {
        // Create a random userid to store with it
        var onSuccess = function(position) {
          window.currentLoc = position;
          var user = {deviceID: window.localStorage['MeherDeviceId'], user: window.localStorage['MeherDeviceId'] , type: type, token: $scope.regId };
          //alert("Post token for registered device with data " + JSON.stringify(user));
          //Log.d("meher" , "Post token for registered device with data")

          $http.post('http://getmeher.com:8000/subscribe', JSON.stringify(user))
              .success(function (data, status) {
                //alert("yes done" + data)
                console.log("Token stored, device is successfully subscribed to receive push notifications.");
                //alert("Token stored, device is successfully subscribed to receive push notifications.");
              })
              .error(function (data, status) {
                //alert("no not done")
                console.log("Error storing device token." + data + " " + status)
                //alert("Error storing device token." + data + " " + status)
              }
          );
        };

// onError Callback receives a PositionError object
//
        function onError(error) {}
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      }

      // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
      // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
      // time the app opens which this currently does. However in many cases you will always receive the same device token as
      // previously so multiple userids will be created with the same token unless you add code to check).
      function removeDeviceToken() {
        var tkn = {"token": $scope.regId};
        $http.post('http://getmeher.com:8000/unsubscribe', JSON.stringify(tkn))
            .success(function (data, status) {
              console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
              //alert("Token removed, device is successfully unsubscribed and will not receive push notifications.");
            })
            .error(function (data, status) {
              console.log("Error removing device token." + data + " " + status)
              //alert("Error removing device token." + data + " " + status)
            }
        );
      }

      // Unregister - Unregister your device token from APNS or GCM
      // Not recommended:  See http://developer.android.com/google/gcm/adv.html#unreg-why
      //                   and https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/index.html#//apple_ref/occ/instm/UIApplication/unregisterForRemoteNotifications
      //
      // ** Instead, just remove the device token from your db and stop sending notifications **
      $scope.unregister = function () {
        console.log("Unregister called");
        Log.d("meher" , "Unregister called")

        //alert("Unregister called");
        removeDeviceToken();
        $scope.registerDisabled=false;
        //need to define options here, not sure what that needs to be but this is not recommended anyway
//        $cordovaPush.unregister(options).then(function(result) {
//            console.log("Unregister success " + result);//
//        }, function(err) {
//            console.log("Unregister error " + err)
//        });
      }


    })





    .controller('AppCtrl', function($scope, $ionicModal, $timeout,$window) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      // Form data for the login modal
      $scope.loginData = {};

      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeLogin = function() {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.login = function() {
        $scope.modal.show();
      };

      // Perform the login action when the user submits the login form
      $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
        var body = JSON.stringify($scope.loginData);
        $window.location = "mailto:info@getmeher.com?subject=Add Store&body="+body;
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);
      };
    })

