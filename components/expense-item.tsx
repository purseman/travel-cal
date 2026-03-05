"use client"

import { Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CURRENCIES, type SupportedCurrency } from "@/hooks/use-exchange-rates"

interface ExpenseItemProps {
  id: string
  label: string
  icon: React.ReactNode
  amount: number
  currency: SupportedCurrency
  convertedKRW: number
  isCustom: boolean
  onAmountChange: (id: string, amount: number) => void
  onCurrencyChange: (id: string, currency: SupportedCurrency) => void
  onRemove: (id: string) => void
}

export function ExpenseItem({
  id,
  label,
  icon,
  amount,
  currency,
  convertedKRW,
  isCustom,
  onAmountChange,
  onCurrencyChange,
  onRemove,
}: ExpenseItemProps) {
  const currencyInfo = CURRENCIES.find((c) => c.code === currency)
  const showConversion = currency !== "KRW" && amount > 0

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <label
          htmlFor={`expense-${id}`}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          {/* Currency selector */}
          <Select
            value={currency}
            onValueChange={(val) => onCurrencyChange(id, val as SupportedCurrency)}
          >
            <SelectTrigger
              className="h-9 w-[88px] shrink-0 border-0 bg-muted/50 text-xs font-medium text-foreground focus-visible:ring-1 focus-visible:ring-primary/40"
              aria-label={`${label} 통화 선택`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono text-xs">{c.code}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Amount input */}
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              {currencyInfo?.symbol ?? "\u20A9"}
            </span>
            <Input
              id={`expense-${id}`}
              type="number"
              min={0}
              placeholder="0"
              value={amount === 0 ? "" : amount}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : parseFloat(e.target.value)
                onAmountChange(id, isNaN(val) ? 0 : val)
              }}
              className="h-9 border-0 bg-muted/50 pl-8 text-right text-base font-semibold tabular-nums text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/40"
            />
          </div>
        </div>

        {/* Converted KRW hint */}
        {showConversion && (
          <p className="text-xs text-muted-foreground">
            {"\u2248 \u20A9"}
            {new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(convertedKRW)}
          </p>
        )}
      </div>

      {isCustom && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(id)}
          className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          aria-label={`${label} 삭제`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
