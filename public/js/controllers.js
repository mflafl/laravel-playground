app.controller('AppUserSearchCtrl', function($scope, $rootScope, UserSearch, $resource) {

})

.controller('AppConvertedFilesCtrl', function($scope, $rootScope, $resource) {
  $scope.filesResource = $resource('/user/files', {}, {
    get: {
      method: 'GET',
      headers: {
        Facebook: $rootScope.fbUser.access_token
      },
      isArray: true
    }
  });

  $scope.userFiles = $scope.filesResource.get();
})

.controller('AppLoginCtrl', function($scope) {})

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

.controller('IndexCtrl', function($scope, $rootScope, $http, $interval, Config) {
  $scope.fileId = 0;

  $scope.convert = function() {
    $rootScope.messages = [];


    if (!$rootScope.fbUser) {
      var message = {
        type: 'danger',
        text: 'Login to facebook to use converter'
      }
      $rootScope.messages.push(message);
      return;
    }

    var form = $('#convertForm'),
      formData = new FormData(form[0]);

    // Prevent multiple submisions
    if (form.data('loading') === true) {
      return;
    }
    form.data('loading', true);

    $http({
      method: 'POST',
      url: form.attr('action'),
      data: formData,
      headers: {
        'Content-Type': undefined,
        Facebook: $rootScope.fbUser.access_token
      },
      transformRequest: angular.identity
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