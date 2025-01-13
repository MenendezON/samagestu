<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Personnel;
use Illuminate\Http\Request;
/**
 * @OA\Info(title="IMAREB API", version="1.0.0")
 *
 * @OA\PathItem(path="/api")
 */
class PersonnelController extends Controller
{
     /**
     * @OA\Get(
     *     path="/api/personnels",
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
        return response()->json(['data' => Personnel::all()]);
    }

    public function store(Request $request)
    {
        $personnel = Personnel::create($request->all());
        return response()->json($personnel, 201);
    }

    public function show($id)
    {
        $personnel = Personnel::with('school')->findOrFail($id);

        return response()->json(['data' => $personnel]);
    }

    public function update(Request $request, $id)
    {
        // Find the personnel by ID or fail
        $personnel = Personnel::findOrFail($id);

        // Update the personnel with the request data
        $personnel->update($request->all());

        // Return the updated personnel as a JSON response
        return response()->json($personnel, 200);
    }

    public function destroy($id)
    {
        $personnel = Personnel::find($id);

        if (!$personnel) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $personnel->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
