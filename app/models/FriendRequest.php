<?php

class FriendRequest extends Eloquent {
    public function owner()
    {
      return $this->hasOne('User', 'id', 'owner_id');
    }

    public function user()
    {
      return $this->hasOne('User', 'id', 'user_id');
    }
}