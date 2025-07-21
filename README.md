# Newsletter Creator

社労士向けニュースレター作成ツール

## 概要

政府サイト（厚生労働省等）のURLを入力するだけで、AI（Claude）が自動的に内容を要約し、プロフェッショナルなニュースレターPDFを生成するWebアプリケーションです。

## 主な機能

- 🔗 **URL入力**: 政府公式サイトのURLを貼り付け
- 🤖 **AI要約**: Claude APIで専門的な要約を自動生成
- ✏️ **編集機能**: タイトル・内容を自由に編集
- 📄 **PDF出力**: 美しいニュースレターをワンクリックで生成
- 🎨 **Apple風デザイン**: モダンで使いやすいUI/UX

## 技術スタック

- **フロントエンド**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **AI**: Claude 3.5 Sonnet API (Anthropic)
- **PDF生成**: Puppeteer
- **デプロイ**: Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下を設定：

```bash
# Claude API設定
ANTHROPIC_API_KEY=your_claude_api_key_here

# セキュリティ設定
ALLOWED_DOMAINS=mhlw.go.jp,gov.jp,jil.go.jp,nenkin.go.jp,nta.go.jp

# アプリケーション設定
NEXT_PUBLIC_APP_NAME=NewsLetter Creator
NEXT_PUBLIC_APP_DESCRIPTION=社労士向けニュースレター作成ツール
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセス

## スクリプト

```bash
npm run dev      # 開発サーバーを起動
npm run build    # プロダクション用ビルド
npm run start    # プロダクションサーバーを起動
npm run lint     # ESLintでコード品質チェック
npm run test     # テスト実行
```

## 使い方

1. 政府サイト（厚生労働省等）のURLをコピー
2. アプリに貼り付けて「要約開始」をクリック
3. AIが自動で要約を生成
4. 必要に応じて内容を編集
5. 「PDF出力」でニュースレターをダウンロード

## デプロイ

このプロジェクトはVercelにデプロイできます：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MasakiOgata3/newsletter-creator)

## ライセンス

MIT License