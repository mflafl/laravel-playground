app.controller('AppLoginCtrl', function($scope, $rootScope, $http, $interval, Facebook, $location) {
  
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

.controller('IndexCtrl', function($scope, $rootScope, $http, $interval, WebSocketClient, Config) {
  WebSocketClient.init(Config.websocket_address, $rootScope.fbUser.email);

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