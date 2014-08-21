<?php

Event::listen('convert.success',function($client_data) {
  $user = User::getOrCreate($client_data['username']);
  $file = new ConvertedFile;
  $file->user_id = $user->id;
  $file->filename = $client_data['client_name'];
  $file->filepath = $client_data['url'];
  $file->save();

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