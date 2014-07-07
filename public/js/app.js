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
  if (typeof(WebSocket) == "undefined") {
    alert("Your browser does not support WebSockets. Try to use Chrome or Safari.");
  } else {
    ws = new WebSocket("ws://localhost:8080");

    console.log('try to open');
    ws.onopen = function() {
      console.log('open');
      ws.send('login');
    }

    ws.onmessage = function(event) {
      console.log(event.data);
      var data = jQuery.parseJSON(event.data);
      switch (data.action) {
        case 'login':
          $('input[name=username]').val(data.parameters.username);
          break;
        case 'convert.progress':

          break;
        case 'convert.success':
          $('#downloadLink').attr('href', data.parameters.url.replace(/\\/g, ''));
          $('#myModal').modal();
          break;
      }
    }

    ws.onclose = function(event) {
      console.log("closed((");
    }

    ws.onerror = function(event) {
      console.log("error((");
    }
  }

  $rootScope.filesToUpload = [];
  $('input[name=file]').on('change', function(event) {
    var files = event.target.files || event.originalEvent.dataTransfer.files;
    $.each(files, function(index, file) {
      console.log(file);
      $rootScope.filesToUpload.push(file);
    });
  });

  $('form').on('submit', function() {
    return false;
  })
})


.controller('IndexCtrl', function($scope, $rootScope, $http) {
  $rootScope.messages = [];
  $scope.filesToUpload = [];

  $scope.convert = function(e) {
    var form = $('form')[0],
      formData = new FormData(form);

    // Prevent multiple submisions
    if ($(form).data('loading') === true) {
      return;
    }
    $(form).data('loading', true);

    // Add selected files to FormData which will be sent
    if ($scope.filesToUpload) {
      $.each($scope.filesToUpload, function(index, file) {
        formData.append('cover[]', file);
      });
    }

    $http.post($('form').attr('action'), formData, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    })
      .success(function(response) {
      $(form).data('loading', false);
      $rootScope.messages = [];
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
      }
    })
      .error(function() {
      $(form).data('loading', false);
    });
  }
});