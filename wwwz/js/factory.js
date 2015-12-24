/**
 * Author: hollyschinsky
 * twitter: @devgirfl
 * blog: devgirl.org
 * more tutorials: hollyschinsky.github.io
 */

// Race condition found when trying to use $ionicPlatform.ready in app.js and calling register to display id in AppCtrl.
// Implementing it here as a factory with promises to ensure register function is called before trying to display the id.
app.factory(("ionPlatform"), function( $q ){
    var ready = $q.defer();

    ionic.Platform.ready(function( device ){
      //alert("platform ready");
      //alert("device ="+device);
      ready.resolve( device );
    });

    return {
        ready: ready.promise
    }
})
    .factory('dataShare',function($rootScope){
      var service = {};
      service.data = false;
      service.sendData = function(data){
        this.data = data;
        $rootScope.$broadcast('data_shared');
      };
      service.getData = function(){
        return this.data;
      };
      return service;
    });
