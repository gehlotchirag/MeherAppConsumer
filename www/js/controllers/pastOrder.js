angular.module('starter.controllers')

    .controller('pastOrderCtrl', function($scope,$http,$location) {
        //if(true){
        if(window.localStorage['MeherMobile']){
            $http({
                method: 'GET',
                //url: 'http://www.getmeher.com:3000/orders',
                url: 'http://www.getmeher.com:3000/orders/user/:'+window.localStorage['MeherMobile'],
                data:$scope.feedbackData,
            }).then(function successCallback(response) {
                $scope.orders=response.data;
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
        else{
            alert("No Orders found !");
        }



        $scope.postOrder = function (currentOrder) {
            $location.url("/app/postorder/"+currentOrder._id);
        }
    });