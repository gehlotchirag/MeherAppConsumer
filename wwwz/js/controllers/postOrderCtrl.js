/**
 * Created by chirag on 25/09/15.
 */
angular.module('starter.controllers')

    .controller('postOrderCtrl', function($scope, $http, $stateParams,CartData,StoreData) {
      $scope.cartItems = CartData.getCart();
      $scope.StoreSelected = StoreData.getStore();
      $scope.CallTel = function(tel) {
        window.open('tel:'+'+91'+tel)
        //window.location.href = 'tel:'+ tel;
      }

    });
