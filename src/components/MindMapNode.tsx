'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Plus, X, Palette, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MindMapNode, THEME_COLORS, ThemeColor } from '@/types/mindmap'

interface CustomNodeData extends MindMapNode {
  onAddChild: (parentId: string) => void
  onUpdateNode: (id: string, content: string, color?: ThemeColor) => void
  onDeleteNode: (id: string) => void
  onGenerateAI: (nodeId: string) => void
  isRoot?: boolean
  isGeneratingAI?: boolean
}

export default function CustomMindMapNode({ data, selected }: NodeProps<CustomNodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(data.content)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const colorClass = THEME_COLORS.find(c => c.value === data.color)?.class || THEME_COLORS[0].class
  const accentColor = THEME_COLORS.find(c => c.value === data.color)?.accent || THEME_COLORS[0].accent

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
    setEditContent(data.content)
  }, [data.content])

  const handleSubmit = useCallback(() => {
    if (editContent.trim()) {
      data.onUpdateNode(data.id, editContent.trim())
    }
    setIsEditing(false)
  }, [editContent, data])

  const handleCancel = useCallback(() => {
    setEditContent(data.content)
    setIsEditing(false)
  }, [data.content])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }, [handleSubmit, handleCancel])

  const handleColorSelect = useCallback((color: ThemeColor) => {
    data.onUpdateNode(data.id, data.content, color)
    setShowColorPicker(false)
  }, [data])

  return (
    <>
      {!data.isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400/50 border-2 border-white"
        />
      )}
      
      <Card
        className={`
          relative min-w-[120px] max-w-[200px] p-4 cursor-pointer
          ${colorClass}
          ${selected ? 'shadow-2xl scale-[1.02]' : 'shadow-lg hover:shadow-xl'}
          transition-all duration-200 ease-out
          backdrop-blur-sm border border-white/30 hover:border-white/50
          ${data.isRoot ? 'text-lg font-bold' : 'text-sm'}
          ${data.isAiGenerated ? 'ring-2 ring-purple-400/50' : ''}
        `}
        style={{
          boxShadow: selected
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px ${accentColor}33`
            : `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px ${accentColor}22`,
        }}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <div className="mb-3">
            <input
              ref={inputRef}
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none text-gray-800"
            />
          </div>
        ) : (
          <div className="text-gray-800 flex items-center gap-2 mb-3">
            {data.isAiGenerated && (
              <Sparkles className="w-3 h-3 text-purple-500 flex-shrink-0" />
            )}
            <span>{data.content}</span>
          </div>
        )}

        <div className="flex justify-center gap-1 pt-2 border-t border-white/20">
          <Button
            onClick={() => data.onAddChild(data.id)}
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
            title="子ノードを追加"
          >
            <Plus className="w-3 h-3" />
          </Button>

          <Button
            onClick={() => data.onGenerateAI(data.id)}
            variant="ghost"
            size="sm"
            disabled={data.isGeneratingAI}
            className="h-7 w-7 p-0 bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md disabled:opacity-50"
            title="AI でアイデアを生成"
          >
            {data.isGeneratingAI ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 text-purple-500" />
            )}
          </Button>

          <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
                title="色を変更"
              >
                <Palette className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <div className="grid grid-cols-4 gap-1">
                {THEME_COLORS.map((color) => (
                  <Button
                    key={color.value}
                    onClick={() => handleColorSelect(color.value)}
                    variant="ghost"
                    size="sm"
                    className={`
                      h-7 w-7 p-0 ${color.class}
                      border-2 transition-all duration-200
                      hover:scale-110 hover:shadow-lg
                      ${data.color === color.value ? 'border-gray-600 scale-110 shadow-lg' : 'border-white/50 hover:border-gray-300'}
                    `}
                    title={color.name}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {!data.isRoot && (
            <Button
              onClick={() => data.onDeleteNode(data.id)}
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md hover:text-red-600"
              title="削除"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

      </Card>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400/50 border-2 border-white"
      />
    </>
  )
}