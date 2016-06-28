angular.module('starter.controllers', ['ionic'])

.controller('HomeCtrl', function($scope, $http, $ionicPopup,  $ionicListDelegate, wakanda) {
	$scope.keyPressSearch = function(keyEvent) {
		if(keyEvent.which === 13) {
			$scope.searchBook(keyEvent.currentTarget.value);
		}
	};
	
	$scope.searchBook = function(title) {
		$http({
			dataType: 'json',
			url: 'https://www.googleapis.com/books/v1/volumes?q=' + title +'&maxResults=10'
		}).
        success(function(data, status) {
        	var items = [];
        	data.items.forEach(function(item) {
        		items.push({
        			title: item.volumeInfo.title,
        			author: item.volumeInfo.authors && item.volumeInfo.authors[0],
        			image: item.volumeInfo.imageLinks.smallThumbnail
        		});
        	});
            $scope.items = items;
        }).
        error(function(data, status) {
           $scope.items = [];
           console.error(data || 'Request failded !');
        }); 
	};
	
	$scope.addBook = function(book) {	
    	wakanda.ready().then(function() {
			var ds = wakanda.$wakanda.$ds;
			ds.Book.$query({
		        filter: 'title == :1',
        	    params: [ book.title ],
        	    select: 'author'
      		}).$promise
      		.then(function(event) {
      			var exist = (event.result || []).some(function(_book) {
      				return _book.title == book.title && _book.author.fullName == book.author;
      			});
      			
      			if(exist) {
      				$ionicPopup.alert({
     					title: 'Add entry',
					    template: 'Your book exist in the database !'
					});
					$ionicListDelegate.closeOptionButtons();
					return;
      			} else {
      				ds.Author.$query({
						filter: 'fullName == :1',
						params: [ book.author ]
					}).$promise
					.then(function(event) {
						var authorId = event.result && event.result.length && event.result[0].ID || undefined;
						createNewBook(book,  authorId);
					});	
      			}
      		});
      		
      		function createNewBook(book, authorId) {
      			$ionicPopup.confirm({
					title: 'Add entry',
				    template: 'Are you sure to add' + (authorId ? '' : ' the Author ' + book.author + ' and') + ' the book : ' + book.title
			    })
			    .then(function(res) {
			    	if(! res) {
			    		$ionicListDelegate.closeOptionButtons();
			    		return;
			    	}
			    	
			    	if(! authorId) {
    					var _names = book.author.split(' ');
      					var newAuthor = ds.Author.$create({
      						firstName: _names[0],
      						lastName: _names.length > 1 ? _names.slice(1).join(' ') : ''
      					});
      					
      					newAuthor.$save().then(function(event) {
      						var newBook = ds.Book.$create({
      							title: book.title,
      							author: newAuthor
      						});
      						
      						newBook.$save().then(function() {
      							$ionicPopup.alert({
     								title: 'Add entry',
								    template: 'Your book is added'
								});
								$ionicListDelegate.closeOptionButtons();
	      					});
    	 				});
      				} else {
      					var newBook = ds.Book.$create({
      						title: book.title,
      						author: newAuthor
      					});
      					
      					newBook.$save().then(function() {
      						$ionicPopup.alert({
     							title: 'Add entry',
							    template: 'Your book is added.'
							}); 
							$ionicListDelegate.closeOptionButtons();     					
	      				});      				
      				}		    	
			    });      			
      		}
		});
 	};
})

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