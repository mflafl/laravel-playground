<?php

namespace App\WebSocket;

class SocketNotificationManager
{
    protected $zmqConnectTo;
    protected $jsonMessage;

    public function __construct($zmqConnectTo)
    {
        $this->zmqConnectTo = $zmqConnectTo;
    }

    public function setMessage($action , $parameters)
    {
        $this->jsonMessage = new JsonMessage($action , $parameters);

        return $this;
    }

    /**
     * @param array $usernames - array of strins with usernames of the recipients
     * @param array $message   - assoc array that will send to clients through websocket as JSON
     */
    public function sendMessageTo($usernames)
    {
        if ( class_exists('ZMQContext')) {
            $zmqMessage = array(
                'usernames' => $usernames,
                'message' => $this->jsonMessage->getArray()
            );

            $context = new \ZMQContext();
            $socket = $context->getSocket(\ZMQ::SOCKET_PUSH, 'my pusher');
            $socket->connect($this->zmqConnectTo);

            $socket->send(json_encode($zmqMessage));
        } else {
            throw new \Exception('ZMQ has to be installed');
        }
    }
}