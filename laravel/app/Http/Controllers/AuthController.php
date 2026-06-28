<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Giriş yapılmış kullanıcının bilgilerini döndür
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // Giriş yap
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // remember: true ise cookie kalıcı olur (browser kapansa bile)
        $remember = $request->boolean('remember', false);

        if (!Auth::attempt($request->only('email', 'password'), $remember)) {
            throw ValidationException::withMessages([
                'email' => 'E-posta veya şifre hatalı.',
            ]);
        }

        // Session yenile (session fixation saldırısına karşı)
        $request->session()->regenerate();

        return response()->json([
            'user' => Auth::user(),
        ]);
    }

    // Çıkış yap
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Çıkış yapıldı.']);
    }

    // Kayıt ol
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['user' => $user], 201);
    }
}
