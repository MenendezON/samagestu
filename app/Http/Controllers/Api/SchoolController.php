<?php

// app/Http/Controllers/SchoolController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

class SchoolController extends Controller
{
    public function index()
    {
        return UserResource::collection(School::all());
    }

    public function show($id)
    {
        return School::findOrFail($id);
    }

    public function store(Request $request)
    {
        $school = School::create($request->all());
        return response()->json($school, 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\School $school
     * @return \Illuminate\Http\Response
     */
    public function destroy(School $school)
    {
        $school->delete();

        return response("School has been deleted successfully", 204);
    }
}
