<!DOCTYPE html>
<html ng-app="audioConverter" lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Audio converter</title>
    <link rel="stylesheet" href="vendor/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="vendor/bootstrap/dist/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
<div class="container">
  <div class="page-header">
<nav class="navbar navbar-default" role="navigation">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div ng-show="fbUser" class="navbar-header">
      <a class="navbar-brand" href="#">Add File</a>
      <a class="navbar-brand" href="#files">Files</a>
      <a class="navbar-brand" href="#friends">Friends</a>
      <form id="userSearchForm" method="POST" action="/user/friends/add" ng-submit="addFriend(); $event.preventDefault()"
      ng-controller="AppUserSearchCtrl" class="navbar-form navbar-left" role="search">
        <div class="form-group">
          <input type="text" class="user-search form-control" placeholder="Find friends...">
        </div>
        <button ng-disabled="validUser" type="submit" class="btn btn-default">Add</button>
      </form>        
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="login nav navbar-nav navbar-right">
      <li ng-show="fbUser"><% fbUser.name %></li>
        <li>
    <div class="fb-login-button" data-max-rows="1" data-size="medium" data-show-faces="false" data-auto-logout-link="true" data-scope="email,public_profile"></div>
        </li>
          <li>
    <div ng-show="fbUser" ng-controller="SoundCloudLoginCtrl"><div class="soundcloud-login-button">
      <a ng-click="login(); $event.preventDefault()" ng-hide="soundCloudLoggedIn" href="#"><img src="images/btn-connect-s.png" alt="Connect to SoundCloud" /></a>
      <a ng-click="logout(); $event.preventDefault()" ng-show="soundCloudLoggedIn" href="#"><img src="images/btn-disconnect-s.png" alt="Disconnect from SoundCloud" /></a>
    </div></div>          
          </li>        
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>      

  </div>
  <div class="jumbotron">
    <ul ng-show="messages.length" class="messages">
        <li class="alert alert-<% message.type %>" ng-repeat="message in messages">
            <% message.text %>
        </li>
    </ul>  
    <div ng-view></div>
  </div>
  <div class="footer">
    <p>&copy; Company 2014</p>
  </div>
</div>
    <script src="vendor/jquery/dist/jquery.min.js"></script>
    <script src="vendor/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="vendor/angular/angular.js"></script>
    <script src="vendor/angular-route/angular-route.js"></script>
    <script src="vendor/angular-resource/angular-resource.js"></script>
    <script src="vendor/angular-facebook/lib/angular-facebook.js"></script>
    <script src="vendor/typeahead.js/dist/typeahead.bundle.js"></script>      
    <script src="http://connect.soundcloud.com/sdk.js"></script>      
    <script src="js/config.js"></script>
    <script src="js/app.js"></script>
    <script src="js/soundcloud.js"></script>
    <script src="js/wsclient.js"></script>
    <script src="js/usersearch.js"></script>
    <script src="js/controllers.js"></script>
  </body>
</html>