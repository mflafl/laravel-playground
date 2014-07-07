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
<?php echo Form::submit('Convert', ['class' => 'btn btn-lg btn-success', 'ng-click' => 'convert()']); ?>
<?php echo Form::hidden('username'); ?>
<?php echo Form::close();?>
</div>
<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title" id="myModalLabel">Download file</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <a id="downloadLink" role="button" class="btn btn-primary">Download</a>
      </div>
    </div>
  </div>
</div>
@endsection