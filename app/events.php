<?php

Event::listen('convert.success',function($client_data) {
  $file = new ConvertedFile;
  $file->user_id = $client_data['fb_user_id'];
  $file->filename = $client_data['client_name'];
  $file->filepath = $client_data['url'];
  $file->system_name = $client_data['filename'];
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