import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TimerProvider } from './providers/TimerProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '工作休息提醒器',
  description: '一个帮助你平衡工作和休息的时间管理工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <TimerProvider>
          {children}
        </TimerProvider>
      </body>
    </html>
  );
}