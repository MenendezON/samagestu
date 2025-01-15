<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\PersonnelController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\SubjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('school');
        return response()->json(['data' => $user]);
    });

    Route::apiResource('/users', UserController::class);

    Route::apiResource('/schools', SchoolController::class);
    Route::apiResource('/classes', ClassroomController::class);
    Route::apiResource('/students', StudentController::class);
    Route::apiResource('/subjects', SubjectController::class);
    Route::apiResource('/teachers', PersonnelController::class);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
