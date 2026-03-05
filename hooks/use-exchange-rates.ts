"use client"

import { useState, useEffect, useMemo } from "react"

export type SupportedCurrency =
  | "KRW"
  | "USD"
  | "EUR"
  | "JPY"
  | "GBP"
  | "CNY"
  | "AUD"
  | "CAD"
  | "CHF"
  | "HKD"

export const CURRENCIES: { code: SupportedCurrency; label: string; symbol: string }[] = [
  { code: "KRW", label: "원", symbol: "\u20A9" },
  { code: "USD", label: "달러", symbol: "$" },
  { code: "EUR", label: "유로", symbol: "\u20AC" },
  { code: "JPY", label: "엔", symbol: "\u00A5" },
  { code: "GBP", label: "파운드", symbol: "\u00A3" },
  { code: "CNY", label: "위안", symbol: "\u00A5" },
  { code: "AUD", label: "호주달러", symbol: "A$" },
  { code: "CAD", label: "캐나다달러", symbol: "C$" },
  { code: "CHF", label: "프랑", symbol: "Fr" },
  { code: "HKD", label: "홍콩달러", symbol: "HK$" },
]

/** Fallback rates: 1 foreign unit = X KRW (approximate) */
const FALLBACK_RATES: Record<SupportedCurrency, number> = {
  KRW: 1,
  USD: 1350,
  EUR: 1480,
  JPY: 9,
  GBP: 1720,
  CNY: 190,
  AUD: 880,
  CAD: 990,
  CHF: 1530,
  HKD: 173,
}

/**
 * open.er-api.com response shape (base=KRW):
 * { result: "success", base_code: "KRW", time_last_update_utc: "...",
 *   rates: { KRW: 1, USD: 0.00074, EUR: 0.00068, ... } }
 *
 * rates[X] = how much X you get for 1 KRW
 * So 1 USD = 1 / rates.USD KRW
 */
interface ErApiResponse {
  result: string
  base_code: string
  time_last_update_utc: string
  rates: Record<string, number>
}

interface UseExchangeRatesReturn {
  /** 1 foreign currency unit = X KRW */
  ratesPerKRW: Record<SupportedCurrency, number>
  /** The date the rates are based on */
  rateDate: string | null
  /** Whether rates are still loading */
  isLoading: boolean
  /** Error message if fetch failed */
  error: string | null
  /** Whether we're using fallback rates */
  isFallback: boolean
}

const PRIMARY_URL = "https://open.er-api.com/v6/latest/KRW"
const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(PRIMARY_URL)}`

function parseDate(utcString: string): string {
  try {
    const d = new Date(utcString)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

export function useExchangeRates(): UseExchangeRatesReturn {
  const [apiRates, setApiRates] = useState<Record<string, number> | null>(null)
  const [rateDate, setRateDate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function tryFetchDirect(): Promise<ErApiResponse> {
      const res = await fetch(PRIMARY_URL)
      if (!res.ok) throw new Error(`Direct API error: ${res.status}`)
      const data: ErApiResponse = await res.json()
      if (data.result !== "success") throw new Error("API returned non-success")
      return data
    }

    async function tryFetchProxy(): Promise<ErApiResponse> {
      const res = await fetch(PROXY_URL)
      if (!res.ok) throw new Error(`Proxy API error: ${res.status}`)
      const wrapper = await res.json()
      const data: ErApiResponse = JSON.parse(wrapper.contents)
      if (data.result !== "success") throw new Error("Proxy API returned non-success")
      return data
    }

    async function fetchRates() {
      setIsLoading(true)
      setError(null)
      setIsFallback(false)

      let data: ErApiResponse | null = null

      // Attempt 1: direct call
      try {
        data = await tryFetchDirect()
      } catch {
        // Attempt 2: proxy fallback
        try {
          data = await tryFetchProxy()
        } catch {
          // Both failed
        }
      }

      if (cancelled) return

      if (data && data.rates) {
        setApiRates(data.rates)
        setRateDate(parseDate(data.time_last_update_utc))
      } else {
        setError("환율 데이터를 불러오지 못했습니다")
        setIsFallback(true)
      }

      setIsLoading(false)
    }

    fetchRates()
    return () => { cancelled = true }
  }, [])

  /**
   * open.er-api with base=KRW gives: rates[USD] = 0.00074 (1 KRW = 0.00074 USD)
   * We need: 1 USD = X KRW => X = 1 / rates[USD]
   */
  const ratesPerKRW = useMemo<Record<SupportedCurrency, number>>(() => {
    if (!apiRates || isFallback) {
      return { ...FALLBACK_RATES }
    }

    const map = { ...FALLBACK_RATES } // start with fallback as defaults

    for (const currency of CURRENCIES) {
      if (currency.code === "KRW") {
        map.KRW = 1
        continue
      }

      const rateFromApi = apiRates[currency.code]
      if (rateFromApi && rateFromApi > 0) {
        // 1 KRW = rateFromApi units of foreign currency
        // So 1 foreign unit = 1 / rateFromApi KRW
        map[currency.code] = Math.round(1 / rateFromApi)
      }
      // If missing, the fallback default stays
    }

    return map
  }, [apiRates, isFallback])

  return { ratesPerKRW, rateDate, isLoading, error, isFallback }
}
