app.service('WebSocketClient', function($rootScope) {
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