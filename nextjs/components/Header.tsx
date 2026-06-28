'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ? 'text-white' : 'text-zinc-400 hover:text-white';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] backdrop-blur-xl bg-[#080810]/80">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/blog" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_12px_#7c3aed]" />
          DevBlog
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/blog" className={`text-sm transition-colors ${isActive('/blog')}`}>
            Yazılar
          </Link>
          <Link
            href="/login"
            className="text-sm px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors font-medium"
          >
            Giriş Yap
          </Link>
        </nav>
      </div>
    </header>
  );
}
