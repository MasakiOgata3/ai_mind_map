'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import MindMapCanvas from '@/components/MindMapCanvas'
import NoSSR from '@/components/NoSSR'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function Home() {
  const { 
    isLoading, 
    createMindMap, 
    updateCurrentMindMap, 
    getCurrentMindMap 
  } = useLocalStorage()
  
  const [isSaved, setIsSaved] = useState(true)
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  const currentMindMap = getCurrentMindMap()

  useEffect(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
    }
    
    const timeout = setTimeout(() => {
      setIsSaved(true)
    }, 3000)
    
    setAutoSaveTimeout(timeout)
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [currentMindMap])

  const handleCreateNew = () => {
    createMindMap()
  }

  const handleUpdateMindMap = (updater: (map: any) => any) => {
    setIsSaved(false)
    updateCurrentMindMap(updater)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">読み込み中...</div>
      </div>
    )
  }

  return (
    <NoSSR>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header 
          currentMindMap={currentMindMap}
          onCreateNew={handleCreateNew}
          isSaved={isSaved}
        />
        
        <main className="pt-20 h-screen">
          <MindMapCanvas 
            mindMapData={currentMindMap}
            onUpdateMindMap={handleUpdateMindMap}
          />
        </main>
      </div>
    </NoSSR>
  )
}
