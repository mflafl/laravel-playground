<?php

class ConvertedFile extends Eloquent {
  public function user()
  {
    return $this->belongsTo('User');
  }
}