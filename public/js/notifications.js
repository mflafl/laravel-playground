    var ws;
    
    function wsRun() {
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
    }

wsRun();