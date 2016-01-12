angular.module('starter.controllers')

    .controller('storeCtrl', function($scope, $http, $stateParams,CartData,StoreData,$ionicLoading,$ionicSlideBoxDelegate,$location,$ionicFilterBar) {
      $scope.storelistId = ($stateParams.storelistId);
      $scope.storeId = ($stateParams.storeId);
      $scope.cartItems = CartData.getCart();
      $scope.StoreSelected = StoreData.getStore();
      $scope.StoreDistance = StoreData.getStoreDistance();
      $scope.customProduct = {};
      $scope.storeCategory = window.category;
      $scope.productCatalog = window.category.productCategory;
var loadInstance = true;
var getmore = true;
      var temp;


      $scope.$on("$ionicView.enter", function () {
        $scope.checkExisting();
      });

      $scope.slideHasChanged = function (index){
        $scope.checkExisting();
      };

      $scope.CallTel = function(tel) {
        window.open('tel:'+tel)
      };
      $scope.$on("unTick", function(event,productItem)

      {
        // alert(JSON.stringify(productItem.name));
        //$scope.checkExisting();
        console.log("In $on ");
        $scope.practice(productItem);


      })


      $scope.$on('someEvent', function(event,productItem)

      {
        // alert(JSON.stringify(productItem.name));
        //$scope.checkExisting();
        $scope.practice(productItem);


      });

      $scope.practice=function(productItem){
        $scope.currentObj =productItem ;
        var untickDone = false;
        console.log( '************');
        console.log( $scope.currentObj);
        var existingItems = $scope.productCatalog[$ionicSlideBoxDelegate.selected()].products;
        var i;
        for (i = 0; i < existingItems.length; i++) {
          if ($scope.currentObj.name == existingItems[i].name) {
            //alert("matched")
            console.log($scope.currentObj);
            $scope.productCatalog[$ionicSlideBoxDelegate.selected()].products[i].ordernow = false;
            untickDone = true;
            break;
          }
        }

        if(!untickDone) {
          var j;
          for (j = 0; j < $scope.productCatalog.length; j++) {
            var existingItems = $scope.productCatalog[j].products;
            var i;
            for (i = 0; i < existingItems.length; i++) {
              if ($scope.currentObj.name == existingItems[i].name) {
                //alert("matched")
                console.log($scope.currentObj)
                $scope.productCatalog[j].products[i].ordernow = false;
                break;
              }
            }
          }

        }

      };

      $scope.CallTel = function(tel) {
        window.open('tel:'+tel)
      };

      $scope.$watchCollection('cartItems', function(newValue, oldValue) {
        if (newValue !== oldValue)
        {
          //console.log("@@@@@@@@@ called");
          CartData.setCart(newValue);
          console.log(CartData.getCart())
        }
      });

      $scope.updateCart = function(productItem) {
        console.log("UPDATE!!!!!!!!");
        $scope.cartItems = $scope.cartItems.filter(function( obj ) {
          //console.log(obj);
          if (obj.$$hashKey == productItem.$$hashKey)
          {
            console.log(obj);
            obj.quantity = productItem.quantity;
            obj.price = productItem.price;
          }
          return obj;
        });
        CartData.copyCart($scope.cartItems);
        console.log(CartData.getCart());
      };

      $scope.increaseQuantity = function(productItem) {
        if (productItem.quantity > 0){
          productItem.price = productItem.price + (productItem.price /productItem.quantity);
          productItem.quantity = productItem.quantity + 1;
        }
        else{
          productItem.quantity = productItem.quantity + 1;
          productItem.price = productItem.price * productItem.quantity ;
        }
        $scope.updateCart(productItem)
      };

      $scope.decreaseQuantity = function(productItem) {
        if (productItem.quantity > 1){
          productItem.price = productItem.price - (productItem.price /productItem.quantity);
          productItem.quantity = productItem.quantity - 1;
          $scope.updateCart(productItem)
        }
        else {
          for (var i in $scope.cartItems) {
            if ($scope.cartItems [i] === productItem) {
              //$scope.cartItems.splice(i, 1);
              console.log(productItem);
              $scope.addToCart(productItem,false,i);
              console.log(productItem);
            }
          }
          CartData.setCart($scope.cartItems);
          productItem.ordernow = false;

          $scope.updateCart(productItem);
        }
      };

      $scope.addcustomProduct = function() {
        var matches = true;
        var message = "";
        angular.forEach($scope.cartItems, function(item) {
          if (item.customQuantity)
            if ($scope.customProduct.name === item.name && $scope.customProduct.customQuantity === item.customQuantity) {
              matches = false;
              message = 'You have already selected to withdraw this item!';
            }
        });

        // add item to collection
        if (matches != false) {
          $scope.cartItems.push($scope.customProduct);
          message = 'Item Added!';
          $scope.customProduct ={};
        }
        $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
        console.log($scope.cartItems);
      };

      $scope.showProduct = function(storelistId,storeId,sublink,productLink) {
        $location.path('/app/categories/'+storelistId+'/'+storeId+'/'+sublink+'/'+productLink);
      };

      $scope.checkExisting = function () {
        $scope.cartItems = CartData.getCart();
        console.log($scope.cartItems)
        var existingItems = ($scope.productCatalog[$ionicSlideBoxDelegate.selected()].products);
        var i,j;
        for (i = 0; i < existingItems.length; i++) {
          for (j = 0; j < $scope.cartItems.length; j++) {
            $scope.productCatalog[$ionicSlideBoxDelegate.selected()].products[i].ordernow = false;
            if ($scope.cartItems[j].name == existingItems[i].name) {
              $scope.productCatalog[$ionicSlideBoxDelegate.selected()].products[i].ordernow = true;
              break;
            }
          }
        }
      };

      $scope.addToCart = function(productItem,checkStatus,index) {
        if(checkStatus){
          console.log("adding");
          $scope.cartItems.push(productItem);
          console.log($scope.cartItems);
          CartData.setCart($scope.cartItems);
          console.log(CartData.getCart());
        }
        else{
          console.log("removing")
          if (productItem.quantity>1){
            productItem.price = productItem.price / productItem.quantity;
            productItem.quantity =1;
          }
          //if (index != -1) {
          //    $scope.cartItems.splice(index, 1);
          //    //CartData.removeCart(productItem);
          //}

          for (var i in $scope.cartItems) {
            console.log(productItem);
            console.log($scope.cartItems[i]);

            if ($scope.cartItems[i]._id === productItem._id) {
              console.log("matched")
              $scope.cartItems.splice(i, 1);
            }
          }
          CartData.setCart($scope.cartItems);
          //CartData.copyCart($scope.cartItems);
          console.log(CartData.getCart());
        }
      };

      $scope.scrollCheck = function(index) {
        //alert($ionicSlideBoxDelegate.selected())
        if (loadInstance) {
//        if (loadInstance || getmore) {
          return true
        }
        else
        return false
        //if ($ionicSlideBoxDelegate.selected() == index ){
        //  alert("here"+index);
        //  return true
        //}
        //else {
        //  return false
        //}
      };


      //$scope.scrollCheck = function(index) {
      //  if ($ionicSlideBoxDelegate.selected() == index && $scope.productCatalog[$ionicSlideBoxDelegate.selected()].loadMore == true){
      //    return true;
      //  }
      //  else{
      //    return false;
      //  }
      //};

      var searchOn = false;
      var once = true;

      $scope.loadMoreProducts = function() {

        alert("loading more select" +$ionicSlideBoxDelegate.selected());
        //alert($scope.productCatalog + $ionicSlideBoxDelegate.selected());
        //alert($ionicSlideBoxDelegate.selected())
        //alert($ionicSlideBoxDelegate.selected())
        // alert($scope.productCatalog[$ionicSlideBoxDelegate.selected()])
        if($scope.productCatalog[$ionicSlideBoxDelegate.selected()])
          if(once == true && $scope.productCatalog[$ionicSlideBoxDelegate.selected()].loadMore == true) {
            once=false;
            var index = $ionicSlideBoxDelegate.selected();
            var productCategory = $scope.productCatalog[index].link;
            var pageNumber = $scope.productCatalog[index].pageNumber
            $http.get('http://getmeher.com:3000/'+$scope.productCatalog[0].link+'/'+productCategory+'/'+pageNumber).
            then(function (response) {
            //$scope.getProducts(productCategory, pageNumber).then(function (response) {
              $scope.$broadcast('scroll.infiniteScrollComplete');
//              loadInstance = false;

              if (response.data.length >0 ){
                angular.forEach(response.data, function (value, key) {
                  value.ordernow = false;

                  $scope.productCatalog[index].products.push(value);
                });
                $scope.productCatalog[index].pageNumber++;
              }
              else{
                $scope.productCatalog[index].loadMore = false;
              }
              once = true;
            })
          }
      };

      $scope.$on('$stateChangeSuccess', function() {
        alert('original')
        $scope.loadMoreProducts();
      });


      $scope.getProducts = function(productCategory,pageNumber) {
        alert(pageNumber)
         return $http.get('http://getmeher.com:3000/'+$scope.productCatalog[0].link+'/'+productCategory+'/'+pageNumber)
      };
      var filterBarInstance;
      $scope.showFilterBar = function () {
        filterBarInstance = $ionicFilterBar.show({
          items: $scope.productCatalog[$ionicSlideBoxDelegate.selected()].products,
          cancel: function () {
            console.log(temp);
            $scope.productCatalog[$ionicSlideBoxDelegate.selected()].products =temp;
          },
          update: function (filteredItems, filterText) {
            searchOn = true;
            console.log("%%%%%%%%%");
            console.log($scope.productCatalog[$ionicSlideBoxDelegate.selected()].products)
            if(temp == null)
            {
              temp = $scope.productCatalog[$ionicSlideBoxDelegate.selected()].products;
            }
            $scope.productCatalog[$ionicSlideBoxDelegate.selected()].products = "";
            if (filterText) {
              if (filterText.length > 2) {
                console.log(filterText);
                $http.get('http://getmeher.com:3000/'+$scope.productCatalog[0].link+'-'+'search'+'/'+filterText)
                    .then(function successCallback(response) {
                      console.log($scope.productCatalog[$ionicSlideBoxDelegate.selected()].products);
                      $scope.productCatalog[$ionicSlideBoxDelegate.selected()].products = response.data;
                      console.log($scope.productCatalog[$ionicSlideBoxDelegate.selected()].products);
                    }, function errorCallback(response) {
                    });
              }
            }
          }
        });
      };

    });