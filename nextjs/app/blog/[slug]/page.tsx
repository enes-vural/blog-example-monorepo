import { getPost } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/blog" className="text-sm text-zinc-400 hover:text-white transition-colors mb-8 inline-flex items-center gap-1">
        ← Yazılara dön
      </Link>

      <article className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2 py-1 bg-violet-500/10 text-violet-300 rounded-full border border-violet-500/20">
            {post.category}
          </span>
          <span className="text-xs text-zinc-500">{post.created_at}</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-4">{post.title}</h1>

        <p className="text-zinc-400 text-sm mb-8">
          Yazar: <span className="text-zinc-300">{post.author}</span>
        </p>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-zinc-300 leading-relaxed">{post.content}</p>
        </div>
      </article>
    </div>
  );
}
