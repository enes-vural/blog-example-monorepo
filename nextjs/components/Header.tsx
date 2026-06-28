'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/lib/api';

const ASTRO_URL = process.env.NEXT_PUBLIC_ASTRO_URL ?? 'http://localhost:4321';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('auth_token'));
  }, [pathname]);

  async function handleLogout() {
    await logout();
    setIsLoggedIn(false);
    router.push('/blog');
  }

  const isActive = (path: string) =>
    pathname === path ? 'text-white' : 'text-zinc-400 hover:text-white';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] backdrop-blur-xl bg-[#080810]/80">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href={ASTRO_URL}
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            ← Ana Sayfa
          </a>
          <Link href="/blog" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_12px_#7c3aed]" />
            DevBlog
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/blog" className={`text-sm transition-colors ${isActive('/blog')}`}>
            Yazılar
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/admin" className={`text-sm transition-colors ${isActive('/admin')}`}>
                Admin
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors font-medium"
            >
              Giriş Yap
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
