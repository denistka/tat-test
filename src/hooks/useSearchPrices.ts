import { useState, useCallback, useRef, useEffect } from 'react'
import type { PricesMap, SearchStatus, SearchError } from '../types/search.js'
import { priceService } from '../services/priceService.js'
import { searchStore } from '../store/searchStore.js'

export const useSearchPrices = () => {
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [prices, setPrices] = useState<PricesMap | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentTokenRef = useRef<string | null>(null)
  const countryIDRef = useRef<string | null>(null)
  const retryCountRef = useRef<number>(0)
  const timerRef = useRef<number | null>(null)
  const isMountedRef = useRef<boolean>(true)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const performCancellation = useCallback(async () => {
    if (currentTokenRef.current) {
      clearTimer()
      const tokenToCancel = currentTokenRef.current
      currentTokenRef.current = null

      setStatus('cancelling')
      countryIDRef.current = null

      await priceService.stopSearch(tokenToCancel)

      if (currentTokenRef.current === null) {
        setStatus('idle')
      }
    } else {
      clearTimer()
      countryIDRef.current = null
      setStatus('idle')
    }
  }, [clearTimer])

  const cancel = useCallback(async () => {
    await performCancellation()
  }, [performCancellation])

  async function pollForResults() {
    const activeToken = currentTokenRef.current
    if (!activeToken || !isMountedRef.current) return

    try {
      const results = await priceService.getResults(activeToken)

      if (activeToken !== currentTokenRef.current || !isMountedRef.current) return

      if (Object.keys(results).length === 0) {
        setStatus('empty')
      } else {
        setPrices(results)
        setStatus('success')

        if (countryIDRef.current) {
          searchStore.setCache(countryIDRef.current, results)
        }
      }
    } catch (err) {
      const activeTokenOnCatch = currentTokenRef.current
      if (activeToken !== activeTokenOnCatch || !isMountedRef.current) return

      const searchError = err as SearchError

      if (searchError.code === 425 && searchError.waitUntil) {
        const delay = Math.max(
          0,
          Date.parse(searchError.waitUntil) - Date.now(),
        )
        setStatus('polling')
        timerRef.current = window.setTimeout(pollForResults, delay)
        return
      }

      if (retryCountRef.current < 2) {
        retryCountRef.current += 1
        setStatus('polling')
        timerRef.current = window.setTimeout(pollForResults, 2000)
      } else {
        setError(searchError.message || 'Failed to fetch prices after retries')
        setStatus('error')
      }
    }
  }

  const search = useCallback(async (countryID: string) => {
    if (currentTokenRef.current) {
      await performCancellation()
    }

    countryIDRef.current = countryID

    const cached = searchStore.getCache(countryID)
    if (cached) {
      setPrices(cached)
      setStatus('success')
      setError(null)
      return
    }

    clearTimer()
    setStatus('loading')
    setError(null)
    setPrices(null)
    retryCountRef.current = 0

    try {
      const { token, waitUntil } = await priceService.startSearch(countryID)

      if (!isMountedRef.current) return

      if (countryIDRef.current !== countryID) return

      currentTokenRef.current = token

      const delay = Math.max(0, Date.parse(waitUntil) - Date.now())
      setStatus('polling')
      timerRef.current = window.setTimeout(pollForResults, delay)
    } catch (err) {
      if (!isMountedRef.current || countryIDRef.current !== countryID) return
      const searchError = err as SearchError
      setError(searchError.message || 'Could not start price search')
      setStatus('error')
    }
  }, [performCancellation, clearTimer])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      clearTimer()
    }
  }, [clearTimer])

  return {
    status,
    prices,
    error,
    isSearching: status === 'loading' || status === 'polling' || status === 'cancelling',
    activeCountryID: countryIDRef.current,
    search,
    cancel,
  }
}
