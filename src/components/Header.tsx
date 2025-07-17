'use client'

import { useState } from 'react'
import { Plus, Brain, Save, Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MindMapData } from '@/types/mindmap'

interface HeaderProps {
  currentMindMap: MindMapData | null
  onCreateNew: () => void
  isSaved: boolean
}

export default function Header({ currentMindMap, onCreateNew, isSaved }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleExport = () => {
    if (!currentMindMap) return
    
    const dataStr = JSON.stringify(currentMindMap, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${currentMindMap.title}-mindmap.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            // TODO: Implement import functionality
            console.log('Import data:', data)
          } catch (error) {
            console.error('Failed to parse JSON:', error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              AI Mind Map
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              {currentMindMap ? currentMindMap.title : 'アイデアを視覚化しよう'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Save Status */}
          {currentMindMap && (
            <Card className="flex items-center gap-2 px-3 py-1.5 bg-white/40 backdrop-blur-sm border border-white/30">
              <Save className={`w-4 h-4 ${isSaved ? 'text-green-600' : 'text-orange-600'}`} />
              <span className="text-sm font-medium text-foreground">
                {isSaved ? '保存済み' : '保存中...'}
              </span>
            </Card>
          )}

          {/* Export Button */}
          {currentMindMap && (
            <Button
              onClick={handleExport}
              variant="ghost"
              size="icon"
              className="bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
              title="エクスポート"
            >
              <Download className="w-5 h-5" />
            </Button>
          )}

          {/* Import Button */}
          <Button
            onClick={handleImport}
            variant="ghost"
            size="icon"
            className="bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
            title="インポート"
          >
            <Upload className="w-5 h-5" />
          </Button>

          {/* New Mind Map Button */}
          <Button
            onClick={onCreateNew}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-blue-400/20"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            新規作成
          </Button>
        </div>
      </div>
    </header>
  )
}