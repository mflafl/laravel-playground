<?php

class FriendsController extends Controller {

	protected $layout = 'layouts.base';

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
			$user->addFriend($friend);
		} else {
			$errors[] = 'Bad user';
		}
  }

  function getFriends() {
		$user = User::current();
		$friends = $user->getFriends();
		return Response::json(array('errors' => array(), 'data' => $friends->toArray()));
  }

	function removeFriend() {
		$user = User::current();
		$friendId = Input::get('userId');
		$user->removeFriend($friendId);
		return Response::json(array('errors' => array()));
	}

}