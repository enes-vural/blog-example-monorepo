const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  created_at: string;
  category: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

// CSRF cookie'yi al — login öncesi çağrılmalı
async function getCsrfCookie(): Promise<void> {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
}

// Cookie'den XSRF-TOKEN oku
function getXsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

// Tüm yayınlanmış yazıları getir
export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/posts`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 }, // Next.js cache: 60 saniyede bir yenile
  });

  if (!res.ok) return [];
  return res.json();
}

// Tek yazıyı slug ile getir
export async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_URL}/api/posts/${slug}`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) return null;
  return res.json();
}

// Giriş yap
export async function login(email: string, password: string, remember = false) {
  await getCsrfCookie();

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-XSRF-TOKEN': getXsrfToken(),
    },
    body: JSON.stringify({ email, password, remember }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'Giriş başarısız');
  }

  return res.json();
}

// Çıkış yap
export async function logout() {
  await getCsrfCookie();

  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-XSRF-TOKEN': getXsrfToken(),
    },
  });
}

// Giriş yapılmış kullanıcıyı getir
export async function getMe(): Promise<User | null> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) return null;
  return res.json();
}

// Yeni yazı oluştur
export async function createPost(data: {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
}) {
  await getCsrfCookie();

  const res = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-XSRF-TOKEN': getXsrfToken(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'Yazı oluşturulamadı');
  }

  return res.json();
}
