"use client"

import Script from "next/script"
import { useMemo, useState, useEffect } from "react"
import { ExpenseCalculator } from "@/components/expense-calculator"
import { Home } from "lucide-react"

export default function Page() {
  const [totalKRW, setTotalKRW] = useState(0)
  const [shareLines, setShareLines] = useState<string[]>([])
  const [isKakaoReady, setIsKakaoReady] = useState(false)

  const formattedTotalKRW = useMemo(() => {
    const rounded = Math.round(totalKRW)
    return new Intl.NumberFormat("ko-KR").format(rounded)
  }, [totalKRW])

  const shareDetailText = useMemo(
    () => (shareLines.length > 0 ? `[내역] ${shareLines.join(", ")}` : ""),
    [shareLines]
  )

  // 💡 카카오 초기화 함수를 별도로 분리
  const initKakao = () => {
    if (typeof window !== "undefined" && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("15a34b3a37ab82f0942fa7e1c6f10429")
      setIsKakaoReady(true)
    }
  }

  const shareToKakao = () => {
    if (!window.Kakao || !window.Kakao.Share) {
      alert("카카오톡 공유 기능을 불러오는 중입니다. 잠시만 기다려주세요.")
      return
    }

    const shareUrl = "https://www.heartbitcode.com/calc"

    // 💡 .sendDefault 대신 .createDefaultButton을 쓰지 않고 바로 실행하는 .sendDefault가 맞지만,
    // 혹시 모르니 버튼 배열을 '확실하게' 포함합니다.
    try {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "💰 스마트 맨의 여행 가계부 [상세보기 클릭] 💰",
          description: shareDetailText || `총합계: ${formattedTotalKRW}원`,
          imageUrl: "https://www.heartbitcode.com/images/travel-calc-og.webp",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: "계산 내역 확인하기",
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      })
    } catch (error) {
      console.error("Kakao Share Error:", error)
      alert("공유 중 오류가 발생했습니다. 콘솔 창을 확인해주세요.")
    }
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* 1. 카카오 SDK 스크립트를 전략적으로 배치 (strategy="afterInteractive") */}
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
        strategy="afterInteractive"
        onLoad={initKakao}
      />

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
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold text-[#191919] shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#FEE500" }}
          >
            카카오톡으로 공유하기 (총 {formattedTotalKRW}원)
          </button>
        </div>
      </div>
    </div>
  )
}
