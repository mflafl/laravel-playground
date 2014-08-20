app.service('SoundCloud', function() {
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