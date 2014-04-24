<?php

class BaseController extends Controller {

	/**
	 * Setup the layout used by the controller.
	 *
	 * @return void
	 */
	protected function uploadFormView()
	{
		return View::make('upload');
	}

	/**
	 * Setup the layout used by the controller.
	 *
	 * @return void
	 */
	protected function uploadFormProcess()
	{
		$clientName = Input::file('file')->getClientOriginalName();
		$uploaded = Input::file('file')->move('uploads', $clientName);
		Queue::push('convertHandler', array('name' => $clientName));
		return Redirect::to('');
	}
}
