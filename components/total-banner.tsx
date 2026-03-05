"use client"

import { Calculator, RefreshCw } from "lucide-react"

interface TotalBannerProps {
  total: number
  itemCount: number
  rateDate: string | null
  isLoadingRates: boolean
  isFallback?: boolean
}

export function TotalBanner({ total, itemCount, rateDate, isLoadingRates, isFallback }: TotalBannerProps) {
  const formatted = new Intl.NumberFormat("ko-KR").format(Math.round(total))

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary p-6 text-primary-foreground shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary-foreground/80">
              {itemCount}개 항목 합산
            </p>
            <p className="text-sm text-primary-foreground/60">실시간 총 경비</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums tracking-tight md:text-4xl">
            {"\u20A9"}{formatted}
          </p>
          <p className="mt-0.5 text-xs font-medium text-primary-foreground/60">KRW</p>
        </div>
      </div>
      {/* Rate date info */}
      {(rateDate || isLoadingRates || isFallback) && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-primary-foreground/10 pt-3">
          <RefreshCw className={`h-3 w-3 text-primary-foreground/50 ${isLoadingRates ? "animate-spin" : ""}`} />
          <span className="text-xs text-primary-foreground/50">
            {isLoadingRates
              ? "최신 환율 동기화 중..."
              : isFallback
                ? "예비 환율 적용 중 (근사치)"
                : `기준 날짜: ${rateDate}`}
          </span>
        </div>
      )}
    </div>
  )
}
