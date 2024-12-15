<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Personnel;
use Illuminate\Http\Request;

class PersonnelController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Personnel::all()]);
    }

    public function store(Request $request){}

    public function show(){}

    public function update(){}

    public function destroy(){}
}
