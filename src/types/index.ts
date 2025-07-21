// ニュースレター関連の型定義

export interface Article {
  id: string
  url: string
  title: string
  content: string
  summary: string
  createdAt: Date
  updatedAt: Date
}

export interface Newsletter {
  id: string
  title: string
  articles: Article[]
  companyInfo?: CompanyInfo
  createdAt: Date
  updatedAt: Date
}

export interface CompanyInfo {
  name: string
  logo?: string
  address?: string
  phone?: string
  email?: string
  website?: string
}

export interface ScrapeResult {
  title: string
  content: string
  url: string
}

export interface SummaryRequest {
  content: string
  maxLength?: number
  tone?: 'professional' | 'casual' | 'formal'
}

export interface SummaryResponse {
  summary: string
  title: string
  keyPoints: string[]
}

export interface ExportOptions {
  format: 'pdf' | 'html'
  includeCompanyInfo: boolean
  template: 'standard' | 'modern' | 'minimal'
}

// UI関連の型定義
export interface ThemeColor {
  name: string
  class: string
  value: string
  accent: string
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}