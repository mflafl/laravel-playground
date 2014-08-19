<?php

class convertHandler {
    public function fire($job, $data)
    {
      error_reporting(0);

      $inputPath = $data['file'];
      $targetFilename = $data['username'].time().'.mp3';
      $outputPath = public_path() . '/' . $targetFilename;
      
      Sonus::convert()->input($inputPath)->output($outputPath)->progress($data['filename'])->go('-b:a 64k -ac 1');
      File::delete(public_path().'/uploads/'.$data['filename']);

      $eventData = array(
        'username' => $data['username'],
        'filename' => $targetFilename,
        'url' => asset($targetFilename),
        'client_name' => $data['client_name']
      );

      Event::fire('convert.success', array($eventData));

      // Upload to Soundcloud
      if ($data['sc_publish']) {
        Soundcloud::setAccessToken($data['sc_token']);
        $track = json_decode(Soundcloud::post('tracks', array(
            'track[title]' => $data['client_name'],
            'track[asset_data]' => '@'.$outputPath,
        )));
        $eventData['soundcloud_permalink_url'] = $track->permalink_url;
        Event::fire('soundcloud.upload.success', array($eventData));
      }

      $job->delete();
    }
}