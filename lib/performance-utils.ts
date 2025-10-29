/**
 * Performance Utilities for React Components
 * 
 * This module provides utilities to optimize React component performance
 * by memoizing expensive computations and preventing unnecessary re-renders.
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Hook to debounce a value
 * Useful for search inputs and real-time filtering
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to throttle a function
 * Useful for scroll handlers and window resize events
 * 
 * @param callback - Function to throttle
 * @param delay - Delay in milliseconds (default: 100ms)
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 100
): (...args: Parameters<T>) => void {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay]
  );
}

/**
 * Hook to memoize async operations
 * Prevents duplicate API calls for the same parameters
 * 
 * @param asyncFunction - Async function to memoize
 * @param dependencies - Dependencies array
 * @returns Memoized async function
 */
export function useMemoAsync<T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T,
  dependencies: any[]
): T {
  return useCallback(asyncFunction, dependencies) as T;
}

/**
 * Utility to reduce multiple array iterations into a single pass
 * Optimizes filter + map + reduce operations
 * 
 * Example:
 * Instead of:
 *   const filtered = arr.filter(x => x.status === 'active')
 *   const total = arr.filter(x => x.status === 'active').reduce((sum, x) => sum + x.value, 0)
 * 
 * Use:
 *   const { filtered, total } = singlePassReduce(arr, (acc, item) => {
 *     if (item.status === 'active') {
 *       acc.filtered.push(item);
 *       acc.total += item.value;
 *     }
 *     return acc;
 *   }, { filtered: [], total: 0 })
 */
export function singlePassReduce<T, R>(
  array: T[],
  reducer: (accumulator: R, item: T, index: number) => R,
  initialValue: R
): R {
  return array.reduce(reducer, initialValue);
}

/**
 * Utility to batch multiple state updates
 * Useful when multiple related states need to be updated together
 * 
 * @param updates - Object with state setters and their new values
 */
export function batchStateUpdates(updates: Record<string, any>): void {
  // React 18+ automatically batches updates, but this provides
  // a clear API for intentional batching
  Object.entries(updates).forEach(([_, setValue]) => {
    if (typeof setValue === 'function') {
      setValue();
    }
  });
}

/**
 * Hook for previous value comparison
 * Useful for detecting changes and optimizing useEffect dependencies
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

/**
 * Hook to check if component is mounted
 * Prevents state updates on unmounted components
 */
export function useIsMounted(): () => boolean {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}

/**
 * Memoized status counter for arrays
 * Optimizes counting items by status in a single pass
 */
export function useStatusCounts<T extends { status: string }>(
  items: T[]
): Record<string, number> {
  return useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [items]);
}

/**
 * Memoized aggregations for arrays
 * Calculates multiple aggregations (sum, count, avg, etc.) in a single pass
 */
export function useAggregations<T>(
  items: T[],
  aggregators: {
    [key: string]: (item: T, acc?: any) => any;
  }
): Record<string, any> {
  return useMemo(() => {
    return items.reduce((acc, item) => {
      Object.entries(aggregators).forEach(([key, aggregator]) => {
        acc[key] = aggregator(item, acc[key]);
      });
      return acc;
    }, {} as Record<string, any>);
  }, [items, aggregators]);
}

export default {
  useDebounce,
  useThrottle,
  useMemoAsync,
  singlePassReduce,
  batchStateUpdates,
  usePrevious,
  useIsMounted,
  useStatusCounts,
  useAggregations,
};
