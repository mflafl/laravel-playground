<?php

class User extends Eloquent {
	public static function getOrCreate($email) {
		$res = User::where('email', '=', $email)->get();

		if ($res->count()) {
			$user = $res[0];
		} else {
			$user = new User();
			$user->email = $email;
			$user->save();
		}

		return $user;
	}

	public function files()
	{
		return $this->hasMany('ConvertedFile');
	}
}