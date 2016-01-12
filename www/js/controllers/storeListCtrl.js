/**
 * Created by chirag on 22/09/15.
 */
angular.module('starter.controllers')
    .controller('StorelistCtrl', function($scope, $http, $stateParams,CartData, StoreData,$location,$ionicPopup) {
      $scope.areaLat = 0;
      $scope.areaLng = 0;
      $scope.pageNumber=0;
      $scope.storeList=[];
      $scope.storelistId = ($stateParams.storelistId);
      $scope.cartItems = CartData.getCart();
      $scope.categoryImage = window.category.image;

      $scope.$on('locationChanged', function(event, data) {
        if(data.geometry){
          $scope.pageNumber= 0;
          $scope.areaLat = (data.geometry.location.lat());
          $scope.areaLng = (data.geometry.location.lng());
          console.log($scope.areaLat,$scope.areaLng);
          fetchStoreList($scope.areaLat,$scope.areaLng);
        }
      });



      function fetchStoreList(lat,lng) {
        console.log("fetchStoreList called" + $scope.pageNumber);
        $scope.pageNumber = $scope.pageNumber+1;
        $http.get('http://getmeher.com:3000/'+window.category.link+'/near/'+lng+'/'+lat+'/'+$scope.pageNumber).
        then(function (response) {
          if(response.data.length > 0) {
            $scope.storeList = response.data;
            $scope.storeMsg = null;
          }
          else
            $scope.storeMsg = "Currently not serving in your area !!";
        }, function (response) {
          $scope.storeMsg = "Error retrieving data";
        });
      }

      $scope.distanceTo = function(store) {
        if (store.loc){
          var distance = GreatCircle.distance( store.loc.coordinates[0],store.loc.coordinates[1],$scope.areaLng, $scope.areaLat)
          store.distance = distance;
          distance = distance.toFixed(1);
          return distance;
        }
      };

      $scope.showAlertGoToCart = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Cart Not Empty',
          template: 'Please settle previous cart, before changing store.'
        });
        alertPopup.then(function(res) {
          $location.url("/app/order");
        });
      };

      $scope.goToStore = function(storelistId,storeInfo, distKM) {
        var currentStore = StoreData.getStore();
        $scope.cartItems = CartData.getCart();
        console.log($scope.cartItems);
        if ($scope.cartItems.length > 0 && currentStore.name !==storeInfo.name)
        {
          $scope.showAlertGoToCart();
        }
        else{
          StoreData.setStore(storeInfo);
          StoreData.setStoreDistance(distKM);
          $location.url("/app/categories/"+storelistId+"/"+storeInfo.name);
        }
      }

      $scope.loadMore = function() {
        console.log("yessss")
        console.log($scope.storeList)
        if ($scope.storeList.length>0){
          console.log("loadmore");
          $scope.pageNumber = $scope.pageNumber + 1;
          console.log($scope.pageNumber);
          $http.get('http://getmeher.com:3000/shop-groceries/near/' + $scope.areaLng + '/' + $scope.areaLat + '/' + $scope.pageNumber).
          then(function (response) {
            $scope.storeList = $scope.storeList.concat(response.data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function (response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
        }
        else{
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      };

      $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
      });


    });