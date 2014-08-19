<!DOCTYPE html>
<html ng-app="audioConverter" lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Audio converter</title>
    <link rel="stylesheet" href="vendor/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="vendor/bootstrap/dist/css/bootstrap-theme.min.css">
  </head>
  <body>
<div class="container">
  <div class="header">
    <h3 class="text-muted">Audio converter to mp3 64kbs</h3>
    <div class="fb-login-button" data-max-rows="1" data-size="medium" data-show-faces="false" data-auto-logout-link="true" data-scope="email,public_profile"></div>
    <div ng-controller="SoundCloudLoginCtrl"><div class="soundcloud-login-button">
      <a ng-click="login(); $event.preventDefault()" ng-hide="soundCloudLoggedIn" href="#"><img src="images/btn-connect-s.png" alt="Connect to SoundCloud" /></a>
      <a ng-click="logout(); $event.preventDefault()" ng-show="soundCloudLoggedIn" href="#"><img src="images/btn-disconnect-s.png" alt="Disconnect from SoundCloud" /></a>
    </div></div>
  </div>
  <div class="jumbotron">
    <h1>Upload file</h1>
    <ul ng-show="messages.length" class="messages">
        <li class="alert alert-<% message.type %>" ng-repeat="message in messages">
            <% message.text %>
        </li>
    </ul>
    <div ng-show="progress">Converted: <% progress %> %</div>
    <div ng-view></div>
  </div>
  <div class="footer">
    <p>&copy; Company 2014</p>
  </div>
</div>
    <script src="vendor/jquery/dist/jquery.min.js"></script>
    <script src="vendor/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="vendor/angular/angular.min.js"></script>
    <script src="vendor/angular-route/angular-route.js"></script>
    <script src="vendor/angular-facebook/lib/angular-facebook.js"></script>
    <script src="http://connect.soundcloud.com/sdk.js"></script>
    <script src="js/config.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>