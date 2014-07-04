<?php

Event::listen('convert.success',function($client_data) {
  WebSocket::setMessage('convert.success', $client_data);
  WebSocket::sendMessageTo(array($client_data['username']));
});