<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with('classroom')->get();

        return response()->json(['data' => $students]);
    }

    public function show($id)
    {
        $student = Student::with('classroom')->findOrFail($id);

        return response()->json(['data' => $student]);
    }

    public function store(Request $request)
    {
        $student = Student::create($request->all());

        return response()->json($student, 201);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $student->update($request->all());

        return response()->json($student, 200);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);

        if (!$student) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $student->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
