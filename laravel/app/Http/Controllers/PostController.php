<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    // Tüm yayınlanmış yazıları getir (herkese açık)
    public function index()
    {
        $posts = Post::with('user')
            ->where('published', true)
            ->latest()
            ->get()
            ->map(fn($post) => [
                'id'         => $post->id,
                'title'      => $post->title,
                'slug'       => $post->slug,
                'excerpt'    => $post->excerpt,
                'category'   => $post->category,
                'author'     => $post->user->name,
                'created_at' => $post->created_at->format('Y-m-d'),
            ]);

        return response()->json($posts);
    }

    // Tek yazıyı slug ile getir (herkese açık)
    public function show(string $slug)
    {
        $post = Post::with('user')
            ->where('slug', $slug)
            ->where('published', true)
            ->firstOrFail();

        return response()->json([
            'id'         => $post->id,
            'title'      => $post->title,
            'slug'       => $post->slug,
            'excerpt'    => $post->excerpt,
            'content'    => $post->content,
            'category'   => $post->category,
            'author'     => $post->user->name,
            'created_at' => $post->created_at->format('Y-m-d'),
        ]);
    }

    // Yeni yazı oluştur (sadece giriş yapılmış kullanıcı)
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'    => 'required|string|max:255',
            'excerpt'  => 'required|string',
            'content'  => 'required|string',
            'category' => 'sometimes|string|max:100',
        ]);

        $post = Post::create([
            ...$data,
            'user_id'   => $request->user()->id,
            'slug'      => Str::slug($data['title']),
            'published' => true,
        ]);

        return response()->json($post, 201);
    }

    // Yazıyı sil (sadece yazının sahibi)
    public function destroy(Request $request, Post $post)
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Yetkisiz işlem.'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Yazı silindi.']);
    }
}
