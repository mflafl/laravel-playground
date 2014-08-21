var app = angular.module('audioConverter', ['ngRoute', 'ngResource', 'facebook', 'configuration'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('<%');
  $interpolateProvider.endSymbol('%>');
})

.config(function($routeProvider, FacebookProvider, Config) {
  FacebookProvider.init(Config.facebook_api_key);

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
    .otherwise({
    redirectTo: '/'
  });
})

.factory('ConvertedFiles', function($resource) {
  return $resource('/user/:email/files', {}, {
    query: {
      method: 'GET',
      isArray: true
    }
  });
})

.run(function($http, $rootScope, Facebook, SoundCloud, Config, WebSocketClient, ConvertedFiles, $location) {
  console.log('Running....');
  $rootScope.messages = [];
  $rootScope.fileIsConverted = false;
  $rootScope.progress = 0;
  $rootScope.fbUid = 0;
  $rootScope.fbUser = false;

  SoundCloud.init(Config.soundcloud_api_key);

  Facebook.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      $rootScope.fbUid = response.authResponse.userID;

      Facebook.api('/me', function(response) {
        $rootScope.fbUser = response;
        WebSocketClient.init(Config.websocket_address, $rootScope.fbUser.email);
        $location.path('/');
      });

    } else if (response.status === 'not_authorized') {
      $location.path('/login');
      // the user is logged in to Facebook,
      // but has not authenticated your app
    } else {
      $location.path('/login');
      // the user isn't logged in to Facebook.
    }
  });

  Facebook.subscribe('auth.login', function(response) {
    if (response.status === 'connected') {
      $rootScope.fbUid = response.authResponse.userID;
      Facebook.api('/me', function(response) {
        $rootScope.fbUser = response;
        WebSocketClient.init(Config.websocket_address, $rootScope.fbUser.email);
        $location.path('/');
      });
    }
  });

  Facebook.subscribe('auth.logout', function(response) {
    if (response.status === 'unknown') {
      $rootScope.fbUid = 0;
      $rootScope.fbUser = false;
      WebSocketClient.disconnect();
      $location.path('/login');
    }
  });
})