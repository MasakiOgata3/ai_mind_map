import { ApiResponse, ScrapeResult, SummaryRequest, SummaryResponse } from '@/types'

const API_BASE_URL = '/api'

export async function scrapeUrl(url: string): Promise<ApiResponse<ScrapeResult>> {
  try {
    const response = await fetch(`${API_BASE_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'スクレイピングに失敗しました')
    }

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function summarizeContent(
  request: SummaryRequest
): Promise<ApiResponse<SummaryResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '要約に失敗しました')
    }

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isValidNewsletterUrl(url: string): boolean {
  if (!validateUrl(url)) return false
  
  // 一般的なニュースサイトや政府サイトのドメインをチェック
  const allowedDomains = [
    'mhlw.go.jp',
    'gov.jp',
    'jil.go.jp',
    'nenkin.go.jp',
    'nta.go.jp',
  ]
  
  try {
    const urlObj = new URL(url)
    return allowedDomains.some(domain => urlObj.hostname.includes(domain))
  } catch {
    return false
  }
}