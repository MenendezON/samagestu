<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    public function store(Request $request)
    {
        $grade = Grade::create($request->all());
        return response()->json($grade, 201);
    }

    public function index($classId)
    {
        return Grade::where('class_id', $classId)->get();
    }
}
