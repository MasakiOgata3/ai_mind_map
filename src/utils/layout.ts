import { Node, Edge } from '@xyflow/react'
import { MindMapNode } from '@/types/mindmap'

interface LayoutNode {
  id: string
  children: LayoutNode[]
  node: MindMapNode
}

export function buildTree(nodes: MindMapNode[]): LayoutNode | null {
  const nodeMap = new Map<string, LayoutNode>()
  const rootNodes: LayoutNode[] = []

  // Create layout nodes
  nodes.forEach(node => {
    nodeMap.set(node.id, {
      id: node.id,
      children: [],
      node
    })
  })

  // Build tree structure
  nodes.forEach(node => {
    const layoutNode = nodeMap.get(node.id)!
    if (node.parentId === null) {
      rootNodes.push(layoutNode)
    } else {
      const parent = nodeMap.get(node.parentId)
      if (parent) {
        parent.children.push(layoutNode)
      }
    }
  })

  return rootNodes[0] || null
}

export function calculateRadialLayout(
  root: LayoutNode,
  centerX: number = 400,
  centerY: number = 300,
  levelDistance: number = 200
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  function layoutSubtree(
    node: LayoutNode,
    x: number,
    y: number,
    angle: number,
    angleRange: number,
    level: number
  ) {
    // Add node
    nodes.push({
      id: node.id,
      type: 'mindMapNode',
      position: { x, y },
      data: {
        ...node.node,
        isRoot: level === 0
      }
    })

    // Add edges for children
    if (node.children.length > 0) {
      // Calculate dynamic distance based on level and number of children
      const currentLevelDistance = levelDistance + (level * 50)
      const angleStep = angleRange / node.children.length
      let currentAngle = angle - angleRange / 2

      node.children.forEach((child) => {
        const childAngle = currentAngle + angleStep / 2
        const childX = x + Math.cos(childAngle) * currentLevelDistance
        const childY = y + Math.sin(childAngle) * currentLevelDistance

        edges.push({
          id: `${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'straight',
          style: {
            stroke: '#94a3b8',
            strokeWidth: 2
          }
        })

        // Recursively layout children with improved angle distribution
        const childAngleRange = level === 0 
          ? Math.PI * 2 / node.children.length 
          : Math.min(angleStep * 0.9, Math.PI / 2)
        layoutSubtree(child, childX, childY, childAngle, childAngleRange, level + 1)

        currentAngle += angleStep
      })
    }
  }

  if (root) {
    layoutSubtree(root, centerX, centerY, 0, Math.PI * 2, 0)
  }

  return { nodes, edges }
}

export function getNodesAndEdges(mindMapNodes: MindMapNode[]): { nodes: Node[]; edges: Edge[] } {
  const tree = buildTree(mindMapNodes)
  if (!tree) {
    return { nodes: [], edges: [] }
  }

  return calculateRadialLayout(tree)
}