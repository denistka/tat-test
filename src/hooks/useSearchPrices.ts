import { useState, useCallback, useRef, useEffect } from 'react';
import type { PricesMap, SearchStatus, SearchError } from '../types/search.js';
import { priceService } from '../services/priceService.js';
import { searchStore } from '../store/searchStore.js';

/**
 * Hook to manage price search polling state machine.
 * Logic layer: orchestrates initial request, polling delays, and retries.
 */
export const useSearchPrices = () => {
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [prices, setPrices] = useState<PricesMap | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use refs for non-rendered data (CTO & QA rule)
  const currentTokenRef = useRef<string | null>(null);
  const countryIDRef = useRef<string | null>(null);
  const retryCountRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const isMountedRef = useRef<boolean>(true);

  /**
   * Clears any active polling timers.
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Cancels the active search by stopping the timer and calling the service.
   */
  const cancelCurrentSearch = useCallback(async () => {
    if (currentTokenRef.current) {
      clearTimer();
      const tokenToCancel = currentTokenRef.current;
      currentTokenRef.current = null; // Mark as cancelled locally first
      await priceService.stopSearch(tokenToCancel);
    }
  }, [clearTimer]);

  /**
   * The core polling logic that checks for results after a delay.
   * Using a function declaration here to allow self-reference without lint errors.
   */
  async function pollForResults() {
    const activeToken = currentTokenRef.current;
    if (!activeToken || !isMountedRef.current) return;

    try {
      const results = await priceService.getResults(activeToken);
      
      // ST2 Guard: Check if this response is still relevant (race condition guard)
      if (activeToken !== currentTokenRef.current || !isMountedRef.current) return;

      if (Object.keys(results).length === 0) {
        setStatus('empty');
      } else {
        setPrices(results);
        setStatus('success');
        
        // Caching requirement from spec
        if (countryIDRef.current) {
          searchStore.setCache(countryIDRef.current, results);
        }
      }
    } catch (err) {
      const activeTokenOnCatch = currentTokenRef.current;
      if (activeToken !== activeTokenOnCatch || !isMountedRef.current) return;

      const searchError = err as SearchError;

      // Handle 425 Too Early: Scheduling next poll
      if (searchError.code === 425 && searchError.waitUntil) {
        const delay = Math.max(0, Date.parse(searchError.waitUntil) - Date.now());
        setStatus('polling');
        timerRef.current = window.setTimeout(pollForResults, delay);
        return;
      }

      // Retry logic for other errors
      if (retryCountRef.current < 2) {
        retryCountRef.current += 1;
        setStatus('polling');
        timerRef.current = window.setTimeout(pollForResults, 2000);
      } else {
        setError(searchError.message || 'Failed to fetch prices after retries');
        setStatus('error');
      }
    }
  }

  // Wrap pollForResults in useCallback if we need to expose it, but here it's internal.
  // We just need a stable search function to expose.

  /**
   * Initiates a new price search.
   */
  const search = useCallback(async (countryID: string) => {
    // ST3: If search is active, cancel it first
    if (currentTokenRef.current) {
      await cancelCurrentSearch();
    }

    // 0. Check cache first
    const cached = searchStore.getCache(countryID);
    if (cached) {
      setPrices(cached);
      setStatus('success');
      setError(null);
      return;
    }

    // 1. Reset state for new search
    clearTimer();
    setStatus('loading');
    setError(null);
    setPrices(null);
    currentTokenRef.current = null;
    countryIDRef.current = countryID;
    retryCountRef.current = 0;

    try {
      // 2. Start search and get token
      const { token, waitUntil } = await priceService.startSearch(countryID);
      
      if (!isMountedRef.current) return;
      currentTokenRef.current = token;

      // 3. Schedule first poll based on waitUntil
      const delay = Math.max(0, Date.parse(waitUntil) - Date.now());
      setStatus('polling');
      timerRef.current = window.setTimeout(pollForResults, delay);

    } catch (err) {
      if (!isMountedRef.current) return;
      const searchError = err as SearchError;
      setError(searchError.message || 'Could not start price search');
      setStatus('error');
    }
  }, [clearTimer]); // pollForResults is stable as a function declaration in this scope

  // Handle unmount cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearTimer();
    };
  }, [clearTimer]);

  return {
    status,
    prices,
    error,
    isSearching: status === 'loading' || status === 'polling',
    activeCountryID: countryIDRef.current,
    search
  };
};
