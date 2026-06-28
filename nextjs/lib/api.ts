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

function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('auth_token') ?? '';
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/posts`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) return [];
  return res.json();
}

export async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_URL}/api/posts/${slug}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) return null;
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'Giriş başarısız');
  }

  const data = await res.json();
  localStorage.setItem('auth_token', data.token);
  return data;
}

export async function logout() {
  const token = getToken();
  if (token) {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: authHeaders(),
    });
  }
  localStorage.removeItem('auth_token');
}

export async function getMe(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: authHeaders(),
  });

  if (!res.ok) return null;
  return res.json();
}

export async function createPost(data: {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
}) {
  const res = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'Yazı oluşturulamadı');
  }

  return res.json();
}
