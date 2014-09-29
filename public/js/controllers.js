app.controller('IndexCtrl', function($scope, $rootScope, $http, $interval, Config) {
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
})

.controller('AppFriendsInboxCtrl', function($scope, $rootScope, $http) {
  $rootScope.messages = [];
  $scope.inbox = [];

  $http({
    method: 'GET',
    url: 'user/friends/inbox',
    headers: {
      Facebook: $rootScope.fbUser.access_token
    },
  })
    .success(function(response) {
    $scope.inbox = response.data;
  })
    .error(function() {});

  $scope.acceptFriend = function(e) {
    $http({
      method: 'POST',
      url: 'user/friends/add',
      data: {
        username: $(e.target).closest('.list-group-item').find('.email').text()
      },
      headers: {
        Facebook: $rootScope.fbUser.access_token
      },
    })
      .success(function(response) {
      $scope.inbox.splice($scope.inbox.indexOf(this.inbox), 1);
    })
      .error(function() {});
  }

  $scope.ignoreRequest = function(e) {
    var requestId = $(e.target).data('request-id');
    $http({
      method: 'POST',
      url: 'user/friends/request/ignore',
      data: {
        requestId: requestId
      },
      headers: {
        Facebook: $rootScope.fbUser.access_token
      },
    })
      .success(function(response) {
      $scope.inbox.splice($scope.inbox.indexOf(this.inbox), 1);
    })
      .error(function() {});
  }
})

.controller('AppFriendsOutboxCtrl', function($scope, $rootScope, $http) {
  $rootScope.messages = [];
  $scope.outbox = [];

  $http({
    method: 'GET',
    url: 'user/friends/outbox',
    headers: {
      Facebook: $rootScope.fbUser.access_token
    },
  })
    .success(function(response) {
    $scope.outbox = response.data;
  })
    .error(function() {});

  $scope.cancelRequest = function(e) {
    var requestId = $(e.target).data('request-id');
    $http({
      method: 'POST',
      url: 'user/friends/request/cancel',
      data: {
        requestId: requestId
      },
      headers: {
        Facebook: $rootScope.fbUser.access_token
      },
    })
      .success(function(response) {
      $scope.outbox.splice($scope.outbox.indexOf(this.outbox), 1);
    })
      .error(function() {});
  }
})

.controller('AppFriendsCtrl', function($scope, $rootScope, $http) {
  $rootScope.messages = [];
  $scope.friends = [];

  $http({
    method: 'GET',
    url: 'user/friends',
    headers: {
      Facebook: $rootScope.fbUser.access_token
    },
  })
    .success(function(response) {
    $scope.friends = response.data;
  })
    .error(function() {});


  $scope.removeFriend = function(e) {
    var userId = $(e.target).data('user-id');
    $http({
      method: 'POST',
      url: 'user/friends/remove',
      data: {
        userId: userId
      },
      headers: {
        Facebook: $rootScope.fbUser.access_token
      },
    })
      .success(function(response) {
      $scope.friends.splice($scope.friends.indexOf(this.friend), 1);
    })
      .error(function() {});
  }
})

.controller('AppUserSearchCtrl', function($scope, $rootScope, $http) {
  $scope.validUser = false;
  $scope.addFriend = function() {
    var form = $('#userSearchForm');
    $http({
      method: 'POST',
      url: form.attr('action'),
      data: {
        username: $('.user-search').typeahead('val')
      },
      headers: {
        Facebook: $rootScope.fbUser.access_token
      },
    })
      .success(function(response) {
      $rootScope.messages = [];
      $.each(response.errors, function(index, value) {
        $rootScope.messages.push({
          type: 'danger',
          text: value
        })
      });
    })
      .error(function() {});
  }
})

.controller('AppConvertedFilesCtrl', function($scope, $rootScope, $resource) {
  $rootScope.messages = [];
  $scope.filesResource = $resource('/user/files', {}, {
    get: {
      method: 'GET',
      headers: {
        Facebook: $rootScope.fbUser.access_token
      },
      isArray: true
    },
    remove: {
      method: 'DELETE',
      headers: {
        Facebook: $rootScope.fbUser.access_token
      },
      params: {
        id: '@id'
      }
    }
  });

  $scope.userFiles = $scope.filesResource.get();

  $scope.removeFile = function(e) {
    $scope.filesResource.remove({
      id: this.file.id
    }, function() {
      $scope.userFiles.splice($scope.userFiles.indexOf(this.file), 1);
    });
  }
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