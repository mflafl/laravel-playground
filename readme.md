## Laravel PHP Framework

* Install vendors
```sh
  $ composer install
  $ bower install
```
* Setup and Run WebSocket server (tcp://localhost:5555, ws://localhost:8080)

```sh
  $ git clone ssh://sc@sourcecontrol.masterofcode.com:2222/ruslan.palagin/gscore_websocket.git
```

* Install ffmpeg

* Check ffmpeg settings - app/config/config.php (link to vendor/rafasamp/sonus/src/config/config.php, must be writable)
```sh
return array(
   'ffmpeg'		   => '/usr/bin/ffmpeg',
   'ffprobe'        => '/usr/bin/ffprobe',
   'progress' => true,
   'tmp_dir'      => '/tmp/'
);
```

* Install rabitmq, check rabitmq server settings (app/config/queue.php)
```sh
  'rabbitmq' => array(
        'driver'         => 'rabbitmq',
        'host'           => 'localhost',
        'port'           => '5672',
        'vhost'          => '',
        'login'          => '',
        'password'       => '',
        'queue'          => 'queue', // name of the default queue
        'exchange_name'  => 'exchange', // name of the exchange
        // Type of your exchange
        // Can be AMQP_EX_TYPE_DIRECT or AMQP_EX_TYPE_FANOUT
        // see documentation for more info
        // http://www.rabbitmq.com/tutorials/amqp-concepts.html
        'exchange_type'  => AMQP_EX_TYPE_DIRECT,
        'exchange_flags' => AMQP_DURABLE,
    )
```
* Start queue listener (from project root)
```sh
  $ php artisan queue:listen
```

* Upload mp3/ogg files