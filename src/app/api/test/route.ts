import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 簡単なスクレイピングテスト
    const url = 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000147284_00020.html'
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const status = response.status
    const text = await response.text()
    
    return NextResponse.json({
      success: true,
      test: 'スクレイピングテスト',
      url: url,
      status: status,
      contentLength: text.length,
      contentPreview: text.substring(0, 500)
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack'
    })
  }
}