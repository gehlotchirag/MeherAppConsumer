/**
 * Created by chirag on 25/09/15.
 */
angular.module('starter.controllers')

    .controller('showCaseCtrl', function($scope, $http, CartData,$stateParams,$location,$timeout, $ionicSlideBoxDelegate) {
      $scope.storelistId = ($stateParams.storelistId);
      $scope.storeId = ($stateParams.storeId);
      $scope.productId = ($stateParams.productId);
      $scope.subProduct = ($stateParams.subProductId);
      console.log($scope.subProduct);
      $scope.productCatalog = window.category.productCategory.filter(function (el) {
        return el.deeplink == $scope.subProduct;
      });
      $scope.productCatalog = $scope.productCatalog[0];
      console.log($scope.productCatalog);
      console.log($scope.subProduct,$scope.productId,$scope.storeId, $scope.storelistId);

      var dataObj = {link : $scope.productId};

      var res = $http.post('http://getmeher.com:3000/'+$scope.subProduct, dataObj);

      res.success(function(data, status, headers, config) {
        $scope.product = data[0];
        $timeout( function() {
          $ionicSlideBoxDelegate.update();
        }, 50);
      });
      res.error(function(data, status, headers, config) {
        alert("unable to get product info");
      });

      $scope.addToCart = function(productItem) {
        CartData.setCartItem(productItem);
        $location.path('/app/order');
      }

    });
