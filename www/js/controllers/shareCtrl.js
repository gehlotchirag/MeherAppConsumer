/**
 * Created by chirag on 24/10/15.
 */
angular.module('starter.controllers')
    .controller('shareCtrl', function($scope,$cordovaSocialSharing) {
        $scope.whatsappShare=function(){
            $cordovaSocialSharing
                .shareViaWhatsApp("hi", null, 'https://play.google.com/store/apps/details?id=com.meherapp.meher')
                .then(function(result) {
                    // Success!
                    alert("Thanks for sharing!")
                }, function(err) {
                    // An error occurred. Show a message to the user
                    alert(err)
                });
        }
        $scope.twitterShare=function(){
            window.plugins.socialsharing.shareViaTwitter('Digital Signature Maker', null /* img */, 'https://play.google.com/store/apps/details?id=com.prantikv.digitalsignaturemaker', null, function(errormsg){alert("Error: Cannot Share")});
        }
        $scope.OtherShare=function(){
            window.plugins.socialsharing.share('Digital Signature Maker', null, null, 'https://play.google.com/store/apps/details?id=com.prantikv.digitalsignaturemaker');
        }

    });