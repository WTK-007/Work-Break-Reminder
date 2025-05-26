import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TimerProvider } from './providers/TimerProvider';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '工作休息提醒器 - 让工作更高效，让休息更及时',
  description: '一个帮助你平衡工作和休息的智能时间管理工具，让工作更高效，让休息更及时',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {/* Plausible Analytics */}
        <Script 
          defer 
          data-domain="breakreminder.work" 
          src="https://plausible.io/js/script.file-downloads.outbound-links.js"
          strategy="afterInteractive"
        />
        
        {/* Microsoft Clarity */}
        <Script 
          id="ms-clarity" 
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "rpq8g8m170");
            `
          }}
        />
        
        <TimerProvider>
          {children}
        </TimerProvider>
      </body>
    </html>
  );
}