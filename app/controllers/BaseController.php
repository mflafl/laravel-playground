<?php

class BaseController extends Controller {

	protected $layout = 'layouts.base';

	/**
	 * Upload file page.
	 *
	 * @return view
	 */
	protected function index()
	{
		return View::make('app');
	}

	/**
	 * Register
	 *
	 * @return JSON
	 */
	protected function login()
  {
    $accessToken = Input::get('access_token');
    $errors = array();

    Facebook::setAccessToken($accessToken);
    $userObject = Facebook::object('me')->fields('id', 'email', 'name')->get();
    $userData = $userObject->toArray();
    $userData['access_token'] = $accessToken;

    $user = User::find($userData['id']);

    if (!$user) {
      $user = new User();
      $user->id = $userData['id'];
    }

    $user->access_token = $accessToken;
    $user->email = $userData['email'];
    $user->save();

    return Response::json(array('errors' => $errors, 'data' => $userData));
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
				'file' => Input::file('file')
			),
			array(
				'file' => 'required|mimes:mpga,ogx'
			)
		);

		$errors = array();
		$responseData = array();

		if ($validator->fails()) {
			$errors = $validator->messages()->getMessages();
    } else {
      $user = User::current();
			$username = $user->email;
			$filename = $username.time();
			$responseData['id'] = $filename;

			$uploaded = Input::file('file');
      $clientName = $uploaded->getClientOriginalName();

      $uploaded = $uploaded->move('uploads', $filename);

			$data = array(
        'fb_user_id' => $user->id,
        'client_name' => $clientName,
				'filename' => $filename,
				'file' => $uploaded->getRealPath(),
				'username' => $username,
        'sc_publish' => Input::get('sc_publish'),
        'sc_token' => Input::get('sc_token')
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

	protected function getUserConvertedfiles() {
    $user = User::current();
		$errors = array();
		$files = $user->getAllFiles();
		return $files;
	}

  protected function getUsers() {
    $user = User::current();
    $data = DB::select('select email from users where id <> ?', array($user->id));
    $result = array();

    foreach ($data as $value) {
      $result[] = $value->email;
    }

    return $result;
  }

  protected function deleteConvertedfile() {
    $user = User::current();
    $id = (int) Input::get('id');
    $file = ConvertedFile::find($id);
    if ($file->user->id === $user->id) {
      File::delete(public_path().'/'.$file->system_name);
      $file->delete();
    }
  }
}