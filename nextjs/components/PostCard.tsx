import Link from 'next/link';
import type { Post } from '@/lib/api';

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="p-6 bg-[#0f0f1a] border border-white/[0.08] rounded-xl transition-all group-hover:border-violet-500/30 group-hover:-translate-y-0.5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-1 bg-violet-500/10 text-violet-300 rounded-full border border-violet-500/20">
            {post.category}
          </span>
          <span className="text-xs text-zinc-500">{post.created_at}</span>
        </div>

        <h2 className="text-lg font-semibold text-white mb-2 tracking-tight group-hover:text-violet-300 transition-colors">
          {post.title}
        </h2>

        <p className="text-zinc-400 text-sm leading-relaxed">{post.excerpt}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-zinc-500">{post.author}</span>
          <span className="text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Okumaya devam et →
          </span>
        </div>
      </article>
    </Link>
  );
}
