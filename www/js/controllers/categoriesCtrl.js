/**
 * Created by chirag on 30/09/15.
 */
angular.module('starter.controllers')

    .controller('CategoriesCtrl', function($scope,$location,$http,$ionicHistory) {
      $ionicHistory.clearHistory();

      $scope.categorylists = [];
      $scope.categoryTemp = [];
      $scope.categoryTemp = [
        {
          "title": "Grocery ",
          "subtitle": "Instantly order bread, butter, biscuits",
          "image": "img/grocery.jpg",
          "id": "Grocery",
          "link": "shop-groceries",
          "type": "general",
          "productCategory": [
            {
              "title": "Grocery",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "groceries",
              "imagefolder": "groceries"
            },
            {
              "title": "Packet-Food",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "packetfoods",
              "imagefolder": "groceries"
            },
            {
              "title": "Personal-Care",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "personalcares",
              "imagefolder": "groceries"
            },
            {
              "title": "House-Hold",
              "products": [

              ],
              "pageNumber": 1,
              "loadMore": true,
              "link": "households",
              "imagefolder": "groceries"

            }
          ]
        },
        {
          "title": "Fruits",
          "subtitle": "Get Fresh Fruits in minutes",
          "image": "img/fruits.png",
          "id": "Fruits",
          "link": "shop-fruits",
          "type": "general",
          "productCategory": [
            {
              "title": "Fruits",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "fruits",
              "imagefolder": "fruits"
            },
            {
              "title": "vegetables",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "vegetables",
              "imagefolder": "vegetables"
            },
            {
              "title": "leafy-vegetables",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "leafyvegetables",
              "imagefolder": "leafyvegetables"
            },
            {
              "title": "Sprouts",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "sproutsvegetables",
              "imagefolder": "sproutsvegetables"

            }
          ]
        },
        {
          "title": "Electronics",
          "subtitle": "Get best deal on mobile,TV from local shops",
          "image": "img/electronic.png",
          "id": 4,
          "link": "shop-electronics",
          "type": "electronics",
          "productCategory": [
            {
              "title": "Mobile",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "mobiles",
              "deeplink": "mobiledescriptionslink",
              "imagefolder": "mobile"
            },
            {
              "title": "Tv",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "tvs",
              "deeplink": "tvdescriptionslink",
              "imagefolder": "tv"
            },
            {
              "title": "Ac",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "acs",
              "deeplink": "acsdescriptionslink",
              "imagefolder": "ac"
            },
            {
              "title": "Refrigerator",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "refrigerators",
              "deeplink": "refrigeratordescriptionslink",
              "imagefolder": "refri"

            },
            {
              "title": "Washing-Machine",
              "products": [],
              "pageNumber": 1,
              "loadMore": true,
              "link": "wmachines",
              "deeplink": "wmachinedescriptionslink",
              "imagefolder": "washing"

            }
          ]
        },
        {
          "title": "Pharmacy",
          "subtitle": "Order medicine from local chemist",
          "image": "img/pharmacy.png",
          "id": 6,
          "link": "shop-medicals",
          "type": "none",
          "productCategory": [
          ]
        }
      ];

      angular.copy($scope.categoryTemp, $scope.categorylists);

      $scope.$watchCollection('categoryTemp', function(newValue, oldValue) {
        if (newValue !== oldValue)
        {
          console.log("watch triggered !!");
          angular.copy($scope.categoryTemp, $scope.categorylists);
        }
      });

      $http({
        method: 'GET',
        url: 'http://getmeher.com:3000/categorylists'
      }).then(function successCallback(response) {
        console.log(response)
        if (response.data.length> 0)
          $scope.categoryTemp = response.data;
        else
          alert("unable to connect");
      }, function errorCallback(response) {
        console.log(response)
        alert("unable to connect");
      });


      $scope.goToStoreList = function(category) {
        window.category = category;
        $location.url("/app/categories/"+category.id);
      };

    })
