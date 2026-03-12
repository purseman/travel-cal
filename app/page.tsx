"use client"

import Script from "next/script"
import { useMemo, useState } from "react"
import { ExpenseCalculator } from "@/components/expense-calculator"
import { Home } from "lucide-react"
// 1. 만약 아래 임포트에서 에러가 난다면 이미지를 'public' 폴더로 옮기세요!
import howworldLogo from "@/assets/howworld-logo.png" 

declare global {
  interface Window {
    Kakao?: any; // 타입을 any로 느슨하게 잡아 빌드 에러를 방지합니다.
  }
}

export default function Page() {
  const [totalKRW, setTotalKRW] = useState(0)
  const [shareLines, setShareLines] = useState<string[]>([])

  const formattedTotalKRW = useMemo(() => {
    const rounded = Math.round(totalKRW)
    return new Intl.NumberFormat("ko-KR").format(rounded)
  }, [totalKRW])

  const shareDetailText = useMemo(
    () => (shareLines.length > 0 ? `[내역] ${shareLines.join(", ")}` : ""),
    [shareLines]
  )

  const shareToKakao = () => {
    if (typeof window === "undefined" || !window.Kakao) return
    
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("15a34b3a37ab82f0942fa7e1c6f10429")
    }

    const baseUrl = "https://www.heartbitcode.com/calc"
    const encodedData = encodeURIComponent(shareLines.join(","))
    const shareUrl = `${baseUrl}?data=${encodedData}`

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "💰 스마트 맨의 여행 가계부 [상세보기 클릭] 💰",
        description: shareDetailText || `총합계: ${formattedTotalKRW}원`,
        imageUrl: "https://cdn.pixabay.com/photo/2016/03/31/19/58/money-1295410_1280.png",
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [
        {
          title: "계산 내역 상세보기",
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
      ],
    })
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      {/* 🏠 홈 버튼 */}
      <div className="fixed top-4 left-4 z-[100]">
        <a 
          href="https://www.heartbitcode.com" 
          className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition-all group active:scale-95"
        >
          <Home className="w-6 h-6 text-gray-700 group-hover:text-blue-500" />
        </a>
      </div>

      <main className="flex-grow pt-6">
        <ExpenseCalculator
          onTotalChange={setTotalKRW}
          onShareLinesChange={setShareLines}
        />

        <div className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6">
          <div className="flex flex-col items-center gap-3 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              여행 경비 계산 결과를 친구에게 공유해 보세요
            </p>
            <button
              type="button"
              onClick={shareToKakao}
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold text-[#191919] shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#FEE500" }}
            >
              카카오톡으로 공유하기 (총 {formattedTotalKRW}원)
            </button>
          </div>
        </div>
      </main>

      {/* 🚀 하우월드 커스텀 푸터 */}
      <footer className="w-full py-10 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-5">
          <div className="text-center text-sm text-gray-500 font-medium leading-relaxed">
            이 웹앱은 전 세계 여행 정보 전문가, <br className="md:hidden" />
            <span className="text-gray-900 font-semibold ml-1 text-base">하우월드(www.howtotheworld.com)</span>에서 제작했습니다.
          </div>
          <div className="mt-2">
            <a 
              href="https://www.howtotheworld.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block transition-transform hover:scale-105 active:scale-95"
            >
              {/* 이미지 객체 대응 */}
              <img 
                src={typeof howworldLogo === 'string' ? howworldLogo : (howworldLogo as any).src} 
                alt="하우월드 로고" 
                className="h-12 w-auto object-contain" 
              />
            </a>
          </div>
        </div>
      </footer>

      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init("15a34b3a37ab82f0942fa7e1c6f10429")
          }
        }}
      />
    </div>
  )
}
