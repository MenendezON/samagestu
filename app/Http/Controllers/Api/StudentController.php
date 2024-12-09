<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return Student::with('classroom')->get();
    }

    public function store(Request $request)
    {
        $student = Student::create($request->all());
        return response()->json($student, 201);
    }
}
