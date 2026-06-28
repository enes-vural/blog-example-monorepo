import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevBlog — Portal',
  description: 'Geliştirici blogu portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.className}>
      <body className="bg-[#080810] text-zinc-100 min-h-screen">
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
