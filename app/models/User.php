<?php

use SammyK\LaravelFacebookSdk\FacebookableTrait;

class User extends Eloquent {

  use FacebookableTrait;

  protected $hidden = ['access_token'];

	public function files()
	{
		return $this->hasMany('ConvertedFile');
	}

  public static function current() {
    $accessToken = getallheaders()['Facebook'];
    $res = User::where('access_token', '=', $accessToken)->get();
    $user = $res[0];
    return $user;
  }
}