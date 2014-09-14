var app = angular.module('audioConverter', ['ngRoute', 'ngResource', 'facebook', 'configuration'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('<%');
  $interpolateProvider.endSymbol('%>');
})

.config(function($routeProvider, FacebookProvider, Config) {
  FacebookProvider.init({
    appId: Config.facebook_api_key,
    status: false
  });

  $routeProvider
    .when('/', {
    controller: 'IndexCtrl',
    templateUrl: '/templates/uploader.html',
  })
    .when('/login', {
    controller: 'AppLoginCtrl',
    templateUrl: '/templates/login.html',
  })
    .when('/files', {
    controller: 'AppConvertedFilesCtrl',
    templateUrl: '/templates/files.html',
  })
    .when('/friends', {
    controller: 'AppFriendsCtrl',
    templateUrl: '/templates/friends/index.html',
  })
    .when('/friends/inbox', {
    controller: 'AppFriendsInboxCtrl',
    templateUrl: '/templates/friends/inbox.html',
  })
    .when('/friends/outbox', {
    controller: 'AppFriendsOutboxCtrl',
    templateUrl: '/templates/friends/outbox.html',
  })
    .otherwise({
    redirectTo: '/'
  });
})

.run(function($http, $rootScope, Facebook, SoundCloud, Config, WebSocketClient, $location, UserSearch, $resource) {
  $rootScope.messages = [];
  $rootScope.fileIsConverted = false;
  $rootScope.progress = 0;
  $rootScope.fbUser = false;

  SoundCloud.init(Config.soundcloud_api_key);

  Facebook.getLoginStatus(function(response) {
    if (response.status !== 'connected') {
      if (response.status === 'not_authorized') {
        // the user is logged in to Facebook,
        // but has not authenticated your app
        $location.path('/login');
      } else {
        // the user isn't logged in to Facebook.
        $location.path('/login');
      }
    }
  });

  Facebook.subscribe('auth.login', function(response) {
    if (response.status === 'connected') {
      $http({
        method: 'POST',
        url: 'user',
        data: {
          "access_token": response.authResponse.accessToken
        },
      }).
      success(function(response) {
        $rootScope.fbUser = response.data;
        WebSocketClient.init(Config.websocket_address, response.data.email);
        UserSearch.init();
        $location.path('/');
      }).
      error(function(response) {});
    } else {}
  });

  Facebook.subscribe('auth.logout', function(response) {
    if (response.status === 'unknown') {
      $rootScope.fbUser = false;
      WebSocketClient.disconnect();
      $location.path('/login');
    }
  });

})