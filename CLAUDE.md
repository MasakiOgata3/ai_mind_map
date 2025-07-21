# AIマインドマップ プロジェクト

## プロジェクト概要
このプロジェクトは、AIを活用したインタラクティブなマインドマップアプリケーションです。Next.js 15.4.2とReact 19を使用して構築されています。

## 技術スタック
- **フレームワーク**: Next.js 15.4.2 (App Router)
- **UI**: React 19.1.0
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **開発ツール**: ESLint, Turbopack

## プロジェクト構造
```
ai_mind_map/
├── src/
│   └── app/                # Next.js App Router
│       ├── page.tsx        # メインページ
│       ├── layout.tsx      # 共通レイアウト
│       └── globals.css     # グローバルスタイル
├── public/                 # 静的アセット
├── package.json            # 依存関係
└── tsconfig.json          # TypeScript設定
```

## 開発コマンド
- `npm run dev` - 開発サーバー起動 (http://localhost:3000)
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバー
- `npm run lint` - コード品質チェック

## 実装予定の機能
- AIを活用したマインドマップの自動生成
- インタラクティブなノード操作
- リアルタイムコラボレーション
- エクスポート機能（画像、JSON、Markdown）

## 開発状況
現在は初期セットアップ段階です。Next.jsのデフォルトテンプレートから開発を開始します。