app.service('WebSocketClient', function($rootScope) {
  this.ws = {};
  this.opened = false;

  this.send = function(message) {
    var self = this;
    if (this.ws.readyState === 1) {
      this.ws.send(message);
    } else {
      setTimeout(function() {
        self.send(message);
      }, 500);
    }
  }

  this.init = function(address, username) {
    // already opened
    if (this.opened) {
      return;
    }

    var self = this;

    if (typeof(WebSocket) == "undefined") {
      alert("Your browser does not support WebSockets. Try to use Chrome or Safari.");
    } else {
      this.ws = new WebSocket(address);
      this.opened = true;

      this.ws.onopen = function() {
        self.send(username);
      }

      this.ws.onmessage = function(event) {
        var data = jQuery.parseJSON(event.data);
        switch (data.action) {
          case 'login':
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

  this.disconnect = function() {
    this.ws.close();
  }
})