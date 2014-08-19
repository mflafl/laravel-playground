<?php

Event::listen('convert.success',function($client_data) {
  WebSocket::setMessage('convert.success', $client_data);
  WebSocket::sendMessageTo(array($client_data['username']));
});

Event::listen('soundcloud.upload.success', function($client_data) {
  $sendTo = $client_data['username'];
  Mail::send('emails.converted', $client_data, function($message) use ($sendTo)
  {
    $message->to($sendTo)->subject('Converted!');
  });
});

