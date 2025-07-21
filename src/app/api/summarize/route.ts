import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { content, url, maxLength = 1000, tone = 'professional' } = await request.json()

    // URLが提供された場合は、そのURLを直接処理
    if (url && !content) {
      return await summarizeFromUrl(url, maxLength, tone)
    }

    // 入力バリデーション
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'コンテンツまたはURLが提供されていません' },
        { status: 400 }
      )
    }

    if (content.length < 100) {
      return NextResponse.json(
        { error: 'コンテンツが短すぎます' },
        { status: 400 }
      )
    }

    // APIキーの確認
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Claude APIキーが設定されていません' },
        { status: 500 }
      )
    }

    // 社労士向けプロンプト
    const systemPrompt = `
あなたは経験豊富な社労士です。政府機関の発表内容を、顧問先企業の経営者や人事担当者に向けて分かりやすく要約することが専門です。

以下の要件に従って要約してください：

1. **文字数**: ${maxLength}文字以内
2. **対象読者**: 企業の経営者・人事担当者
3. **トーン**: ${tone === 'professional' ? 'プロフェッショナル' : tone === 'casual' ? 'カジュアル' : 'フォーマル'}
4. **構成**: 
   - 概要（何が変わったか）
   - 企業への影響
   - 対応が必要な事項
   - 施行日・期限等の重要な日付

5. **注意点**:
   - 専門用語は分かりやすく説明
   - 具体的な数値や日付は正確に記載
   - 企業が取るべきアクションを明確に
   - 読みやすい段落構成で
   - 冒頭は「○○について」「○○に関して」などの自然なタイトル形式で始める
   - 「要約」「概要」などの語句は使わない

要約の最後に、3つの重要なポイントを箇条書きで提示してください。
`

    const userPrompt = `
以下の政府発表内容を、上記の要件に従って要約してください：

${content}
`

    // Claude APIに要約をリクエスト
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: Math.min(Math.ceil(maxLength * 1.5), 4000),
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    })

    const summary = message.content[0].type === 'text' ? message.content[0].text : ''

    if (!summary) {
      return NextResponse.json(
        { error: '要約の生成に失敗しました' },
        { status: 500 }
      )
    }

    // 要約から重要なポイントを抽出
    const lines = summary.split('\n')
    const keyPoints: string[] = []
    let title = ''

    // タイトルを生成（最初の段落または要約から）
    const titleMatch = summary.match(/^(.{10,50}?)(?:[。．\n]|$)/)
    if (titleMatch) {
      title = titleMatch[1].trim()
      // 「要約」や「概要」などの不要な言葉を削除
      title = title
        .replace(/^.*?の?要約:?/i, '')
        .replace(/^.*?の?概要:?/i, '')
        .replace(/^要約:?/i, '')
        .replace(/^概要:?/i, '')
        .trim()
      
      // 自然な「について」表現に変換
      if (!title.includes('について') && !title.includes('に関して')) {
        // 「○○制度」「○○改正」「○○見直し」などの場合は「について」を追加
        if (title.match(/(制度|改正|見直し|変更|新設|廃止|施行)$/)) {
          title = title + 'について'
        }
        // 「○○の○○」形式の場合も「について」を追加
        else if (title.includes('の')) {
          title = title + 'について'
        }
        // その他の場合も基本的に「について」を追加
        else if (title.length > 5) {
          title = title + 'について'
        }
      }
    } else {
      title = '重要なお知らせについて'
    }

    // 箇条書きの重要ポイントを抽出
    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('・') || trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.')) {
        keyPoints.push(trimmed.replace(/^[・•\-\d\.]\s*/, ''))
      }
    })

    // キーポイントが少ない場合は要約から重要な文を抽出
    if (keyPoints.length < 3) {
      const sentences = summary.split(/[。．]/)
      sentences.forEach(sentence => {
        const trimmed = sentence.trim()
        if (trimmed.length > 20 && trimmed.length < 100 && 
            (trimmed.includes('必要') || trimmed.includes('重要') || trimmed.includes('注意') || trimmed.includes('対応'))) {
          keyPoints.push(trimmed)
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: summary.trim(),
        title: title.substring(0, 100), // タイトルは100文字以内
        keyPoints: keyPoints.slice(0, 5) // 最大5つのポイント
      }
    })

  } catch (error) {
    console.error('要約エラー:', error)
    
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API エラー: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

async function summarizeFromUrl(url: string, maxLength: number, tone: string) {
  try {
    // APIキーの確認
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Claude APIキーが設定されていません' },
        { status: 500 }
      )
    }

    // URLベースの要約プロンプト
    const systemPrompt = `
あなたは経験豊富な社労士です。指定されたURLのWebページ内容を、顧問先企業の経営者や人事担当者に向けて分かりやすく要約することが専門です。

以下の要件に従って要約してください：

1. **文字数**: ${maxLength}文字以内
2. **対象読者**: 企業の経営者・人事担当者
3. **トーン**: ${tone === 'professional' ? 'プロフェッショナル' : tone === 'casual' ? 'カジュアル' : 'フォーマル'}
4. **構成**: 
   - 概要（何が変わったか）
   - 企業への影響
   - 対応が必要な事項
   - 施行日・期限等の重要な日付

5. **注意点**:
   - 専門用語は分かりやすく説明
   - 具体的な数値や日付は正確に記載
   - 企業が取るべきアクションを明確に
   - 読みやすい段落構成で
   - 冒頭は「○○について」「○○に関して」などの自然なタイトル形式で始める
   - 「要約」「概要」などの語句は使わない

要約の最後に、3つの重要なポイントを箇条書きで提示してください。
`

    const userPrompt = `
以下のURLのWebページ内容を、上記の要件に従って要約してください：

URL: ${url}

まずこのURLにアクセスしてページの内容を確認し、その後要約を作成してください。
`

    // Claude APIに要約をリクエスト
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: Math.min(Math.ceil(maxLength * 1.5), 4000),
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    })

    const summary = message.content[0].type === 'text' ? message.content[0].text : ''

    if (!summary) {
      return NextResponse.json(
        { error: '要約の生成に失敗しました' },
        { status: 500 }
      )
    }

    // 要約から重要なポイントを抽出
    const lines = summary.split('\n')
    const keyPoints: string[] = []
    let title = ''

    // タイトルを生成（最初の段落または要約から）
    const titleMatch = summary.match(/^(.{10,50}?)(?:[。．\n]|$)/)
    if (titleMatch) {
      title = titleMatch[1].trim()
      // 「要約」や「概要」などの不要な言葉を削除
      title = title
        .replace(/^.*?の?要約:?/i, '')
        .replace(/^.*?の?概要:?/i, '')
        .replace(/^要約:?/i, '')
        .replace(/^概要:?/i, '')
        .trim()
      
      // 自然な「について」表現に変換
      if (!title.includes('について') && !title.includes('に関して')) {
        // 「○○制度」「○○改正」「○○見直し」などの場合は「について」を追加
        if (title.match(/(制度|改正|見直し|変更|新設|廃止|施行)$/)) {
          title = title + 'について'
        }
        // 「○○の○○」形式の場合も「について」を追加
        else if (title.includes('の')) {
          title = title + 'について'
        }
        // その他の場合も基本的に「について」を追加
        else if (title.length > 5) {
          title = title + 'について'
        }
      }
    } else {
      title = '重要なお知らせについて'
    }

    // 箇条書きの重要ポイントを抽出
    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('・') || trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.')) {
        keyPoints.push(trimmed.replace(/^[・•\-\d\.]\s*/, ''))
      }
    })

    // キーポイントが少ない場合は要約から重要な文を抽出
    if (keyPoints.length < 3) {
      const sentences = summary.split(/[。．]/)
      sentences.forEach(sentence => {
        const trimmed = sentence.trim()
        if (trimmed.length > 20 && trimmed.length < 100 && 
            (trimmed.includes('必要') || trimmed.includes('重要') || trimmed.includes('注意') || trimmed.includes('対応'))) {
          keyPoints.push(trimmed)
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: summary.trim(),
        title: title.substring(0, 100), // タイトルは100文字以内
        keyPoints: keyPoints.slice(0, 5) // 最大5つのポイント
      }
    })

  } catch (error) {
    console.error('URL要約エラー:', error)
    
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API エラー: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: 'URL要約に失敗しました',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}