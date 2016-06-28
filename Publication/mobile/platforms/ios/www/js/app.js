var app = angular.module('starter', ['ionic', 'starter.controllers', 'wakanda'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  
  .state('tab.authors', {
      url: '/authors',
      views: {
        'tab-authors': {
          templateUrl: 'templates/tab-authors.html',
          controller: 'AuthorsCtrl'
        }
      }
    })  
    
    .state('tab.author-books', {
      url: '/authors/:authorId',
      views: {
        'tab-authors': {
          templateUrl: 'templates/author-books.html',
          controller: 'AuthorBooksCtrl'
        }
      }
    })     
    .state('tab.books', {
      url: '/books/:bookId',
      views: {
        'tab-authors': {
          templateUrl: 'templates/book.html',
          controller: 'BookCtrl'
        }
      }
    })

  $urlRouterProvider.otherwise('/tab/dash');

});
