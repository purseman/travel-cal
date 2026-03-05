"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import {
  Building2,
  Plane,
  Utensils,
  Bus,
  Ticket,
  ShieldCheck,
  Wifi,
  Tag,
  AlertCircle,
} from "lucide-react"
import { ExpenseItem } from "@/components/expense-item"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { TotalBanner } from "@/components/total-banner"
import { PartnerSidebar } from "@/components/partner-sidebar"
import {
  useExchangeRates,
  type SupportedCurrency,
} from "@/hooks/use-exchange-rates"

interface ExpenseEntry {
  id: string
  label: string
  icon: string
  amount: number
  currency: SupportedCurrency
  isCustom: boolean
}

const iconMap: Record<string, React.ReactNode> = {
  hotel: <Building2 className="h-5 w-5" />,
  flight: <Plane className="h-5 w-5" />,
  food: <Utensils className="h-5 w-5" />,
  transport: <Bus className="h-5 w-5" />,
  activity: <Ticket className="h-5 w-5" />,
  insurance: <ShieldCheck className="h-5 w-5" />,
  wifi: <Wifi className="h-5 w-5" />,
  custom: <Tag className="h-5 w-5" />,
}

const defaultExpenses: ExpenseEntry[] = [
  { id: "hotel", label: "숙박비", icon: "hotel", amount: 0, currency: "KRW", isCustom: false },
  { id: "flight", label: "항공권", icon: "flight", amount: 0, currency: "KRW", isCustom: false },
  { id: "food", label: "식비", icon: "food", amount: 0, currency: "KRW", isCustom: false },
  { id: "transport", label: "교통비", icon: "transport", amount: 0, currency: "KRW", isCustom: false },
  { id: "activity", label: "관광/액티비티", icon: "activity", amount: 0, currency: "KRW", isCustom: false },
  { id: "insurance", label: "여행자 보험", icon: "insurance", amount: 0, currency: "KRW", isCustom: false },
  { id: "wifi", label: "와이파이/유심", icon: "wifi", amount: 0, currency: "KRW", isCustom: false },
]

export function ExpenseCalculator({
  onTotalChange,
  onShareLinesChange,
}: {
  onTotalChange?: (totalKRW: number) => void
  onShareLinesChange?: (lines: string[]) => void
}) {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(defaultExpenses)
  const { ratesPerKRW, rateDate, isLoading: isLoadingRates, error: rateError, isFallback } = useExchangeRates()

  const handleAmountChange = useCallback((id: string, amount: number) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, amount } : e))
    )
  }, [])

  const handleCurrencyChange = useCallback((id: string, currency: SupportedCurrency) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, currency } : e))
    )
  }, [])

  const handleRemove = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const handleAdd = useCallback((label: string) => {
    const newEntry: ExpenseEntry = {
      id: `custom-${Date.now()}`,
      label,
      icon: "custom",
      amount: 0,
      currency: "KRW",
      isCustom: true,
    }
    setExpenses((prev) => [...prev, newEntry])
  }, [])

  // Convert each expense to KRW, then sum
  const convertedAmounts = useMemo(() => {
    return expenses.map((e) => {
      if (e.currency === "KRW") return e.amount
      const rate = ratesPerKRW[e.currency]
      return rate > 0 ? e.amount * rate : 0
    })
  }, [expenses, ratesPerKRW])

  const total = useMemo(
    () => convertedAmounts.reduce((sum, val) => sum + val, 0),
    [convertedAmounts]
  )

  useEffect(() => {
    onTotalChange?.(total)
  }, [total, onTotalChange])

  useEffect(() => {
    if (!onShareLinesChange) return

    const formatter = new Intl.NumberFormat("ko-KR")
    const lines = expenses
      .map((e, index) => ({
        label: e.label,
        amountKRW: convertedAmounts[index],
      }))
      .filter((item) => item.amountKRW > 0)
      .map(
        (item) =>
          `${item.label}: ${formatter.format(Math.round(item.amountKRW))}원`
      )

    onShareLinesChange(lines)
  }, [expenses, convertedAmounts, onShareLinesChange])

  const activeCount = useMemo(
    () => expenses.filter((e) => e.amount > 0).length,
    [expenses]
  )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 lg:py-10">
      {/* Header */}
      <header className="mb-8 text-center md:text-left">
        <div className="flex items-center justify-center gap-3 md:justify-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Plane className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            여행 경비 계산기
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          여행 경비를 카테고리별로 입력하면 실시간으로 총 비용을 계산해드립니다.
        </p>

        {/* Rate status badges */}
        {isLoadingRates && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            <span className="text-xs text-muted-foreground">
              최신 환율 동기화 중...
            </span>
          </div>
        )}
        {!isLoadingRates && rateDate && !rateError && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">
              환율 기준 날짜: {rateDate}
            </span>
          </div>
        )}
        {!isLoadingRates && rateError && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/5 px-3 py-1">
            <AlertCircle className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs text-destructive">
              환율 로딩 실패 - 예비 환율 적용 중
            </span>
          </div>
        )}
      </header>

      {/* Main layout: expenses + sidebar */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left: expense list */}
        <main className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">경비 항목</h2>
            <span className="text-xs text-muted-foreground">
              {expenses.length}개 항목
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {expenses.map((expense, index) => (
              <ExpenseItem
                key={expense.id}
                id={expense.id}
                label={expense.label}
                icon={iconMap[expense.icon] ?? iconMap.custom}
                amount={expense.amount}
                currency={expense.currency}
                convertedKRW={convertedAmounts[index]}
                isCustom={expense.isCustom}
                onAmountChange={handleAmountChange}
                onCurrencyChange={handleCurrencyChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <AddExpenseDialog onAdd={handleAdd} />

          {/* Total banner - sticky at bottom on mobile */}
          <div className="sticky bottom-4 z-10 mt-2">
            <TotalBanner
              total={total}
              itemCount={activeCount}
              rateDate={rateDate}
              isLoadingRates={isLoadingRates}
              isFallback={isFallback}
            />
          </div>
        </main>

        {/* Right: partner sidebar */}
        <div className="w-full shrink-0 lg:w-72 xl:w-80">
          <div className="lg:sticky lg:top-6">
            <PartnerSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
