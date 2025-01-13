<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/classroom",
     *     summary="Get all personnels",
     *     description="This endpoint requires a valid Bearer token",
     *     security={{"bearerAuth": {}}},  
     *     tags={"Personnel"},     
     *     @OA\Response(
     *         response=200,
     *         description="Successful response",
     *         @OA\JsonContent(type="object", @OA\Property(property="data", type="string"))
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function index()
    {
        // Fetch classrooms with personnel names
        $classrooms = Classroom::with('personnel')->get();

        return response()->json(['data' => $classrooms]);
    }

    public function show($id)
    {
        $classroom = Classroom::with('personnel')->findOrFail($id);

        return response()->json(['data' => $classroom]);
    }

    public function store(Request $request)
    {
        $classroom = Classroom::create($request->all());
        return response()->json($classroom, 201);
    }

    public function update(Request $request, $id)
    {
        // Find the classroom by ID or fail
        $classroom = Classroom::findOrFail($id);

        // Update the classroom with the request data
        $classroom->update($request->all());

        // Return the updated classroom as a JSON response
        return response()->json($classroom, 200);
    }

    public function destroy($id)
    {
        $classroom = Classroom::find($id);

        if (!$classroom) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $classroom->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
