<?php

class convertHandler {
    public function fire($job, $data)
    {
      $inputPath = $data['file'];
      $targetFilename = time().'.ogg';  
      $outputPath = public_path() . '/' . $targetFilename;
      
      Sonus::convert()->input($inputPath)->output($outputPath)->progress($data['filename'])->go();
      File::delete(public_path().'/uploads/'.$data['filename']);

      $eventData = array(
        'username' => $data['username'],
        'filename' => $targetFilename,
        'url' => asset($targetFilename)
      );

      Event::fire('convert.success', array($eventData));

      $job->delete();
    }
}