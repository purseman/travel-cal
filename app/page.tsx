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
    // ✅ 명시적인 이동 버튼 추가
    buttons: [
      {
        title: "계산 내역 상세보기",
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
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
return (
  <div className="relative min-h-screen bg-background">
    {/* ... 기존 홈 버튼, 계산기, 공유 버튼 영역 ... */}

    {/* 🦶 Footer: 여행 경비 계산기의 색상 앤 매너를 완벽 매칭 */}
    <footer className="w-full py-10 mt-16 border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-5">
        
        {/* 1. 소개 문구: 가독성이 좋은 보조 텍스트 색상 사용 */}
        <div className="text-center text-sm text-gray-500 font-medium">
          이 웹앱은 전 세계 여행 정보 전문가, <span className="text-gray-900 font-semibold">하우월드(www.howtotheworld.com)</span>에서 제작했습니다.
        </div>
        
        {/* 2. 하우월드 로고: 클릭 시 투명도 호버 효과 추가 */}
        <div>
          <a href="https://www.howtotheworld.com" target="_blank" rel="noopener noreferrer" className="inline-block transition-opacity hover:opacity-80">
            {/* 로고 이미지는 public 폴더에 배치하는 것을 추천합니다. 예: public/logos/howtotheworld.png */}
            <img 
              src="/logos/howtotheworld.png" 
              alt="하우월드 로고" 
              className="h-14 w-auto" // 이미지 높이를 살짝 키워 시인성을 높였습니다.
            />
          </a>
        </div>
      </div>
    </footer>
  </div>
)
</div>
)
}
