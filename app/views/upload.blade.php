@extends('layouts.base')
@section('content')
<?php if (count($errors)): ?>
  <ul class="alert alert-danger">
    <?php foreach ($errors->all('<li>:message</li>') as $message): ?>
      <?php print $message ?>
    <?php endforeach ?>
  </ul>
<?php endif; ?>
<div>
<?php echo Form::open(array('url' => 'convert', 'files' => true)); ?>
<p><?php echo Form::file('file', $attributes = array()); ?></p>
<?php echo Form::submit('Convert', ['class' => 'btn btn-lg btn-success']); ?>
<?php echo Form::close();?>
</div>
@endsection