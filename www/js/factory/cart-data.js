/**
 * Created by chirag on 18/09/15.
 */
angular.module('starter.controllers')

    .factory('CartData', function () {
      Array.prototype.inArray = function(comparer) {
        for(var i=0; i < this.length; i++) {
          if(comparer(this[i])) return true;
        }
        return false;
      };

// adds an element to the array if it does not already exist using a comparer
// function

      Array.prototype.pushIfNotExist = function(element, comparer) {
        if (!this.inArray(comparer)) {
          this.push(element);
        }
      };

      var cartData = [];

      return {
        getCart: function () {
          return cartData;
        },
        setCart: function (cartList) {
          cartData = angular.copy(cartList);
          return cartData;
        },

        copyCart: function (cartList) {
          cartData = angular.copy(cartList);
          return cartData;
        },
        emptyCart: function () {
          cartData = [];
          return cartData;
        },

        getCartItem: function () {
          return cartData.length;
        },
        setCartItem: function (element) {
          cartData.pushIfNotExist(element, function(e) {
            return e.name === element.name && e.price === element.price;
          });
        }
      };
    });
