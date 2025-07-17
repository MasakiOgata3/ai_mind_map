import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { MindMapNode } from '@/types/mindmap'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { nodes, targetNodeId } = await request.json()
    
    if (!nodes || !targetNodeId) {
      return NextResponse.json(
        { error: 'ノードデータまたはターゲットノードIDが不足しています' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    // ターゲットノードを特定
    const targetNode = nodes.find((node: MindMapNode) => node.id === targetNodeId)
    if (!targetNode) {
      return NextResponse.json(
        { error: 'ターゲットノードが見つかりません' },
        { status: 404 }
      )
    }

    // 既存のノードの内容を整理
    const nodeContents = nodes.map((node: MindMapNode) => node.content).join(', ')
    
    // プロンプトを作成
    const prompt = `
あなたはマインドマップのアイデア生成AIです。
以下の既存のマインドマップの内容を基に、「${targetNode.content}」から派生する関連性の高いアイデアを3つ生成してください。

既存のマインドマップの内容：
${nodeContents}

注意点：
- 既存のノードと重複しないようにしてください
- 「${targetNode.content}」と直接関連性のあるアイデアを生成してください
- 各アイデアは簡潔で分かりやすくしてください
- 日本語で回答してください
- 箇条書きで回答してください（「・」を使用）

アイデア：
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // 箇条書きからアイデアを抽出
    const ideas = text
      .split('\n')
      .filter(line => line.trim().startsWith('・'))
      .map(line => line.trim().replace('・', '').trim())
      .filter(idea => idea.length > 0)
      .slice(0, 3) // 最大3つまで

    return NextResponse.json({ ideas })

  } catch (error) {
    console.error('Gemini API Error:', error)
    return NextResponse.json(
      { error: 'AIアイデア生成中にエラーが発生しました' },
      { status: 500 }
    )
  }
}