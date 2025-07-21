import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 初期値を取得する関数
  const getStoredValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }

  const [storedValue, setStoredValue] = useState<T>(getStoredValue)

  // 値を設定する関数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  // マウント後に再度チェック（SSR対応）
  useEffect(() => {
    setStoredValue(getStoredValue())
  }, [key])

  return [storedValue, setValue] as const
}