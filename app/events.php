<?php

Event::listen('convert.success',function($client_data) {
		WebSocket::setMessage('convert.success', array('data'=>'success'));
		WebSocket::sendMessageTo(array('test'));
});