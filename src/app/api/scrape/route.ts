import { NextRequest, NextResponse } from 'next/server'
import { load } from 'cheerio'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    return await handleScraping(url)
  } catch (error) {
    console.error('スクレイピングエラー:', error)
    return NextResponse.json(
      { 
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack available'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json(
        { error: 'URLパラメータが必要です' },
        { status: 400 }
      )
    }
    
    return await handleScraping(url)
  } catch (error) {
    console.error('スクレイピングエラー:', error)
    return NextResponse.json(
      { 
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack available'
      },
      { status: 500 }
    )
  }
}

async function handleScraping(url: string) {
  try {

    // URLのバリデーション
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URLが提供されていません' },
        { status: 400 }
      )
    }

    // URLの形式チェック
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json(
        { error: '無効なURLです' },
        { status: 400 }
      )
    }

    // 許可されたドメインのチェック
    const allowedDomains = process.env.ALLOWED_DOMAINS?.split(',') || [
      'mhlw.go.jp', 'gov.jp', 'jil.go.jp', 'nenkin.go.jp', 'nta.go.jp'
    ]
    console.log('Allowed domains:', allowedDomains)
    console.log('Request hostname:', validUrl.hostname)
    
    const isAllowedDomain = allowedDomains.some(domain => {
      const trimmedDomain = domain.trim()
      // より柔軟なドメインマッチング
      return validUrl.hostname.includes(trimmedDomain) || 
             validUrl.hostname.endsWith('.' + trimmedDomain) ||
             validUrl.hostname === trimmedDomain
    })

    if (!isAllowedDomain) {
      return NextResponse.json(
        { 
          error: '許可されていないドメインです。政府公式サイトのみ対応しています。',
          debug: {
            hostname: validUrl.hostname,
            allowedDomains: allowedDomains
          }
        },
        { status: 403 }
      )
    }

    // Webページの取得
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NewsLetterCreator/1.0 (Business Support Tool)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
        'Cache-Control': 'no-cache'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'ページの取得に失敗しました' },
        { status: 500 }
      )
    }

    const html = await response.text()
    const $ = load(html)

    // 不要な要素を削除
    $('script, style, nav, header, footer, aside, .menu, .navigation').remove()

    // タイトルの取得
    let title = $('title').text().trim()
    if (!title) {
      title = $('h1').first().text().trim()
    }

    // メインコンテンツの取得
    let content = ''
    
    // 一般的なメインコンテンツのセレクタを試行
    const contentSelectors = [
      'main',
      '.content',
      '.main-content', 
      '.article',
      '.post',
      '#content',
      '#main',
      '.body',
      '.text'
    ]

    for (const selector of contentSelectors) {
      const element = $(selector)
      if (element.length > 0 && element.text().trim().length > 100) {
        content = element.text().trim()
        break
      }
    }

    // メインコンテンツが見つからない場合、body全体から取得
    if (!content) {
      content = $('body').text().trim()
    }

    // 空白文字の正規化
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim()

    // 最低限のコンテンツ長チェック
    if (content.length < 100) {
      return NextResponse.json(
        { error: 'コンテンツが短すぎます。有効なページかどうか確認してください。' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        title,
        content: content.substring(0, 10000), // 最大10,000文字に制限
        url
      }
    })

  } catch (error) {
    console.error('スクレイピングエラー:', error)
    return NextResponse.json(
      { 
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack available'
      },
      { status: 500 }
    )
  }
}