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
			array(
				'file' => Input::file('file'),
				'username' => Input::get('username')
			),
			array(
				'file' => 'required|mimes:mpga,ogx',
				'username' => 'required'
			)
		);

		$errors = array();
		
		if ($validator->fails()) {
			$errors = $validator->messages()->getMessages();
		} else {
			$username = Input::get('username');
			$filename = $username.time();

			$uploaded = Input::file('file')->move('uploads', $filename);

			$data = array(
				'filename' => $filename,
				'file' => $uploaded->getRealPath(),
				'username' => Input::get('username')
			);
			Queue::push('convertHandler', $data);			
		}

		return Response::json(array('errors' => $errors));		
	}
}