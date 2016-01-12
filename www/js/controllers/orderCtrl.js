/**
 * Created by chirag on 19/09/15.
 */
angular.module('starter.controllers')

    .controller('orderCtrl', function ($scope, $http, $stateParams, CartData, StoreData, $ionicPopup, $timeout, $location, $window, $cordovaSQLite, $rootScope, $ionicPlatform) {
        //$scope.cartList=CartData.getCart();
        $scope.cartMsg = "";
        $scope.cartItems = CartData.getCart();
        $scope.StoreSelected = StoreData.getStore();
        $scope.formData = {};
        $scope.formData.userAddress = "";
        $scope.formData.userSublocality = $window.subLocality.formatted_address;
        $scope.orderPost = {};
        $scope.showDelete = false;
        $scope.saveToDb = false;
        var originalAddress;


        $scope.lookupLocalDB = function() {
            var query = "SELECT * FROM Meher_user WHERE addLine2 = ? ";
          //console.log(db);
            $cordovaSQLite.execute(db, query,[$scope.formData.userSublocality]).then(function (result) {
                if(result.rows.length > 0) {
                    window.localStorage['MeherUser'] = JSON.stringify(result.rows.item(0));
                    window.localStorage['MeherMobile'] = JSON.stringify(result.rows.item(0).mobile);
                    $scope.formData.userAddress = result.rows.item(0).addLine1;
                    originalAddress = result.rows.item(0).addLine1;
                } else {
                    $scope.saveToDb = true;
                }
            }, function(error) {
                console.error(error);
            });
        };

        $ionicPlatform.ready(function() {
            //alert(JSON.stringify(window.localStorage['MeherUser']));
            //if (typeof window.localStorage['MeherUser'] == "undefined") {
            $scope.lookupLocalDB();
            //$scope.checkLocalDB ();
        });


        $scope.$on("$ionicView.enter", function () {
            console.log(CartData.getCart());
            $scope.cartItems = CartData.getCart();
            $scope.cartTotal = $scope.getCartTotal();
        });

        $scope.$watchCollection('cartItems', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                console.log("watch triggered !!");
                CartData.setCart(newValue);
                $scope.cartTotal = $scope.getCartTotal();
            }
        });


        $scope.onDeleteItem = function (item, key) {
            console.log($scope.cartItems);
            $scope.cartItems.splice(key, 1);
            console.log($scope.cartItems);
            //CartData.setCart($scope.cartItems);
        };

        $rootScope.$on("CallDelete", function () {
            $scope.toggleShowDelete();
        });

        $scope.toggleShowDelete = function () {
            $scope.showDelete = !$scope.showDelete;
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
        };

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


        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                //intent: '' // send SMS with the native android SMS messaging
                //intent: '' // send SMS without open any other app
                intent: 'INTENT' // send SMS inside a default SMS app
            }
        };

        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Enter Address',
                template: 'Please enter your Address'
            });
            alertPopup.then(function (res) {
                console.log("closed");
                //document.getElementById("house-address").focus();
                focus('house-address');
            });
        };

        $scope.insertDB = function() {
            var user = {};
            angular.copy($scope.orderPost.customer, user);

            var query = "INSERT INTO Meher_user (deviceID , mobile ,addLine1 ,addLine2 ) VALUES (?,?,?,?)";
            $cordovaSQLite.execute(db, query, [window.localStorage['MeherDeviceId'],window.localStorage['MeherMobile'],$scope.formData.userAddress, $scope.formData.userSublocality]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
            }, function (err) {
                console.error(err);
            });
        };

        $scope.updateDB = function () {
            var query = "UPDATE Meher_user SET addLine1 = ? WHERE addLine2 = ?;";
            $cordovaSQLite.execute(db, query,[$scope.formData.userAddress,$scope.formData.userSublocality]);
        };

        $scope.retriveLocal = function () {

            if (!$scope.formData.userAddress) {
                $scope.showAlert();
            }
            else{

                $scope.makeOrder();
                //if(window.localStorage.getItem("MeherUser") !== undefined && window.localStorage.getItem("MeherMobile") !== undefined && window.localStorage.getItem("MeherMobile") !== null && window.localStorage.getItem("MeherMobile") !== "null" && window.localStorage.getItem("MeherMobile") !== "undefined" ){
                //    $scope.makeUser();
                //}
                //else{
                    var query = "SELECT * FROM Meher_user WHERE deviceId = ?";
                    $cordovaSQLite.execute(db, query, [window.localStorage['MeherDeviceId']]).then(function (result) {
                        if (result.rows.length > 0) {
                            window.localStorage['MeherUser'] = JSON.stringify(result.rows.item(0));
                            window.localStorage['MeherMobile'] = JSON.stringify(result.rows.item(0).mobile);
                            if(window.localStorage.getItem("MeherUser") !== undefined && window.localStorage.getItem("MeherMobile") !== undefined && window.localStorage.getItem("MeherMobile") !== null && window.localStorage.getItem("MeherMobile") !== "null" && window.localStorage.getItem("MeherMobile") !== "undefined" ){
                              if (originalAddress !== $scope.formData.userAddress)
                              {
                                if ($scope.saveToDb ==true)
                                  $scope.insertDB();
                                else
                                  $scope.updateDB();
                              }
                                $scope.makeUser();
                            }
                            else {
                                $scope.saveOrdergotoLogin();
                            }
                            //$scope.makeUser();
                        } else {
                            $scope.saveOrdergotoLogin();
                        }
                    }, function (error) {
                        console.error(error);
                    });

                //}
            }
        };


        $scope.saveOrdergotoLogin = function () {
            window.localStorage['orderPost'] = JSON.stringify($scope.orderPost);
            window.localStorage['currentOrder'] = JSON.stringify($scope.cartMsg);
            $location.url("/app/login");
        };

        $scope.makeUser = function () {
          //alert("making order")
          window.mixpanel.track(
              "MeherOrderNEW",
              $scope.orderPost
          );

          $scope.orderPost["customer"]["mobile"] = window.localStorage['MeherMobile'];
            $http({
                url: 'http://getmeher.com:3000/orders',
                method: "POST",
                data: $scope.orderPost
            }).then(function (response) {
                    // success
                    //alert("orderSentToServe");
                  //alert("orderSentToServe");
                  //alert(JSON.stringify(response.data._id));
                  console.log(response);
                  console.log("*********** $$$$$$$$$$$$$$$$$$$$ *************** $$$$$$$$$$$$$$$$$$$$ ********");
                   CartData.emptyCart();
                  console.log("cart empty");
                  //alert("cart empty");
                  //alert(JSON.stringify(CartData.getCart));
                  $location.url("/app/postorder/"+response.data._id);
                  console.log("*********** XXXXXXXXXXXX *************** XXXXXXXXXXXX ********");

                },
                function (response) { // optional
                    // failed
                    //alert(JSON.stringify(response));
                    console.log(response);
                });
            $scope.cartMsg = $scope.cartMsg + '\n' + "Ordered Using Meher App - https://goo.gl/cxqKEc";
            console.log($scope.cartMsg);
        };



        $scope.makeOrder = function () {
            console.log($scope.formData.userAddress);
            $scope.cartMsg = "";
            //$scope.saveLocally()
            angular.forEach($scope.cartItems, function (value, key) {
                if (value.quantity) {
                    $scope.cartMsg = $scope.cartMsg + value.quantity;
                    if (value.unit)
                        $scope.cartMsg = $scope.cartMsg + value.unit + " " + value.name + "\n";
                    else
                        $scope.cartMsg = $scope.cartMsg + " " + value.name + "\n";
                }
                else
                    $scope.cartMsg = $scope.cartMsg + '-' + value.name + "\n";
            });
            $scope.cartMsg = $scope.cartMsg + "Address:" + "\n";
            $scope.cartMsg = $scope.cartMsg + $scope.formData.userAddress + "\n" + $scope.formData.userSublocality;
            $scope.orderPost.store = $scope.StoreSelected;
            $scope.orderPost.orderStatus = "sent";
            $scope.orderPost.order = {
                orderitem: $scope.cartItems
            };

            $scope.orderPost.customer = {
                deviceId: window.localStorage['MeherDeviceId'],
                addLine1: $scope.formData.userAddress,
                addLine2: $scope.formData.userSublocality
            };

            // retrive from local db
            //query = *
            //$cordovaSQLite.execute  ()
            //      { window.meherUsserMobile = result.rows.item(0).mobile}
            // if (result.rows.item(0).addLine1)
            //      { window.meherUsseradress = result.rows.item(0).addLine1}
            //      formData.userAddress = window.meherUsseradress
            // if (result.rows.item(0).addLine1)
            //      { window.meherUsseradress = result.rows.item(0).addLine2}

            //
            //$scope.orderPost.customer = {
            //  id:"OrderUser",
            //  mobile:$scope.localUserMobile,
            //  Address:$scope.formData.userAddress + ", " + $scope.formData.userSublocality
            //};
            //
            //console.log("******");
            //console.log($scope.orderPost);
            //
            //$http({
            //  url: 'http://getmeher.com:3000/orders',
            //  method: "POST",
            //  data: $scope.orderPost
            //}).then(function(response) {
            //      // success
            //      alert("orderSentToServe");
            //      console.log(response);
            //    },
            //    function(response) { // optional
            //      // failed
            //      console.log(response);
            //    });
            //
            //$scope.cartMsg = $scope.cartMsg +'\n'+"Ordered Using Meher App - https://goo.gl/cxqKEc";
            //console.log($scope.cartMsg);
            //
            //document.addEventListener("deviceready", function () {
            //  $cordovaSms
            //      .send($scope.StoreSelected.mobile, $scope.cartMsg, options)
            //      .then(function () {
            //           //alert('Sending Order');
            //        // Success! SMS was sent
            //        $location.url("/app/postorder");
            //      }, function (error) {
            //        alert(error);
            //        // An error occurred
            //
            //      });
            //});
        };
    });