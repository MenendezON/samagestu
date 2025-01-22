<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

    // public function store(Request $request)
    // {
    //     $student = Student::create($request->all());

    //     return response()->json($student, 201);
    // }

    // public function update(Request $request, $id)
    // {
    //     $student = Student::findOrFail($id);

    //     $student->update($request->all());

    //     return response()->json($student, 200);
    // }

public function store(Request $request)
{
    $request->validate([
        'full_name' => 'required|string|max:255',
        'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate avatar
        // Add other validations as needed
    ]);

    $data = $request->all();

    // Handle file upload
    if ($request->hasFile('avatar')) {
        $file = $request->file('avatar');
        $path = $file->store('avatars', 'public'); // Save to storage/app/public/avatars
        $data['avatar'] = $path; // Save the file path to the database
    }

    $student = Student::create($data);

    return response()->json($student, 201);
}

public function update(Request $request, $id)
{
    $student = Student::findOrFail($id);

    $request->validate([
        'full_name' => 'required|string|max:255',
        'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate avatar
        // Add other validations as needed
    ]);

    $data = $request->all();

    // Handle file upload
    if ($request->hasFile('avatar')) {
        // Delete old avatar if it exists
        if ($student->avatar) {
            Storage::disk('public')->delete($student->avatar);
        }

        $file = $request->file('avatar');
        $path = $file->store('avatars', 'public');
        $data['avatar'] = $path;
    }

    $student->update($data);

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
