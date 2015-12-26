/**
 * Created by chirag on 24/10/15.
 */
angular.module('starter.controllers')

    .controller('loginCtrl', function($scope, $ionicPopup, $timeout, $window, $location,$http, $cordovaDevice,$ionicPlatform,$cordovaSQLite,CartData) {
        $scope.loginData = {};
        $scope.loginData.deviceId = window.localStorage['MeherDeviceId'];
        $scope.loginData.opt = null;

        if (typeof window.localStorage['orderPost'] !== "undefined") {
            $scope.orderPost = JSON.parse(window.localStorage['orderPost']);
            $scope.cartMsg = JSON.parse(window.localStorage['currentOrder']);
        }
        $scope.opt;
        $scope.otpRequested = false;

        //if ($scope.loginData.mobile){
        //  $scope.otpRequested = true;
        //}
        //else {
        //  $scope.otpRequested = false;
        //}

        //if ( typeof window.localStorage['otp'] !== "undefined")
        //  $scope.otpRequested = true;
        //else
        //  $scope.otpRequested = false;

        $scope.mobileAlert = function (title, str) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: str
            });
            alertPopup.then(function (res) {
            });
        };

        //$scope.verifiedOtp = function() {
        //  if (window.localStorage['otp'] == $scope.loginData.opt) {
        //    $scope.sendStoreOPT();
        //  }
        //  else {
        //    $scope.mobileAlert('Incorrect OTP','Please enter correct OTP send in SMS');
        //  }
        //};

        $scope.backToLogin = function() {
            $scope.loginData.mobile = null;
            $scope.otpRequested = !$scope.otpRequested;
        };

        //$ionicPlatform.ready(function () {
        //  $scope.loginData.deviceId = $cordovaDevice.getUUID();
        //  window.db = $cordovaSQLite.openDB("my.db");
        //  $cordovaSQLite.execute(window.db, "CREATE TABLE IF NOT EXISTS Meher_user (deviceID text, mobile integer,type text)");
        //  //$scope.select($scope.loginData.deviceId);
        //});

        //$scope.select = function(deviceId) {
        //  var query = "SELECT * FROM Meher_user WHERE deviceId = ?";
        //  $cordovaSQLite.execute(window.db,query,[deviceId]).then(function(result) {
        //    if(result.rows.length > 0) {
        //      window.meherUser=JSON.stringify(result.rows.item(0));
        //      window.mobile=JSON.stringify(result.rows.item(0).mobile);
        //      window.meherLoggedin= true;
        //      $location.url("/app/activeorders");
        //    } else {
        //      window.meherLoggedin = false;
        //      //alert("NO ROWS EXIST");
        //    }
        //  }, function(error) {
        //    console.error(error);
        //  });
        //};


        $scope.makeUser = function () {
             $scope.orderPost["customer"]["mobile"] = window.localStorage['MeherMobile'];
            $http({
                url: 'http://getmeher.com:3000/orders',
                method: "POST",
                data: $scope.orderPost
            }).then(function (response) {
                    // success
                   CartData.emptyCart();
                   $location.url("/app/postorder/"+response.data._id);
                },
                function (response) { // optional
                    // failed
                    //alert(JSON.stringify(response));
                    console.log(response);
                });
            $scope.cartMsg = $scope.cartMsg + '\n' + "Ordered Using Meher App - https://goo.gl/cxqKEc";
            console.log($scope.cartMsg);
        };

        $scope.saveUser = function() {
            window.localStorage['MeherMobile'] = $scope.loginData.mobile;
            $scope.orderPost.customer.mobile = window.localStorage['MeherMobile'];
            var user = {};
            angular.copy($scope.orderPost.customer, user);
            var query = "INSERT INTO Meher_user (deviceID , mobile ,addLine1 ,addLine2 ) VALUES (?,?,?,?)";
            $cordovaSQLite.execute(db, query, [user.deviceId,user.mobile,user.addLine1, user.addLine2]).then(function(res) {
                console.log("INSERT ID -> " + res.insertId);
                $scope.orderPost = JSON.parse(window.localStorage['orderPost']);
                $scope.cartMsg = JSON.parse(window.localStorage['currentOrder']);
                if ($scope.orderPost){
                    $scope.makeUser();
                }
            }, function (err) {
                console.error(err);
            });
        };

        $scope.verifiedOtp = function() {
            if ($scope.opt == $scope.loginData.opt) {
                $scope.loginData.opt = null;
                //alert(JSON.parse(window.localStorage['MeherTempUser']))
                //window.localStorage['MeherUser'] = JSON.parse(window.localStorage['MeherTempUser']);
                $scope.saveUser();
            }
            else {
                $scope.mobileAlert('Incorrect OTP','Please enter correct OTP send in SMS');
            }
        };

        $scope.backToLogin = function() {
            $scope.loginData.mobile = null;
            $scope.otpRequested = !$scope.otpRequested;
        };

        $scope.sendOPT = function() {
            if (!$scope.loginData.mobile || $scope.loginData.mobile.length !== 10) {
                $scope.mobileAlert("Enter Mobile","plese enter 10 DIGIT mobile number");
            }
            else {
                window.localStorage['otp'] = Math.floor(Math.random() * 9000) + 1000;
                $scope.opt = window.localStorage['otp'];
                //var msg = $scope.opt +" is your OTP Code for Meher."+"\n"+" Order instantly from Meher.";
                var msg = window.localStorage['otp'] +" is your OTP code for Meher app";
                var mobile = $scope.loginData.mobile;

                var reqURL = 'https://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=';
                reqURL += '91' + mobile + '&msg=' + encodeURI(msg);
                reqURL += '&msg_type=TEXT&userid=2000141701&password=Gandhi007&auth_scheme=PLAIN';

                console.log(reqURL)
                $http({
                    url: reqURL,
                    method: "GET"
                }).then(function(response) {
                        // success
                        //alert("SMS Send" +JSON.stringify(response));
                        console.log(JSON.stringify(response));
                    },
                    function(response) { // optional
                        // failed
                        $scope.downloadSMS = null;
                        console.log(JSON.stringify(response));
                        //alert("SMS not Send" +JSON.stringify(response));
                    });
                //alert($scope.opt);
                //$http({
                //  url: 'http://api.smscountry.com/SMSCwebservice_bulk.aspx?',
                //  method: "POST",
                //  params: {
                //    User:"mehertech",
                //    passwd:"developer007",
                //    mobilenumber: mobile ,
                //    message: msg,
                //    sid:"mehera",
                //    mtype:"N",
                //    DR:"Y"
                //  }
                //}).then(function(response) {
                //      // success
                //      //alert("SMS Send");
                //      console.log(response);
                //    },
                //    function(response) { // optional
                //      // failed
                //      $scope.downloadSMS = null;
                //      console.log(response);
                //    });
                $scope.otpRequested = true;
            }
        };


    });