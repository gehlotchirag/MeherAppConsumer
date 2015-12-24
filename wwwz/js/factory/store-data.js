/**
 * Created by chirag on 18/09/15.
 */
angular.module('starter.controllers')

.factory('StoreData', function () {

      var storeData = {};
      var storeDistance;

  return {
    getStore: function () {
      return storeData;
    },
    getStoreDistance: function () {
      return storeDistance;
    },
    setStoreDistance: function (disKM) {
      storeDistance = disKM;
      return storeDistance;
    },
    setStore: function (storeInfo) {
       storeData = angular.copy(storeInfo);
      return storeData;
    }
  };
});
