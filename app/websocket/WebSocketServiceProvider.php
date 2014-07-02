<?php
namespace App\WebSocket;

use Illuminate\Support\ServiceProvider;

class WebSocketServiceProvider extends ServiceProvider {

	/**
	 * Indicates if loading of the provider is deferred.
	 *
	 * @var bool
	 */
	protected $defer = false;

	/**
	 * Bootstrap the application events.
	 *
	 * @return void
	 */
	public function boot()
	{

	}

	/**
	 * Register the service provider.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app['web_socket'] = $this->app->share(function($app) {
			$address = 'tcp://localhost:5555';
			return new SocketNotificationManager($address);
		});
	}

}