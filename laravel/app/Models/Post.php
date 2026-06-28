<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    // Bu kolonlar dışarıdan toplu atanabilir (create/update)
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'category',
        'excerpt',
        'content',
        'published',
    ];

    // true/false olarak dönsün (DB'de 0/1 tutulur)
    protected $casts = [
        'published' => 'boolean',
    ];

    // Bir yazı bir kullanıcıya aittir
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Başlıktan otomatik slug üret: "Merhaba Dünya" → "merhaba-dunya"
    public static function generateSlug(string $title): string
    {
        return Str::slug($title);
    }
}
