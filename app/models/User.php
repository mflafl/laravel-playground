<?php

use SammyK\LaravelFacebookSdk\FacebookableTrait;

class User extends Eloquent {

	const STATUS_PENDING = 0;
	const STATUS_DENIED = 1;
	const STATUS_APPROVED = 2;
  const STATUS_IGNORED = 3;

  use FacebookableTrait;

  protected $hidden = ['access_token'];

	public function files()
	{
		return $this->hasMany('ConvertedFile');
	}

  public static function current() {
    $accessToken = getallheaders()['Facebook'];
    $user = User::where('access_token', '=', $accessToken)->first();
    return $user;
  }

	public function addFriend($user) {
		$request = FriendRequest::where(function ($query) use ($user) {
				$query->where('owner_id', '=', $this->id)
							->where('user_id', '=', $user->id);
		})->orWhere(function ($query) use ($user) {
				$query->where('owner_id', '=', $user->id)
              ->where('user_id', '=', $this->id);
		})->get()->first();

		if ($request) {
      switch ($request->status) {
        // accept inbox request
        case User::STATUS_PENDING:
          $request->status = User::STATUS_APPROVED;
          $request->save();
          break;
      }
		} else {
			$request = new FriendRequest();
			$request->owner_id = $this->id;
			$request->user_id = $user->id;
		}
		$request->save();
	}

	public function removeFriend($friendId) {
		$request = FriendRequest::with('owner','user')->where(function ($query) use ($friendId) {
				$query->where('owner_id', '=', $friendId)
							->where('user_id', '=', $this->id)
							->where('status', '=', User::STATUS_APPROVED);
		})->orWhere(function ($query) use ($friendId) {
				$query->where('owner_id', '=', $this->id)
							->where('user_id', '=', $friendId)
							->where('status', '=', User::STATUS_APPROVED);
		})->get()->first();

    if ($request->owner_id = $this->id) {
      // remove own request
      $request->delete();
      // create new request, 'ex-Friend sends to me pending request"
			$request = new FriendRequest();
			$request->owner_id = $friendId;
			$request->user_id = $this->id;
      $request->save();
    } else {
      // remove previously accepted request
      $request->status = User::STATUS_DENIED;
      $request->save();
    }
  }

	public function getFriends() {
		$requests = FriendRequest::where(function ($query) {
				$query->where('owner_id', '=', $this->id)
							->where('status', '=', User::STATUS_APPROVED);
		})->orWhere(function ($query) {
				$query->where('user_id', '=', $this->id)
							->where('status', '=', User::STATUS_APPROVED);
		})->get();

		if ($requests->count()) {
			$friendIds = array();
			foreach ($requests as $request) {
				if ($request->owner_id == $this->id) {
					$friendId = $request->user_id;
				} else {
					$friendId = $request->owner_id;
				}
				$friendIds[] = $friendId;
			}
			$friends = User::whereIn('id', $friendIds)->get();
      return $friends;
		} else {
      // just empty query object
      return $requests;
    }
	}

  public function getInbox() {
    $data = FriendRequest::with('owner')
      ->where('user_id', '=', $this->id)
      ->where('status', '=', User::STATUS_PENDING)
      ->get();

    return $data;
  }

  public function getOutbox() {
    $data = FriendRequest::with('user')
      ->where('owner_id', '=', $this->id)
      ->where('status', '!=', User::STATUS_APPROVED)
      ->get();
    return $data;
  }
}
