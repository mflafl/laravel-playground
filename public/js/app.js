angular.module('audioConverter', ['ngRoute', 'facebook', 'configuration'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('<%');
  $interpolateProvider.endSymbol('%>');
})

.service('WebSocketClient', function($rootScope) {
  this.init = function(address, username) {
    if (typeof(WebSocket) == "undefined") {
      alert("Your browser does not support WebSockets. Try to use Chrome or Safari.");
    } else {
      ws = new WebSocket(address);

      ws.onopen = function() {
        ws.send(username);
      }

      ws.onmessage = function(event) {
        var data = jQuery.parseJSON(event.data);
        switch (data.action) {
          case 'login':
            $('input[name=username]').val(username);
            break;
          case 'convert.success':
            $rootScope.$apply(function() {
              $rootScope.messages = [];
              $rootScope.progress = 0;
              $rootScope.fileIsConverted = true;
            });
            $('#downloadLink').attr('href', data.parameters.url.replace(/\\/g, ''));
            $('#myModal').modal();
            break;
        }
      }

      ws.onclose = function(event) {
        console.log("ws closed");
      }

      ws.onerror = function(event) {
        console.log("ws error");
      }
    }
  }
})

.service('SoundCloud', function() {
  var self = this;
  this.user = false;
  this.init = function(apikey) {
    SC.initialize({
      client_id: apikey,
      redirect_uri: 'http://lv.loc/#/soundcloud_auth'
    });
  }
  this.authorize = function(cb) {
    SC.connect(function() {
      SC.get('/me', function(me) {
        self.user = me;
        cb();
      });
    });
  }
  this.disconnect = function() {
    self.user = false;
  }
})

.controller('SoundCloudLoginCtrl', function($scope, $rootScope, $http, $interval, SoundCloud) {
  $rootScope.soundCloudLoggedIn = SoundCloud.user;
  $rootScope.soundCloudAccessToken = false;

  $scope.login = function() {
    SoundCloud.authorize(function(user) {
      $rootScope.$apply(function() {
        $rootScope.soundCloudLoggedIn = SoundCloud.user;
        $rootScope.soundCloudAccessToken = SC.accessToken();
      });
    });
  }

  $scope.logout = function() {
    SoundCloud.disconnect();
    $rootScope.soundCloudLoggedIn = SoundCloud.user;
  }
})

.config(function($routeProvider, FacebookProvider, Config) {
  FacebookProvider.init(Config.facebook_api_key);

  $routeProvider
    .when('/', {
    controller: 'IndexCtrl',
    templateUrl: '/templates/uploader.html',
  })
    .when('/soundcloud_auth', {
    controller: 'SoundCloudAuthCtrl',
    template: ""
  })
    .otherwise({
    redirectTo: '/'
  });
})

.run(function($http, $rootScope, Facebook, SoundCloud, WebSocketClient, Config) {
  SoundCloud.init(Config.soundcloud_api_key);


  Facebook.subscribe('auth.login', function(response) {
    if (response.status === 'connected') {
      $rootScope.fbUid = response.authResponse.userID;
    }
  });

  Facebook.subscribe('auth.logout', function(response) {
    if (response.status === 'unknown') {
      $rootScope.fbUid = 0;
    }
  });

  Facebook.getLoginStatus(function(response) {
    console.log(response);
    if (response.status === 'connected') {
      $rootScope.fbUid = response.authResponse.userID;

      Facebook.api('/me', function(response)
      {
        WebSocketClient.init(Config.websocket_address, response.email);
      });


      
      //var accessToken = response.authResponse.accessToken;
    } else if (response.status === 'not_authorized') {
      // the user is logged in to Facebook,
      // but has not authenticated your app
    } else {
      // the user isn't logged in to Facebook.
    }
  });

  $rootScope.fbUid = 0;
  $rootScope.messages = [];
  $rootScope.fileIsConverted = false;
  $rootScope.progress = 0;
})

.controller('IndexCtrl', function($scope, $rootScope, $http, $interval) {
  $scope.fileId = 0;

  $scope.convert = function() {
    $rootScope.messages = [];

    if (!$rootScope.fbUid) {
      var message = {
        type: 'danger',
        text: 'Login to facebook to use converter'
      }
      $rootScope.messages.push(message);
      return;
    }

    var form = $('form')[0],
      formData = new FormData(form);

    // Prevent multiple submisions
    if ($(form).data('loading') === true) {
      return;
    }
    $(form).data('loading', true);

    $http.post($('form').attr('action'), formData, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    })
      .success(function(response) {
      $rootScope.messages = [];

      $(form).data('loading', false);
      if (Object.keys(response.errors).length) {
        angular.forEach(response.errors, function(value, key) {
          var message = {
            type: 'danger',
            text: value.toString()
          }
          $rootScope.messages.push(message);
        });
      } else {
        var message = {
          type: 'success',
          text: 'Successfully uploaded. Link to the converted file will be available soon'
        }
        $rootScope.messages.push(message);
        $scope.fileId = response.data.id;

        // Converting progress calls
        var timer = $interval(function() {
          if ($rootScope.fileIsConverted) {
            $interval.cancel(timer);
            $rootScope.fileIsConverted = false;
            return;
          }
          $http({
            method: 'POST',
            url: "progress",
            data: {
              id: $scope.fileId
            }
          })
            .success(function(response) {
            $rootScope.progress = response.data.progress;
          })
        }, 1000);

      }
    })
      .error(function() {
      $(form).data('loading', false);
    });
  }
});