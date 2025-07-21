'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { scrapeUrl, summarizeContent } from '@/utils/api'
import { LoadingState, Article } from '@/types'
import { 
  FileText, 
  Link, 
  Sparkles, 
  Download, 
  Clock, 
  Shield,
  Zap,
  CheckCircle,
  Loader2,
  AlertCircle,
  Edit3,
  Save,
  X
} from 'lucide-react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [error, setError] = useState<string>('')
  const [article, setArticle] = useState<Article | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedSummary, setEditedSummary] = useState('')
  const [editedTitle, setEditedTitle] = useState('')

  const handleSummarize = async () => {
    if (!url.trim()) return

    setLoadingState('loading')
    setError('')
    setArticle(null)

    try {
      // Step 1: スクレイピング
      const scrapeResult = await scrapeUrl(url.trim())
      
      if (!scrapeResult.success || !scrapeResult.data) {
        throw new Error(scrapeResult.error || 'コンテンツの取得に失敗しました')
      }

      // Step 2: AI要約
      const summaryResult = await summarizeContent({
        content: scrapeResult.data.content,
        maxLength: 1000,
        tone: 'professional'
      })

      if (!summaryResult.success || !summaryResult.data) {
        throw new Error(summaryResult.error || '要約の生成に失敗しました')
      }

      // 結果をセット
      const newArticle: Article = {
        id: Date.now().toString(),
        url: scrapeResult.data.url,
        title: summaryResult.data.title,
        content: scrapeResult.data.content,
        summary: summaryResult.data.summary,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setArticle(newArticle)
      setLoadingState('success')
      
      // 編集用のstateも初期化
      setEditedTitle(summaryResult.data.title)
      setEditedSummary(summaryResult.data.summary)

    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
      setLoadingState('error')
    }
  }

  const handleGeneratePDF = async () => {
    if (!article) return

    setPdfLoading(true)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article.title,
          summary: article.summary,
          url: article.url,
          companyInfo: {
            name: '社会保険労務士事務所',
            email: 'info@example.com',
            phone: 'TEL: 03-1234-5678'
          }
        }),
      })

      if (!response.ok) {
        throw new Error('PDF生成に失敗しました')
      }

      // PDFをダウンロード
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `newsletter-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF生成に失敗しました')
    } finally {
      setPdfLoading(false)
    }
  }

  const handleStartEdit = () => {
    if (article) {
      setEditedTitle(article.title)
      setEditedSummary(article.summary)
      setIsEditing(true)
    }
  }

  const handleSaveEdit = () => {
    if (article && editedTitle.trim() && editedSummary.trim()) {
      const updatedArticle: Article = {
        ...article,
        title: editedTitle.trim(),
        summary: editedSummary.trim(),
        updatedAt: new Date()
      }
      setArticle(updatedArticle)
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (article) {
      setEditedTitle(article.title)
      setEditedSummary(article.summary)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 装飾背景レイヤー */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl" />

      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                NewsLetter Creator
              </h1>
              <p className="text-sm text-gray-500 font-medium">社労士向けニュースレター作成ツール</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-blue-400/20">
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              今すぐ作成
            </Button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-24">
        {/* ヒーローセクション */}
        <section className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-4xl mx-auto px-6">
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-xl">
              <Sparkles className="w-16 h-16 text-blue-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse" />
          </div>

          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            AIで、ニュースレター作成を
            <br />
            10分の1に短縮
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            厚生労働省等のURLを貼り付けるだけで、AIが自動で1000文字以内に要約し、
            プロフェッショナルなニュースレターを生成します。
          </p>

          {/* URL入力フォーム */}
          <div className="w-full max-w-2xl mb-12">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://www.mhlw.go.jp/... （厚生労働省等のURL）"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300/50 bg-white/50 backdrop-blur-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ease-out placeholder:text-gray-400 text-lg h-14"
                />
              </div>
              <Button 
                onClick={handleSummarize}
                className="group flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-blue-400/20 h-14"
                disabled={!url.trim() || loadingState === 'loading'}
              >
                {loadingState === 'loading' ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Link className="w-5 h-5 mr-2" />
                )}
                {loadingState === 'loading' ? '処理中...' : '要約開始'}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              安全：政府公式サイトのみ対応
            </div>
          </div>

          {/* エラー表示 */}
          {error && (
            <Alert className="max-w-2xl bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* 結果表示 */}
          {article && loadingState === 'success' && (
            <Card className="w-full max-w-4xl shadow-xl bg-white/80 backdrop-blur-sm border-white/50">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-2xl font-bold text-gray-900 mb-2 bg-blue-50 border-blue-200 focus:border-blue-400"
                        placeholder="タイトルを入力..."
                      />
                    ) : (
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                        {article.title}
                      </CardTitle>
                    )}
                    <CardDescription className="text-sm text-gray-600">
                      出典: {new URL(article.url).hostname}
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleGeneratePDF}
                    disabled={pdfLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {pdfLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {pdfLoading ? 'PDF生成中...' : 'PDF出力'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      AI要約（{isEditing ? editedSummary.length : article.summary.length}文字）
                    </h3>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      {isEditing ? (
                        <Textarea
                          value={editedSummary}
                          onChange={(e) => setEditedSummary(e.target.value)}
                          className="min-h-[200px] text-gray-800 leading-relaxed bg-white border-blue-200 focus:border-blue-400 resize-none"
                          placeholder="要約内容を編集..."
                        />
                      ) : (
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {article.summary}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      作成日時: {article.createdAt.toLocaleString('ja-JP')}
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button 
                            onClick={handleSaveEdit}
                            disabled={!editedTitle.trim() || !editedSummary.trim()}
                            className="flex items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Save className="w-4 h-4" />
                            保存
                          </Button>
                          <Button 
                            onClick={handleCancelEdit}
                            variant="outline" 
                            className="flex items-center gap-1 text-sm"
                          >
                            <X className="w-4 h-4" />
                            キャンセル
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            onClick={handleStartEdit}
                            variant="outline" 
                            className="flex items-center gap-1 text-sm"
                          >
                            <Edit3 className="w-4 h-4" />
                            編集
                          </Button>
                          <Button variant="outline" className="text-sm">
                            再要約
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 結果が表示されている場合は、通常のコンテンツを非表示 */}
          {!article && (
            <>
              {/* 機能紹介 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ease-out bg-white/70 backdrop-blur-sm border-white/30">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-4">
                  <Link className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">URL自動解析</CardTitle>
                <CardDescription>
                  公式サイトのURLを貼り付けるだけで、コンテンツを自動取得
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ease-out bg-white/70 backdrop-blur-sm border-white/30">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">AI要約</CardTitle>
                <CardDescription>
                  社労士向けに最適化されたAIが、重要なポイントを1000文字で要約
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ease-out bg-white/70 backdrop-blur-sm border-white/30">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">PDF出力</CardTitle>
                <CardDescription>
                  プロフェッショナルなデザインでPDF形式で即座にダウンロード
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
            </>
          )}
        </section>

        {/* 利用の流れ */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-12">
              3ステップで完了
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'URL入力',
                  description: '厚生労働省等の公式サイトのURLをコピー&ペースト',
                  icon: Link
                },
                {
                  step: '02', 
                  title: 'AI要約',
                  description: '専門AIが内容を読み取り、1000文字以内で要約',
                  icon: Sparkles
                },
                {
                  step: '03',
                  title: 'PDF生成',
                  description: 'ニュースレター形式でPDFを自動生成・ダウンロード',
                  icon: Download
                }
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="relative">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="text-4xl font-bold text-gray-300 mb-2">{item.step}</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                    
                    {index < 2 && (
                      <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* メリット */}
        <section className="py-20 px-6 bg-white/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent text-center mb-12">
              こんな効果が期待できます
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Clock,
                  title: '作業時間を90%短縮',
                  description: '従来2時間かかっていた作業が10分で完了'
                },
                {
                  icon: CheckCircle,
                  title: '品質の向上',
                  description: 'AIが重要なポイントを漏れなく要約'
                },
                {
                  icon: Shield,
                  title: '情報の信頼性',
                  description: '政府公式サイトのみを情報源として使用'
                },
                {
                  icon: Zap,
                  title: '顧客満足度向上',
                  description: 'タイムリーで有益な情報を定期的に提供'
                }
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <Card key={index} className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ease-out bg-white/70 backdrop-blur-sm border-white/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}