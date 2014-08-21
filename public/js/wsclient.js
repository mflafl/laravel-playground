app.service('WebSocketClient', function($rootScope) {
  this.ws = {};
  this.disconnect = function() {
    this.ws.close();
  }
  this.init = function(address, username) {
    var self = this;
    if (typeof(WebSocket) == "undefined") {
      alert("Your browser does not support WebSockets. Try to use Chrome or Safari.");
    } else {
      this.ws = new WebSocket(address);

      this.ws.onopen = function() {
        self.ws.send(username);
      }

      this.ws.onmessage = function(event) {
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

      this.ws.onclose = function(event) {
        console.log("ws closed");
      }

      this.ws.onerror = function(event) {
        console.log("ws error");
      }
    }
  }
})