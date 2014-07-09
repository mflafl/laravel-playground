angular.module('audioConverter', ['ngRoute'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('<%');
  $interpolateProvider.endSymbol('%>');
})

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
    controller: 'IndexCtrl',
  })
    .otherwise({
    redirectTo: '/'
  });
})

.run(function($http, $rootScope) {
  $rootScope.messages = [];
  $rootScope.fileIsConverted = false;
  $rootScope.progress = 0;

  if (typeof(WebSocket) == "undefined") {
    alert("Your browser does not support WebSockets. Try to use Chrome or Safari.");
  } else {
    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = function() {
      ws.send('login');
    }

    ws.onmessage = function(event) {
      console.log(event.data);
      var data = jQuery.parseJSON(event.data);
      switch (data.action) {
        case 'login':
          $('input[name=username]').val(data.parameters.username);
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
})

.controller('IndexCtrl', function($scope, $rootScope, $http, $interval) {
  $scope.fileId = 0;

  $scope.convert = function() {
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