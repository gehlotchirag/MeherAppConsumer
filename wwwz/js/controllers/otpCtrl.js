/**
 * Created by chirag on 24/10/15db
 */
angular.module('starter.controllers')

    .controller('otpCtrl', function($scope, $location,$cordovaSQLite) {
      $scope.currentMobile = JSON.parse(window.localStorage['meherRetailMobile']);
      $scope.currentShop = JSON.parse(window.localStorage['meherRetailShop']);

      $scope.execute = function(deviceID,mobile,type) {
        var query = "INSERT INTO Meher_user (deviceID, mobile,type) VALUES (?,?,?)";
        $cordovaSQLite.execute(window.db, query, [deviceID, mobile, type]).then(function(res) {
          alert("insertId: " + res.insertId);
        }, function (err) {
          alert(err);
        });
      };

      $scope.makeUser = function() {
        //alert("saving");
        //retrive local data
        alert(window.localStorage['currentOrder']);
        alert(window.localStorage['orderPost']);
        alert(window.localStorage['meherUserMobile']);

        console.log(window.localStorage['currentOrder']);
        console.log(window.localStorage['orderPost']);
        console.log(window.localStorage['meherUserMobile']);

        $scope.cartMsg = window.localStorage['currentOrder'];
        $scope.orderPost = window.localStorage['orderPost'];
        $scope.localUserMobile = window.localStorage['meherUserMobile'];
        $scope.orderPost.customer["mobile"] = $scope.localUserMobile;

        console.log("******");
        console.log($scope.orderPost);

        $http({
          url: 'http://getmeher.com:3000/orders',
          method: "POST",
          data: $scope.orderPost
        }).then(function(response) {
              // success
              alert("orderSentToServe");
              console.log(response);
            },
            function(response) { // optional
              // failed
              console.log(response);
            });

        $scope.cartMsg = $scope.cartMsg +'\n'+"Ordered Using Meher App - https://goo.gl/cxqKEc";
        console.log($scope.cartMsg);

        document.addEventListener("deviceready", function () {
          $cordovaSms
              .send($scope.orderPost.store.mobile, $scope.cartMsg, options)
              .then(function () {
                //alert('Sending Order');
                // Success! SMS was sent
                $location.url("/app/postorder");
              }, function (error) {
                alert(error);
                // An error occurred

              });
        });
      };

      $scope.verifiedLogin = function() {
        alert(JSON.stringify(window.localStorage['orderPost']));
        //$scope.makeUser();
        var type;
        if ($scope.currentShop)
          type = "store";
        else
          type = "store";
        var deviceID =  (window.localStorage['deviceID']);
        var mobile = $scope.currentMobile;
        $scope.execute(deviceID,mobile,type);
        $location.url("/app/activeorders");
      };
    });