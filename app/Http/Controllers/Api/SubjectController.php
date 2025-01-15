<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::with('classroom')->get();

        return response()->json(['data' => $subjects]);
    }

    public function show($id)
    {
        $subject = Subject::with('classroom')->findOrFail($id);

        return response()->json(['data' => $subject]);
    }

    public function store(Request $request)
    {
        $subject = Subject::create($request->all());

        return response()->json($subject, 201);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $subject->update($request->all());

        return response()->json($subject, 200);
    }

    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);

        if (!$subject) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $subject->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
