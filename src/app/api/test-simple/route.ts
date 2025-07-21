import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // より簡単なサイトでテスト
    const testUrl = 'https://httpbin.org/json'
    
    const response = await fetch(testUrl)
    const data = await response.text()
    
    return NextResponse.json({
      success: true,
      message: 'Vercelから外部サイトへのアクセステスト',
      testUrl,
      status: response.status,
      dataLength: data.length,
      preview: data.substring(0, 200)
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null
    })
  }
}