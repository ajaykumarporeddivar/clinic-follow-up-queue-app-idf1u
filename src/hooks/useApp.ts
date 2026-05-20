'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook for SSR-safe localStorage access.
 * The value is initially set to the `initial` argument and only reads from localStorage on the client-side after hydration.
 *
 * @template T The type of the value to store.
 * @param {string} key The key under which the value is stored in localStorage.
 * @param {T} initial The initial value to use if localStorage is not available or the key is not found.
 * @returns {[T, (v: T) => void]} A tuple containing the current value and a setter function.
 */
export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    // During SSR, localStorage is not available, so return the initial value.
    if (typeof window === 'undefined') {
      return initial;
    }
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initial;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initial;
    }
  });

  // Update localStorage whenever the value changes.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error writing localStorage key "${key}":`, error);
      }
    }
  }, [key, value]);

  return [value, setValue];
}

/**
 * Custom hook for filtering a list of items based on a search string and a status field.
 *
 * @template T The type of the items in the list, extending Record<string, unknown>.
 * @param {T[]} items The array of items to filter.
 * @param {(keyof T)[]} fields The keys of the fields to search within.
 * @returns {{ filtered: T[]; search: string; setSearch: (s: string) => void; status: string; setStatus: (s: string) => void }}
 * An object containing the filtered items, current search string, search setter, current status, and status setter.
 */
export function useFilter<T extends Record<string, unknown>>(
  items: T[],
  fields: (keyof T)[]
): { filtered: T[]; search: string; setSearch: (s: string) => void; status: string; setStatus: (s: string) => void } {
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const filtered = React.useMemo(() => {
    let result = items;
    const lowerCaseSearch = search.toLowerCase();

    // Apply search filter
    if (lowerCaseSearch) {
      result = result.filter((item) =>
        fields.some((field) =>
          String(item[field]).toLowerCase().includes(lowerCaseSearch)
        )
      );
    }

    // Apply status filter
    if (status && status !== 'all') {
      result = result.filter((item) => String(item.status).toLowerCase() === status.toLowerCase());
    }

    return result;
  }, [items, fields, search, status]);

  return { filtered, search, setSearch, status, setStatus };
}

/**
 * Custom hook for managing modal state.
 *
 * @template T The type of the item associated with the modal (optional).
 * @returns {{ isOpen: boolean; open: (item?: T) => void; close: () => void; activeItem: T | null }}
 * An object containing modal state and control functions.
 */
export function useModal<T = unknown>(): {
  isOpen: boolean;
  open: (item?: T) => void;
  close: () => void;
  activeItem: T | null;
} {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const open = useCallback((item?: T) => {
    setActiveItem(item || null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveItem(null); // Clear active item when closing
  }, []);

  return { isOpen, open, close, activeItem };
}

/**
 * Custom hook for displaying toast notifications.
 *
 * @returns {{ message: string; type: 'success' | 'error' | 'info'; visible: boolean; show: (msg: string, type?: 'success' | 'error' | 'info') => void }}
 * An object containing toast state and a function to show a toast.
 */
export function useDemoToast(): {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  show: (msg: string, type?: 'success' | 'error' | 'info') => void;
} {
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<'success' | 'error' | 'info'>('info');
  const [visible, setVisible] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback((msg: string, toastType: 'success' | 'error' | 'info' = 'info') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setMessage(msg);
    setType(toastType);
    setVisible(true);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setMessage('');
      setType('info');
      timerRef.current = null;
    }, 2500); // Auto-hide after 2.5 seconds
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { message, type, visible, show };
}