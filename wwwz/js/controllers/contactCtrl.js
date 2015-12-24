/**
 * Created by chirag on 23/10/15.
 */
angular.module('starter.controllers')

    .controller('contactCtrl', function($scope,$ionicModal,$window,$timeout) {
// Form data for the login modal
      $scope.contactData = {};

      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/contact.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeContact = function() {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.contact = function() {
        $scope.modal.show();
      };

      // Perform the login action when the user submits the login form
      $scope.doContact = function() {
        console.log('Doing login', $scope.contactData);
        var body = JSON.stringify($scope.contactData);
        $window.location = "mailto:info@getmeher.com?subject=Add Store&body="+body;
        $timeout(function() {
          $scope.closeContact();
        }, 1000);
      };
    });