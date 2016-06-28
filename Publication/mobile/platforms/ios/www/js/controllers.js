angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('AuthorsCtrl', function($scope, wakanda) {
	wakanda.ready().then(function() {
       var ds = wakanda.$wakanda.$ds;
       ds.Author.$all().$promise.then(function(event) {
         $scope.authors = event.result;
       });
    }).catch(function(err) {
      console.warn(err);
    });
})

.controller('AuthorBooksCtrl', function($scope, $stateParams, wakanda) {
	var authorId = $stateParams.authorId;
	wakanda.ready().then(function() {
		var ds = wakanda.$wakanda.$ds;
		var books = ds.Book.$query({
	        filter: 'author.ID == :1',
            params: [ authorId ]
      	});
      	
      	books.$promise.then(function(event) {
      		$scope.books = event.result;
      	});
	});
})

.controller('BookCtrl', function($scope, $stateParams, wakanda) {
	var bookId = $stateParams.bookId;
	wakanda.ready().then(function() {
		var ds = wakanda.$wakanda.$ds;
		var book = ds.Book.$find(bookId);
      	
      	book.$promise.then(function(event) {
      		$scope.book = event.result;
      	});
	});
})