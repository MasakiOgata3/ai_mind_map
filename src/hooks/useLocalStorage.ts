import { useState, useEffect, useCallback } from 'react'
import { StorageData, MindMapData, ThemeColor } from '@/types/mindmap'

const STORAGE_KEY = 'aimindmap_data'
const STORAGE_VERSION = '1.0'

const defaultStorage: StorageData = {
  version: STORAGE_VERSION,
  mindmaps: [],
  currentMapId: '',
  preferences: {
    defaultTheme: 'ocean',
    autoSave: true
  }
}

export function useLocalStorage() {
  const [storageData, setStorageData] = useState<StorageData>(defaultStorage)
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Convert date strings back to Date objects
        if (parsed.mindmaps) {
          parsed.mindmaps = parsed.mindmaps.map((map: any) => ({
            ...map,
            createdAt: new Date(map.createdAt),
            updatedAt: new Date(map.updatedAt),
            nodes: map.nodes.map((node: any) => ({
              ...node,
              createdAt: new Date(node.createdAt),
              updatedAt: new Date(node.updatedAt)
            }))
          }))
        }
        setStorageData(parsed)
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save data to localStorage
  const saveToStorage = useCallback((data: StorageData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setStorageData(data)
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }, [])

  // Create a new mindmap
  const createMindMap = useCallback((title: string = '新しいマインドマップ') => {
    const newMap: MindMapData = {
      id: Date.now().toString(),
      title,
      nodes: [
        {
          id: 'root',
          content: title,
          parentId: null,
          color: 'ocean',
          position: { x: 400, y: 300 },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      theme: 'ocean',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedData = {
      ...storageData,
      mindmaps: [...storageData.mindmaps, newMap],
      currentMapId: newMap.id
    }

    saveToStorage(updatedData)
    return newMap
  }, [storageData, saveToStorage])

  // Update current mindmap
  const updateCurrentMindMap = useCallback((updater: (map: MindMapData) => MindMapData) => {
    const currentMap = storageData.mindmaps.find(m => m.id === storageData.currentMapId)
    if (!currentMap) return

    const updatedMap = updater(currentMap)
    updatedMap.updatedAt = new Date()

    const updatedData = {
      ...storageData,
      mindmaps: storageData.mindmaps.map(m => 
        m.id === storageData.currentMapId ? updatedMap : m
      )
    }

    saveToStorage(updatedData)
  }, [storageData, saveToStorage])

  // Get current mindmap
  const getCurrentMindMap = useCallback(() => {
    return storageData.mindmaps.find(m => m.id === storageData.currentMapId)
  }, [storageData])

  // Update preferences
  const updatePreferences = useCallback((preferences: Partial<StorageData['preferences']>) => {
    const updatedData = {
      ...storageData,
      preferences: {
        ...storageData.preferences,
        ...preferences
      }
    }
    saveToStorage(updatedData)
  }, [storageData, saveToStorage])

  return {
    storageData,
    isLoading,
    createMindMap,
    updateCurrentMindMap,
    getCurrentMindMap,
    updatePreferences
  }
}