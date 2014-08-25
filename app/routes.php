<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', 'BaseController@index');
Route::post('convert', 'BaseController@uploadFormProcess');
Route::post('progress', 'BaseController@convertProgress');

Route::post('user', 'BaseController@login');
Route::get('user/files', 'BaseController@getUserConvertedfiles');
Route::get('users', 'BaseController@getUsers');