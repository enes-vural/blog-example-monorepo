// Server Component — sunucuda çalışır, Laravel API'den veri çeker
// Flutter'daki FutureBuilder'ın sunucu versiyonu gibi düşün
import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Yazılar</h1>
        <p className="text-zinc-400">{posts.length} yazı bulundu</p>
      </div>

      <div className="grid gap-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
