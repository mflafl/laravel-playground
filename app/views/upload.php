<?php
  echo Form::open(array('url' => 'convert', 'files' => true));
  echo Form::file('file', $attributes = array());
  echo Form::submit('Convert');
  echo Form::close();