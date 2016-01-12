angular.module('starter.controllers')

    .controller('postOrderCtrl', function($scope, $http, $stateParams,CartData,StoreData, $ionicPopup,$state,$ionicHistory) {
        //$scope.order= JSON.parse(window.localStorage['orderPost'] || '{}');
        $scope.orderId=$stateParams.orderId;
        $scope.order={};
        $http({
            method: 'GET',
            url: 'http://getmeher.com:3000/orders/' + $scope.orderId
        }).then(function successCallback(response) {

            $scope.order = response.data;
            console.log($scope.status);
            $scope.setResopnse();
            $scope.setDateDiff();

        }, function errorCallback(response) {
            console.log(response);
            $scope.setResopnse();
        });

        $scope.setResopnse = function (){
            if(!$scope.order.feedback){
                $scope.order.feedback={
                    "onTime":0,
                    "quality":1,
                    "rating":3
                }

            }
        }
        $scope.setDateDiff= function(){
            var dateNow = new Date(Date.now());
            console.log(dateNow);
            var dateCreated = new Date($scope.order.created);
            console.log(dateCreated);
            $scope.timeDiff=Math.ceil(new Date(dateNow.getTime() - dateCreated.getTime())/ (1000 * 60 ));
            console.log($scope.timeDiff);
        }


        $scope.commentData=function(comment){
            $scope.order.feedback.comments = comment;
            console.log($scope.order);
            console.log($scope.feedbackData);
        };

        $scope.showPopup = function() {
            var promptPopup=$ionicPopup.prompt({
                title: 'Comment',
                template: 'Comment Here',
                inputType:'textbox',
                inputPlaceholder:'Type your comment here'

            });
            promptPopup.then(function(res) {
                if(res) {
                    $scope.commentData(res);
                    $scope.makePopup();

                } else {
                    console.log('You are not sure');
                }
            });
        };
        $scope.makePopup = function() {
            var promptPopup=$ionicPopup.confirm({
                title: 'Comment',
                template: 'Your feedback is sent',


            });
            promptPopup.then(function(res) {
                if(res) {
                    // console.log($scope.commit());
                    //$scope.comment();
                } else {
                    console.log('You are not sure');
                }
            });
        };


        // Get Order status



      // CANCEL ORDER HERE-->

      $scope.attemptCancel = function(){
        if($scope.timeDiff < 30){
          $scope.cancelOrder();
        }
        else
          alert("You cannot cancel your order now!");
      }

      $scope.cancelOrder = function(){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $http({
          method: 'PUT',
          url: 'http://getmeher.com:3000/orders/'+ $scope.orderId+'/cancelled',
          data: $scope.order
        }).then(function successCallback(response) {
          console.log(response);
          alert("Your order was cancelled successfully!");
          $state.go('app.categories');

          //$location.url('/app/categories');
          // this callback will be called asynchronously
          // when the response is available
        }, function errorCallback(response) {
          console.log(response);
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
      };

//      CANCEL ORDER END -X-


        $scope.sendFeedback = function() {
            console.log($scope.feedbackData)

            $http({
                method: 'PUT',
                url: 'http://getmeher.com:3000/orders/' + $scope.orderId,
                data: {feedback: $scope.feedbackData}

            }).then(function successCallback(response) {
                console.log(response);
                $scope.makePopup();
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

        };



        $scope.buttonClicked = function(index){
            $scope.selectedIndex = index;
            $scope.$apply();
        }

        $scope.cartItems = CartData.getCart();
        $scope.StoreSelected = StoreData.getStore();
        $scope.CallTel = function() {
            window.open('tel:'+'+91'+$scope.order.store.mobile)
            //window.location.href = 'tel:'+ tel;
        }


        $scope.timelyDeliveryButton = function(index){


            $scope.onTime=index;
            console.log($scope.onTime);
            $scope.$apply();
            $scope.order.onTime = $scope.onTime;
        }
        $scope.productQualityButton = function(index){


            $scope.productQuality = index;
            console.log($scope.productQuality);
            $scope.$apply();
            $scope.order.quality = $scope.productQuality;
        }

    });
