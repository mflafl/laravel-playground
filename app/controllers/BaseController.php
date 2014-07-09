<?php

class BaseController extends Controller {
	
	protected $layout = 'layouts.base';

	/**
	 * Upload file page.
	 *
	 * @return view
	 */
	protected function uploadFormView()
	{
		return View::make('upload');
	}

	/**
	 * Upload form handler
	 *
	 * @return Response
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
		$responseData = array();
		
		if ($validator->fails()) {
			$errors = $validator->messages()->getMessages();
		} else {
			$username = Input::get('username');
			$filename = $username.time();
			$responseData['id'] = $filename;
			
			$uploaded = Input::file('file')->move('uploads', $filename);

			$data = array(
				'filename' => $filename,
				'file' => $uploaded->getRealPath(),
				'username' => Input::get('username')
			);
			Queue::push('convertHandler', $data);			
		}

		return Response::json(array('errors' => $errors, 'data' => $responseData));
	}
	
	/**
	 * convert Progress
	 *
	 * @return Response
	 */
	protected function convertProgress()
	{
		$errors = array();
		$responseData = array();
		$progressValue = 0;

		$id = Input::get('id');
		$progress = json_decode(Sonus::getProgress($id));

		if ($progress) {
			$progressValue = $progress->Progress;
		}

		$responseData['progress'] = $progressValue;
		return Response::json(array('errors' => $errors, 'data' => $responseData));
	}
}