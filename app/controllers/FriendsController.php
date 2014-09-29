<?php

class FriendsController extends Controller {

	protected $layout = 'layouts.base';
	
	/**
	 * Users list (for the autocomplete form)
	 *
	 * @return Array
	 */	
  protected function getUsers() {
    $user = User::current();
    $data = DB::select('select email from users where id <> ?', array($user->id));
    $result = array();

    foreach ($data as $value) {
      $result[] = $value->email;
    }

    return $result;
  }

  function inbox() {
		$user = User::current();
		$inbox = $user->getInbox();
		return Response::json(array('errors' => array(), 'data' => $inbox->toArray()));
  }

  function outbox() {
		$user = User::current();
		$outbox = $user->getOutbox();
		return Response::json(array('errors' => array(), 'data' => $outbox->toArray()));
  }

  function addFriend() {
		$errors = array();
		$user = User::current();
		$friend_username = Input::get('username');
		$friend = User::where('email', '=', $friend_username)->first();

		if ($friend) {
			if (!$user->addFriend($friend)) {
				$errors[] = 'You have already requested friendship';
			}
		} else {
			$errors[] = 'Bad user';
		}

		return Response::json(array('errors' => $errors));
  }

  function getFriends() {
		$user = User::current();
		$friends = $user->getFriends();
		return Response::json(array('errors' => array(), 'data' => $friends));
  }

	function removeFriend() {
		$user = User::current();
		$friendId = Input::get('userId');
		$user->removeFriend($friendId);
		return Response::json(array('errors' => array()));
	}

	/*
	 * Cancel own friend request
	 *
	 * @return JSON
	 */	
	function cancelRequest() {
		$user = User::current();
		$errors = array();
		$requestId = Input::get('requestId');
		$request = FriendRequest::find($requestId);

		if ($request) {
			if ($request->owner_id == $user->id && $request->status == User::STATUS_PENDING) {
				$request->delete();
			}
		} else {
			$errors[] = 'Request not found';
		}

		return Response::json(array('errors' => $errors));
	}
	
	/*
	 * Dont show request in inbox folder
	 *
	 * @return JSON
	 */
	function ignoreRequest() {
		$user = User::current();
		$errors = array();
		$requestId = Input::get('requestId');
		$request = FriendRequest::find($requestId);

		if ($request) {
			if ($request->user_id == $user->id && $request->status == User::STATUS_PENDING) {
				$request->status = User::STATUS_IGNORED;
				$request->save();
			}
		} else {
			$errors[] = 'Request not found';
		}
		return Response::json(array('errors' => $errors));
	}
}