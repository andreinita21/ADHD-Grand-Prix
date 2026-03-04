import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TaskProvider } from '@/context/TaskContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ADHD Grand Prix',
  description: 'Gamified task selection system using an F1 racing metaphor.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-slate-900 text-slate-100 min-h-screen`}>
        <TaskProvider>
          {children}
        </TaskProvider>
      </body>
    </html>
  );
}
