
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { JobProvider } from '@/context/job-context';
import { AuthProvider } from '@/context/auth-context';
import Script from 'next/script';

export const metadata: Metadata = {
  title: '패널커넥트(PanelConnect) - 좌담회 알바, 패널, 테스터 모집',
  description: '패널커넥트(PanelConnect)에서 최신 좌담회알바, 소비자 패널, 제품 테스터 등 다양한 리서치 참여 기회를 찾아보세요.',
  openGraph: {
    title: '수다 떨면서 돈 버는 알바 - 패널커넥트',
    description: '패널커넥트(PanelConnect)에서 최신 좌담회, 설문조사, 제품 테스터 등 다양한 리서치 참여 기회를 찾아보세요.',
    url: 'https://albaconnect.co.kr',
    images: [
      {
        url: 'https://placehold.co/1200x630/E2E8F0/1E293B.png?text=PanelConnect',
        width: 1200,
        height: 630,
        alt: '패널커넥트 로고',
      },
    ],
    type: 'website',
    siteName: '패널커넥트',
  },
   twitter: {
    card: 'summary_large_image',
    title: '수다 떨면서 돈 버는 알바 - 패널커넥트',
    description: '패널커넥트(PanelConnect)에서 최신 좌담회, 설문조사, 제품 테스터 등 다양한 리서치 참여 기회를 찾아보세요.',
    images: ['https://placehold.co/1200x630/E2E8F0/1E293B.png?text=PanelConnect'],
  },
};

export const viewport: Viewport = {
  themeColor: 'hsl(var(--background))',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="PanelConnect RSS Feed" href="/jobs/feed.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-4ZDSRZTRT1"></Script>
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4ZDSRZTRT1');
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
            <JobProvider>
              {children}
            </JobProvider>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
