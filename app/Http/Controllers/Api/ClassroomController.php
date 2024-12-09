<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    public function index()
    {
        return Classroom::all();
    }

    public function store(Request $request)
    {
        $classroom = Classroom::create($request->all());
        return response()->json($classroom, 201);
    }
}
