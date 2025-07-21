import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export async function POST(request: NextRequest) {
  try {
    const { title, summary, url, companyInfo } = await request.json()

    // 入力バリデーション
    if (!title || !summary) {
      return NextResponse.json(
        { error: 'タイトルと要約が必要です' },
        { status: 400 }
      )
    }

    // 日付の取得
    const now = new Date()
    const formattedDate = now.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // HTMLテンプレート
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ニュースレター - ${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Noto Sans JP', sans-serif;
          line-height: 1.7;
          color: #333;
          background: #f8f9fa;
          padding: 20px;
        }
        
        .newsletter {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .header .subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 20px;
        }
        
        .header .date {
          font-size: 14px;
          opacity: 0.8;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .article {
          margin-bottom: 30px;
        }
        
        .article-title {
          font-size: 22px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 3px solid #667eea;
        }
        
        .article-meta {
          font-size: 12px;
          color: #718096;
          margin-bottom: 20px;
          padding: 8px 12px;
          background: #f7fafc;
          border-radius: 6px;
          border-left: 4px solid #667eea;
        }
        
        .article-content {
          font-size: 15px;
          line-height: 1.8;
          color: #4a5568;
          white-space: pre-wrap;
        }
        
        .footer {
          background: #2d3748;
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .footer .company {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .footer .contact {
          font-size: 14px;
          opacity: 0.8;
          line-height: 1.5;
        }
        
        .footer .generated {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #4a5568;
          font-size: 12px;
          opacity: 0.6;
        }
        
        @media print {
          body { background: white; padding: 0; }
          .newsletter { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="newsletter">
        <div class="header">
          <h1>労務関連ニュースレター</h1>
          <div class="subtitle">重要な労務情報をお届けします</div>
          <div class="date">${formattedDate}</div>
        </div>
        
        <div class="content">
          <div class="article">
            <h2 class="article-title">${title}</h2>
            <div class="article-meta">
              出典: ${url ? new URL(url).hostname : '政府公式サイト'}
            </div>
            <div class="article-content">${summary}</div>
          </div>
        </div>
        
        <div class="footer">
          <div class="company">
            ${companyInfo?.name || '社会保険労務士事務所'}
          </div>
          <div class="contact">
            ${companyInfo?.email || 'info@example.com'}<br>
            ${companyInfo?.phone || 'TEL: 03-1234-5678'}
          </div>
          <div class="generated">
            このニュースレターはAIによって生成されました<br>
            NewsLetter Creator - 社労士向けニュースレター作成ツール
          </div>
        </div>
      </div>
    </body>
    </html>
    `

    // サーバーレス環境対応のブラウザ起動
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })

    const page = await browser.newPage()
    
    // HTMLをロード
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    
    // PDFを生成
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    })

    await browser.close()

    // PDFを返す
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="newsletter-${Date.now()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('PDF生成エラー:', error)
    return NextResponse.json(
      { error: 'PDF生成に失敗しました' },
      { status: 500 }
    )
  }
}