<?php

namespace App\WebSocket;

class JsonMessage
{
    protected $message;

    protected $json;

    public function __construct($action = '', array $parameters = array())
    {
        $this->setAction($action);
        $this->setParameters($parameters);
    }

    public function prepareJson()
    {
        $this->json = json_encode($this->message);

        return $this;
    }

    public static function createFromArray(array $array)
    {
        $a = self::getValidAction($array['action']);
        $p = self::getValidParameters($array['parameters']);

        return new self($a, $p);
    }

    protected static function getValidAction($a)
    {
        if ( is_string($a.'')) {
            return $a?:'';
        }else return '';
    }

    protected static function getValidParameters($p)
    {
        return is_array($p) ? $p : array();
    }

    public function setAction($action)
    {
        $this->message['action'] = $action;

        return $this;
    }

    public function getAction()
    {
        return $this->message['action'];
    }

    public function setParameters(array $parameters)
    {
        $this->message['parameters'] = $parameters;

        return $this;
    }

    public function getParameters()
    {
        return $this->message['parameters'];
    }

    public function addParameter($key, $parameter, $toBase64 = false)
    {
        $this->message['parameters'][$key] = $toBase64 ? $parameter : base64_encode($parameter);

        return $this;
    }

    public function getParameter($key)
    {
        return $this->message['parameters'][$key];
    }

    public function removeParameterByKey($key)
    {
        unset($this->message['parameters'][$key]);
    }

    public function removeParameter($parameter)
    {
        $key = array_search($parameter, $this->message['parameters']);
        if ($key) unset($this->message['parameters'][$key]);
    }

    public function getJson()
    {
        return $this->json;
    }

    public function setJson( $json )
    {
        $this->json = $json;

        return $this;
    }

    public function getArray()
    {
        return $this->message;
    }

}