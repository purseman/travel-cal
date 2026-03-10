import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

// --- SEO 최적화 Metadata 시작 ---
export const metadata: Metadata = {
  title: '여행 경비 계산기 | 일본·베트남 해외여행 예산 및 더치페이 관리',
  description: '일본, 베트남 등 해외여행 경비를 1초 만에 계산하세요. 인원별 더치페이 계산과 카카오톡 공유 기능으로 여행 예산 관리가 쉬워집니다.',
  keywords: ['여행 경비 계산기', '해외여행 예산', '일본여행 경비', '베트남여행 예산', '더치페이 계산기', '여행 가계부'],
  generator: 'v0.app',
  
  // 캐노니컬 URL (중복 콘텐츠 방지)
  alternates: {
    canonical: 'https://www.heartbitcode.com/calc',
  },

  // SNS 공유 설정 (OpenGraph)
  openGraph: {
    title: '여행 경비 계산기 - 스마트한 해외여행 예산 관리',
    description: '더치페이부터 카카오톡 공유까지, 여행 경비 계산은 이거 하나면 끝!',
    url: 'https://www.heartbitcode.com/calc',
    siteName: 'Heartbit CODE',
    images: [
      {
        url: 'https://www.heartbitcode.com/images/travel-calc-og.webp', // 절대 경로 권장
        width: 1200,
        height: 630,
        alt: '여행 경비 계산기 서비스 화면',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },

  // 아이콘 설정
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}
// --- SEO 최적화 Metadata 끝 ---

export const viewport: Viewport = {
  themeColor: '#5BA4D9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${_notoSansKr.variable} ${_inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
