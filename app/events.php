<?php

Event::listen('convert.success',function($client_data) {
		WebSocket::setMessage('convert.success', array('filename' => $client_data['filename']));
		WebSocket::sendMessageTo(array($client_data['username']));
});