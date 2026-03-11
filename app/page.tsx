"use client"

import Script from "next/script"
import { useMemo, useState } from "react"
import { ExpenseCalculator } from "@/components/expense-calculator"
import { Home } from "lucide-react" // 1. 아이콘 추가
import Link from "next/link"      // 2. 링크 추가

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void
      isInitialized: () => boolean
      Share: { sendDefault: (options: object) => void }
    }
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
    if (typeof window === "undefined") return
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("15a34b3a37ab82f0942fa7e1c6f10429")
    }

    const baseUrl = "https://www.heartbitcode.com/calc"
    const encodedData = encodeURIComponent(shareLines.join(","))
    const shareUrl = `${baseUrl}?data=${encodedData}`

    window.Kakao?.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "💰 스마트 맨의 여행 가계부 [상세보기 클릭] 💰",
        description: shareDetailText || `총합계: ${formattedTotalKRW}원`,
        imageUrl: "https://cdn.pixabay.com/photo/2016/03/31/19/58/money-1295410_1280.png",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    })
  }

  return (
    // relative를 주어 홈 버튼의 기준점이 되게 합니다.
    <div className="relative min-h-screen bg-background">
      
      {/* 🏠 [여기에 추가] 홈 버튼: 다른 요소보다 위에 보이도록 z-50 설정 */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          href="https://www.heartbitcode.com" 
          className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200 hover:bg-gray-100 transition-all group"
          title="홈으로 돌아가기"
        >
          <Home className="w-5 h-5 text-gray-700 group-hover:text-blue-500" />
        </Link>
      </div>

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

      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
        onLoad={() => {
          if (typeof window !== "undefined" && window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init("15a34b3a37ab82f0942fa7e1c6f10429")
          }
        }}
      />
    </div>
  )
}
