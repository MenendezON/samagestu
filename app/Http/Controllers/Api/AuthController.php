<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\School;
use App\Models\User;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="Auth",
 *     description="Operations related to authentication"
 * )
 */
class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/signup",
     *     summary="User signup",
     *     description="Authenticate a user and return a token", 
     *     tags={"Authentication"},    
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "password"},
     *             @OA\Property(property="name", type="string", example="Company name"),
     *             @OA\Property(property="email", type="string", example="kykyponke@mailinator.com"),
     *             @OA\Property(property="password", type="string", example="cleante@1957"),
     *             @OA\Property(property="password_confirmation", type="string", example="cleante@1957")
     *         )
     *     ),
     * 
     *     @OA\Parameter(name="Name", in="query", description="Provide the company name", required=true),
     *     @OA\Parameter(name="Email", in="query", description="Provide the admin email", required=true),
     *     @OA\Parameter(name="Password", in="query", description="Provide the admin password", required=true),
     *     @OA\Parameter(name="Password_confirmation", in="query", description="Confirm the admin password", required=false),
     *     @OA\Response(
     *         response=200,
     *         description="Successfully logged in",
     *         @OA\JsonContent(type="object", @OA\Property(property="token", type="string"))
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials"
     *     )
     * )
     */
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        /** @var \App\Models\School $school */
        $school = School::create([
            'name' => $data['name'],
            'phone' => $request->get('phone'),
        ]);

        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => 'Default User',
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'school_id' => $school->id,
        ]);

        if (!$school || !$user) {
            return response()->json(['error' => 'Failed to create school or user'], 500);
        }

        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }
    /**
     * @OA\Post(
     *     path="/api/login",
     *     summary="User login",
     *     description="Authenticate a user and return a token",
     *     tags={"Authentication"}, 
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", example="kykyponike@mailinator.com"),
     *             @OA\Property(property="password", type="string", example="cleante@1957")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successfully logged in",
     *         @OA\JsonContent(type="object", @OA\Property(property="token", type="string"))
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials"
     *     )
     * )
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email or password is incorrect'
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }
}
