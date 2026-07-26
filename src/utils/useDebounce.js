/**
 * Custom React hook for debouncing values
 *
 * Delays updating the debounced value until after the specified delay
 * has elapsed since the last change. Useful for reducing expensive operations
 * like localStorage writes.
 *
 * @module utils/useDebounce
 */

import { useState, useEffect } from 'react';

/**
 * Debounce a value
 *
 * Returns a debounced version of the value that only updates after the
 * specified delay has passed without the value changing.
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {any} Debounced value
 *
 * @example
 * function SearchComponent() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 *   useEffect(() => {
 *     // This only runs 500ms after user stops typing
 *     performSearch(debouncedSearchTerm);
 *   }, [debouncedSearchTerm]);
 *
 *   return <input onChange={(e) => setSearchTerm(e.target.value)} />;
 * }
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
