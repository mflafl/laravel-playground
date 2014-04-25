## Laravel PHP Framework

# install vendors
```sh
  $ composer install
```
# download and install ffmpeg (binnary path - ffmpeg)

# check rabitmq server setting (app/config/queue.php)

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

# start rabbitmq server
# start queue listener: run from project root:

```sh
  $ php artisan queue:listen
```

# converted files path: /public/*.ogg