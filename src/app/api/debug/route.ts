import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 環境変数のチェック
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    const allowedDomains = process.env.ALLOWED_DOMAINS

    return NextResponse.json({
      success: true,
      data: {
        anthropicKeyExists: !!anthropicKey,
        anthropicKeyLength: anthropicKey ? anthropicKey.length : 0,
        allowedDomains: allowedDomains || 'not set',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}