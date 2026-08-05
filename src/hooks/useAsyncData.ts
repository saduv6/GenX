// ============================================================
// Custom hook for async data fetching with loading/error states
// Fixed: uses ref to prevent infinite re-fetch loops
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAsyncDataOptions {
  immediate?: boolean;
}

export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  options: UseAsyncDataOptions = {}
) {
  const { immediate = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to store fetchFn so it doesn't trigger re-renders
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFnRef.current();
      setData(result);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(msg);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies — uses ref internally

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return { data, loading, error, execute, setData };
}
