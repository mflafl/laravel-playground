<?php

class BaseController extends Controller {
	
	protected $layout = 'layouts.base';

	/**
	 * Upload file page.
	 *
	 * @return void
	 */
	protected function uploadFormView()
	{
		return View::make('upload');
	}

	/**
	 * Upload form handler
	 *
	 * @return void
	 */
	protected function uploadFormProcess()
	{
		$validator = Validator::make(
			array('file' => Input::file('file')),
			array('file' => 'required|mimes:mpga')
		);

		if ($validator->fails()) {
			return Redirect::to('')->withErrors($validator);
		} else {
			$clientName = Input::file('file')->getClientOriginalName();
			$clientName = str_replace(' ', '', $clientName);
			$uploaded = Input::file('file')->move('uploads', $clientName);
			Queue::push('convertHandler', array('name' => $clientName));
			return Redirect::to('');
		}
	}
}