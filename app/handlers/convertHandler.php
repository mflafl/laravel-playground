<?php

class convertHandler {
    public function fire($job, $data)
    {
        $input = app_path().'/../public/uploads/'.$data['filename'];
        $output = app_path().'/../public/'.time().'.ogg';
        shell_exec(sprintf('ffmpeg -i %s -c:a libvorbis -q:a 4 %s', $input, $output));
        File::append(app_path().'/../public/queue.txt', $input . ' => '. $output.PHP_EOL);

        $job->delete();
        Event::fire('convert.success', array($data));
    }
}