import { NextRequest, NextResponse } from 'next/server'
import { load } from 'cheerio'

export async function GET(request: NextRequest) {
  const logs: string[] = []
  
  try {
    logs.push('スクレイピングデバッグ開始')
    
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    logs.push(`URL parameter: ${url}`)
    
    if (!url) {
      return NextResponse.json({
        error: 'URLパラメータが必要です',
        logs
      }, { status: 400 })
    }

    // URLのバリデーション
    logs.push('URLバリデーション開始')
    if (!url || typeof url !== 'string') {
      return NextResponse.json({
        error: 'URLが提供されていません',
        logs
      }, { status: 400 })
    }

    // URLの形式チェック
    let validUrl: URL
    try {
      validUrl = new URL(url)
      logs.push(`有効なURL: ${validUrl.href}`)
    } catch (e) {
      logs.push(`URLパースエラー: ${e}`)
      return NextResponse.json({
        error: '無効なURLです',
        logs
      }, { status: 400 })
    }

    // 許可されたドメインのチェック
    logs.push('ドメインチェック開始')
    const allowedDomains = process.env.ALLOWED_DOMAINS?.split(',') || [
      'mhlw.go.jp', 'gov.jp', 'jil.go.jp', 'nenkin.go.jp', 'nta.go.jp'
    ]
    logs.push(`許可ドメイン: ${allowedDomains.join(', ')}`)
    logs.push(`リクエストホスト名: ${validUrl.hostname}`)
    
    const isAllowedDomain = allowedDomains.some(domain => {
      const trimmedDomain = domain.trim()
      const matches = validUrl.hostname.includes(trimmedDomain) || 
             validUrl.hostname.endsWith('.' + trimmedDomain) ||
             validUrl.hostname === trimmedDomain
      logs.push(`ドメイン ${trimmedDomain} マッチ: ${matches}`)
      return matches
    })

    logs.push(`ドメイン許可: ${isAllowedDomain}`)

    if (!isAllowedDomain) {
      return NextResponse.json({
        error: '許可されていないドメインです。政府公式サイトのみ対応しています。',
        debug: {
          hostname: validUrl.hostname,
          allowedDomains: allowedDomains
        },
        logs
      }, { status: 403 })
    }

    // Webページの取得
    logs.push('Webページ取得開始')
    let response: Response
    try {
      response = await fetch(url, {
        headers: {
          'User-Agent': 'NewsLetterCreator/1.0 (社労士向けニュースレター作成ツール; 業務支援目的)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
          'Cache-Control': 'no-cache'
        }
      })
      logs.push(`HTTP ステータス: ${response.status}`)
    } catch (e) {
      logs.push(`Fetch エラー: ${e}`)
      return NextResponse.json({
        error: 'ページの取得に失敗しました (fetch error)',
        logs
      }, { status: 500 })
    }

    if (!response.ok) {
      logs.push(`HTTP エラー: ${response.status} ${response.statusText}`)
      return NextResponse.json({
        error: 'ページの取得に失敗しました',
        logs
      }, { status: 500 })
    }

    logs.push('HTML取得開始')
    let html: string
    try {
      html = await response.text()
      logs.push(`HTML長: ${html.length}文字`)
    } catch (e) {
      logs.push(`HTML読み取りエラー: ${e}`)
      return NextResponse.json({
        error: 'HTMLの読み取りに失敗しました',
        logs
      }, { status: 500 })
    }

    logs.push('Cheerio解析開始')
    let $: any
    try {
      $ = load(html)
      logs.push('Cheerio解析完了')
    } catch (e) {
      logs.push(`Cheerio解析エラー: ${e}`)
      return NextResponse.json({
        error: 'HTML解析に失敗しました',
        logs
      }, { status: 500 })
    }

    // 不要な要素を削除
    logs.push('不要な要素削除開始')
    $('script, style, nav, header, footer, aside, .menu, .navigation').remove()

    // タイトルの取得
    logs.push('タイトル取得開始')
    let title = $('title').text().trim()
    if (!title) {
      title = $('h1').first().text().trim()
    }
    logs.push(`タイトル: ${title}`)

    // メインコンテンツの取得
    logs.push('コンテンツ取得開始')
    let content = ''
    
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
        logs.push(`コンテンツ取得成功 (${selector}): ${content.length}文字`)
        break
      } else {
        logs.push(`セレクタ ${selector}: 要素数=${element.length}, 文字数=${element.text().trim().length}`)
      }
    }

    // メインコンテンツが見つからない場合、body全体から取得
    if (!content) {
      logs.push('bodyから全体取得')
      content = $('body').text().trim()
    }

    // 空白文字の正規化
    logs.push('文字正規化開始')
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim()

    logs.push(`最終コンテンツ長: ${content.length}文字`)

    // 最低限のコンテンツ長チェック
    if (content.length < 100) {
      logs.push(`コンテンツが短すぎます: ${content.length}文字`)
      return NextResponse.json({
        error: 'コンテンツが短すぎます。有効なページかどうか確認してください。',
        logs
      }, { status: 400 })
    }

    logs.push('スクレイピング成功')

    return NextResponse.json({
      success: true,
      data: {
        title,
        content: content.substring(0, 1000), // デバッグ用に1000文字のみ
        url,
        contentLength: content.length
      },
      logs
    })

  } catch (error) {
    logs.push(`予期しないエラー: ${error}`)
    logs.push(`エラースタック: ${error instanceof Error ? error.stack : 'No stack'}`)
    
    return NextResponse.json({
      error: 'サーバーエラーが発生しました',
      errorDetails: error instanceof Error ? error.message : String(error),
      logs
    }, { status: 500 })
  }
}