angular.module('Starter')
  .controller('HomeController', function($scope, wakanda) {
    wakanda.ready().then(function(ds) {
      console.log('Angular-Wakanda is ready!');
      // var ds = wakanda.$wakanda.$ds;
      // ds.Item.$all().$promise.then(function(event) {
      //   $scope.tasks = event.result;
      // });
    }).catch(function(err) {
      console.warn(err);
    });
  });