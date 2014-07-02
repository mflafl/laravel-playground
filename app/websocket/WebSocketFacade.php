<?php
namespace App\WebSocket;

use Illuminate\Support\Facades\Facade;

class WebSocketFacade extends Facade {

	/**
	 * Get the registered name of the component.
	 *
	 * @return string
	 */
	protected static function getFacadeAccessor() { return 'web_socket'; }
}