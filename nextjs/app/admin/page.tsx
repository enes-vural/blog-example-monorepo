'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, getMe, logout } from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Genel');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    getMe().then(user => {
      if (!user) {
        router.push('/login');
      } else {
        setUserName(user.name);
      }
    });
  }, [router]);

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createPost({ title, excerpt, content, category });
      setSaved(true);
      setTitle('');
      setExcerpt('');
      setContent('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Hoş geldin, <span className="text-white">{userName}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Çıkış Yap
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Başlık</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Yazı başlığı..."
            required
            className="w-full bg-[#0f0f1a] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Kategori</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-[#0f0f1a] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
          >
            <option>Genel</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>Mimari</option>
            <option>DevOps</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Özet</label>
          <input
            type="text"
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="Kısa açıklama..."
            required
            className="w-full bg-[#0f0f1a] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">İçerik</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Yazı içeriği..."
            required
            rows={10}
            className="w-full bg-[#0f0f1a] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {saved && <p className="text-green-400 text-sm">Yazı başarıyla yayınlandı!</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          {loading ? 'Yayınlanıyor...' : 'Yayınla'}
        </button>
      </form>
    </div>
  );
}
