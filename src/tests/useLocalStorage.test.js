import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ── helpers ────────────────────────────────────────────────
const KEY = 'test_key';

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
});

describe('useLocalStorage', () => {
  it('returns the initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('returns the stored value when localStorage already has a value', () => {
    localStorage.setItem(KEY, JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage(KEY, 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('updates state and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 0));
    act(() => { result.current[1](42); });
    expect(result.current[0]).toBe(42);
    expect(JSON.parse(localStorage.getItem(KEY))).toBe(42);
  });

  it('supports functional updater like useState', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 10));
    act(() => { result.current[1](prev => prev + 5); });
    expect(result.current[0]).toBe(15);
  });

  it('removes value and resets to initialValue when removeValue is called', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'init'));
    act(() => { result.current[1]('changed'); });
    act(() => { result.current[2](); });
    expect(result.current[0]).toBe('init');
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('handles corrupt JSON in localStorage gracefully', () => {
    localStorage.setItem(KEY, 'not-valid-json{{{');
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { result } = renderHook(() => useLocalStorage(KEY, 'fallback'));
    expect(result.current[0]).toBe('fallback');
    consoleSpy.mockRestore();
  });

  it('works with array initial values', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, []));
    act(() => { result.current[1](prev => [...prev, { id: 1 }]); });
    expect(result.current[0]).toHaveLength(1);
    expect(result.current[0][0].id).toBe(1);
  });

  it('syncs across tabs via storage event', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'original'));
    act(() => {
      const event = new StorageEvent('storage', {
        key:      KEY,
        newValue: JSON.stringify('from-other-tab'),
        oldValue: JSON.stringify('original'),
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
    });
    expect(result.current[0]).toBe('from-other-tab');
  });

  it('ignores storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'original'));
    act(() => {
      const event = new StorageEvent('storage', {
        key:      'different_key',
        newValue: JSON.stringify('irrelevant'),
        storageArea: localStorage,
      });
      window.dispatchEvent(event);
    });
    expect(result.current[0]).toBe('original');
  });
});
