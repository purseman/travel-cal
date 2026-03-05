"use client"

import { ExternalLink, Building2, Plane, Ticket } from "lucide-react"

const partners = [
  {
    name: "아고다 최저가 찾기",
    description: "전 세계 호텔 최저가 비교",
    href: "https://www.agoda.com",
    icon: Building2,
    color: "bg-[#5335B8] text-white",
    cardBg: "bg-[#F4EFFF] dark:bg-[#2D1B4E] border-2 border-[#5335B8]",
    badge: "최저가 보장",
  },
  {
    name: "스카이스캐너 항공권",
    description: "항공권 가격 한눈에 비교",
    href: "https://www.skyscanner.co.kr",
    icon: Plane,
    color: "bg-[#0770E3] text-white",
    cardBg: "bg-[#E3EEFA] dark:bg-[#0D2847] border-2 border-border",
  },
  {
    name: "클룩 액티비티",
    description: "인기 투어 & 티켓 예약",
    href: "https://www.klook.com",
    icon: Ticket,
    color: "bg-[#FF5722] text-white",
    cardBg: "bg-[#FFF0E8] dark:bg-[#4A2518] border-2 border-border",
  },
]

export function PartnerSidebar() {
  return (
    <aside className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-border bg-card p-5">
        <h2 className="mb-1 text-base font-bold text-foreground">
          여행 준비 한번에
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          최저가 호텔, 항공권, 액티비티를 비교하세요
        </p>
        <div className="flex flex-col gap-3">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex items-center gap-3 rounded-xl p-5 transition-all hover:shadow-md ${partner.cardBg}`}
            >
              {"badge" in partner && partner.badge && (
                <span className="absolute right-3 top-3 rounded-md bg-[#5335B8] px-2 py-0.5 text-[10px] font-medium text-white">
                  {partner.badge}
                </span>
              )}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${partner.color}`}
              >
                <partner.icon className="h-5 w-5" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {partner.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {partner.description}
                </span>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-accent/50 p-5">
        <h3 className="mb-2 text-sm font-bold text-foreground">
          여행 팁
        </h3>
        <ul className="flex flex-col gap-2 text-xs leading-relaxed text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            항공권은 보통 출발 6~8주 전에 예약하면 저렴합니다.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            숙소는 조기 예약 시 무료 취소가 가능한 곳을 선택하는 것이 현명합니다.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            현지 교통카드를 미리 준비하면 교통비를 절약할 수 있어요.
          </li>
        </ul>
      </div>
    </aside>
  )
}
