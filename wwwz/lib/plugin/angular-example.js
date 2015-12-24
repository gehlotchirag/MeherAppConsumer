angular.module('myApp', ['pushNotify']).
  .run(function (pushNotification) {
    //register device on load
    pushNotification.registerPush();
  });
