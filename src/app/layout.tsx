import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: '链上红包系统',
  description: '基于区块链的去中心化红包分发系统',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}