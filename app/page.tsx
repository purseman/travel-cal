"use client"

import Script from "next/script"
import { useMemo, useState } from "react"
import { ExpenseCalculator } from "@/components/expense-calculator"
import { Home } from "lucide-react"
import Link from "next/link"

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
    <div className="relative min-h-screen bg-background">
      
      {/* 🏠 [최종 수정본] Link 대신 <a> 태그 사용 */}
<div className="fixed top-4 left-4 z-[100]">
  <a 
    href="https://www.heartbitcode.com" 
    className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition-all group active:scale-95"
    style={{ cursor: 'pointer' }}
    title="홈으로 돌아가기"
  >
    <Home className="w-6 h-6 text-gray-700 group-hover:text-blue-500" />
  </a>
</div>

      {/* 중복된 ExpenseCalculator를 하나로 합치고 상단 여백 부여 */}
      <div className="pt-6">
        <ExpenseCalculator
          onTotalChange={setTotalKRW}
          onShareLinesChange={setShareLines}
        />
      </div>

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
