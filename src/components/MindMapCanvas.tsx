'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  NodeTypes
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { toast } from 'sonner'
import { MindMapData, MindMapNode, ThemeColor } from '@/types/mindmap'
import { getNodesAndEdges } from '@/utils/layout'
import CustomMindMapNode from './MindMapNode'

const nodeTypes: NodeTypes = {
  mindMapNode: CustomMindMapNode
}

interface MindMapCanvasProps {
  mindMapData: MindMapData | null
  onUpdateMindMap: (updater: (map: MindMapData) => MindMapData) => void
}

export default function MindMapCanvas({ mindMapData, onUpdateMindMap }: MindMapCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null)

  // Update nodes and edges when mindMapData changes
  useEffect(() => {
    if (mindMapData) {
      const { nodes: layoutNodes, edges: layoutEdges } = getNodesAndEdges(mindMapData.nodes)
      
      // Add callbacks to node data
      const nodesWithCallbacks = layoutNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onAddChild: handleAddChild,
          onUpdateNode: handleUpdateNode,
          onDeleteNode: handleDeleteNode,
          onGenerateAI: handleGenerateAI,
          isGeneratingAI: loadingNodeId === node.id
        }
      }))

      setNodes(nodesWithCallbacks)
      setEdges(layoutEdges)
    }
  }, [mindMapData, loadingNodeId, setNodes, setEdges])

  const handleAddChild = useCallback((parentId: string) => {
    if (!mindMapData) return

    const newNode: MindMapNode = {
      id: `node-${Date.now()}`,
      content: '新しいアイデア',
      parentId,
      color: 'ocean',
      position: { x: 0, y: 0 }, // Will be calculated by layout
      createdAt: new Date(),
      updatedAt: new Date()
    }

    onUpdateMindMap(map => ({
      ...map,
      nodes: [...map.nodes, newNode]
    }))
  }, [mindMapData, onUpdateMindMap])

  const handleUpdateNode = useCallback((
    nodeId: string, 
    content: string, 
    color?: ThemeColor
  ) => {
    if (!mindMapData) return

    onUpdateMindMap(map => ({
      ...map,
      nodes: map.nodes.map(node => 
        node.id === nodeId 
          ? { 
              ...node, 
              content, 
              ...(color && { color }),
              updatedAt: new Date()
            }
          : node
      )
    }))
  }, [mindMapData, onUpdateMindMap])

  const handleDeleteNode = useCallback((nodeId: string) => {
    if (!mindMapData) return

    // Get all descendant nodes
    const getDescendants = (id: string): string[] => {
      const descendants: string[] = []
      const children = mindMapData.nodes.filter(n => n.parentId === id)
      
      children.forEach(child => {
        descendants.push(child.id)
        descendants.push(...getDescendants(child.id))
      })
      
      return descendants
    }

    const nodesToDelete = [nodeId, ...getDescendants(nodeId)]

    onUpdateMindMap(map => ({
      ...map,
      nodes: map.nodes.filter(node => !nodesToDelete.includes(node.id))
    }))
  }, [mindMapData, onUpdateMindMap])

  const handleGenerateAI = useCallback(async (nodeId: string) => {
    if (!mindMapData || loadingNodeId) return

    setLoadingNodeId(nodeId)

    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodes: mindMapData.nodes,
          targetNodeId: nodeId,
        }),
      })

      if (!response.ok) {
        throw new Error('AI生成に失敗しました')
      }

      const { ideas } = await response.json()

      // 生成されたアイデアを新しいノードとして追加
      const newNodes = ideas.map((idea: string, index: number) => ({
        id: `ai-${nodeId}-${Date.now()}-${index}`,
        content: idea,
        parentId: nodeId,
        color: 'lavender' as ThemeColor,
        position: { x: 0, y: 0 }, // Will be calculated by layout
        createdAt: new Date(),
        updatedAt: new Date(),
        isAiGenerated: true,
      }))

      onUpdateMindMap(map => ({
        ...map,
        nodes: [...map.nodes, ...newNodes]
      }))

      toast.success('AIアイデアを生成しました', {
        description: `${ideas.length}個のアイデアが追加されました`,
      })

    } catch (error) {
      console.error('AI生成エラー:', error)
      toast.error('AI生成に失敗しました', {
        description: 'しばらく時間をおいて再度お試しください',
      })
    } finally {
      setLoadingNodeId(null)
    }
  }, [mindMapData, loadingNodeId, onUpdateMindMap])

  if (!mindMapData) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 mb-2">マインドマップを作成してください</div>
          <div className="text-gray-500">ヘッダーの「新規作成」ボタンをクリックしてください</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl" />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false
        }}
        minZoom={0.5}
        maxZoom={2}
        defaultEdgeOptions={{
          style: {
            stroke: '#94a3b8',
            strokeWidth: 2
          },
          type: 'smoothstep'
        }}
        className="relative z-10"
      >
        <Background 
          color="#e2e8f0" 
          gap={20} 
          size={1} 
          variant="dots"
          className="opacity-30"
        />
        <Controls 
          className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        <MiniMap 
          className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg"
          nodeColor={(node) => {
            const color = node.data?.color || 'ocean'
            const themeColor = mindMapData.nodes.find(n => n.id === node.id)?.color || 'ocean'
            return `hsl(${themeColor === 'ocean' ? '200' : '300'}, 70%, 80%)`
          }}
        />
      </ReactFlow>
    </div>
  )
}