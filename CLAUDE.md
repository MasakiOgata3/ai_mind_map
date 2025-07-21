# プロジェクト概要
 
このプロジェクトは `create-next-app` で作成された Next.js プロジェクトです。
プロジェクトフォルダ: `/Users/masakiogata/Desktop/claudecode/newsletter_creator`
 
## 主要技術
 
- **フレームワーク:** Next.js
- **言語:** TypeScript
- **UI:** React
- **スタイリング:** Tailwind CSS / shadcn
- **リンティング:** ESLint
- **自動テスト: ** Jest
 
## デザインについて
 
後述する「Apple風モダンデザインシステム実装ガイド」に則ったデザインにします。
 
## プロジェクト構造
 
このプロジェクトは、標準的な Next.js の `app` ディレクトリ構造に従っています。
 
* `src/app/layout.tsx`: アプリケーションのルートレイアウトです。
* `src/app/page.tsx`: アプリケーションのメインページです。
* `public/`: 画像やフォントなどの静的アセットが含まれています。
* `package.json`: プロジェクトの依存関係とスクリプトを定義します。
 
## スクリプト
 
* `npm run dev`: 開発サーバーを起動します。
* `npm run build`: プロダクション用にアプリケーションをビルドします。
* `npm run start`: プロダクションサーバーを起動します。
* `npm run lint`: コードベースのリンティングを実行します。
* `npm run test`: 自動テストを実行します。
 
## はじめに
 
このプロジェクトを開始するには、次のコマンドを実行します。
 
```bash
npm run dev
```
 
これにより、開発サーバーが `http://localhost:3000` で起動します。
 
## 開発方針
 
このプロジェクトでは、テスト駆動開発（TDD）を採用します。新しい機能の実装や既存機能の修正を行う際には、まずテストコードを記述し、そのテストをパスするように実装を進めます。
 
1. 失敗するテストを書く（RED）
2. テストが通るように実装（GREEN）
3. 再設計する（REFACTOR）
 
## 開発の流れ
 
## Phase 1: セットアップ・環境構築
 
1. **既存の実装を把握する**
 
2. 要件の達成に必要なセットアップがあれば実施する（ライブラリのインストールなど）
 
## Phase 2: 設計・テスト駆動開発
 
5. **Apple風デザインシステムに基づく設計を行う**
   - カラーシステム定義
   - コンポーネント構成設計
   - レスポンシブブレークポイント設計
 
6. **先に要件を満たすテストを書く**
   - 機能・ロジックテスト
   - UI/UXテスト
   - テストカバレッジは 90% 以上を目指す
 
## Phase 3: 実装・品質担保
 
7. **Apple風デザインシステムに準拠した実装**
   - Glassmorphismヘッダー
   - 多層グラデーション背景
   - マイクロインタラクション
   - レスポンシブレイアウト
 
8. **コード品質向上のリファクタリング**
   - 定数・型定義の分離
   - カスタムフック作成
   - パフォーマンス最適化
 
9. **すべての品質チェックがパスすることを確認**
   - ESLint: コード品質
   - TypeScript: 型安全性
   - Jest: 機能テスト
   - Build: 本番環境対応
 
10. **README.md に現在の仕様をまとめる**
 
# Apple風モダンデザインシステム実装ガイド
 
## デザイン哲学
 
### Core Principles
1. **Spatial Design**: 十分な余白とバランスの取れたレイアウト
2. **Depth & Layering**: 適切な階層構造とz-index管理
3. **Motion with Purpose**: 意味のあるアニメーションと操作性向上
4. **Color Harmony**: 統一感のあるカラーシステム
5. **Typography Excellence**: 読みやすさを重視した文字設計
6. **Glassmorphism**: 半透明とbackdrop-blurによる奥行き感
 
## カラーシステム設計
 
### グラデーションパレット構成
8色のテーマカラーを設計し、各色にアクセントカラーを設定：
 
```typescript
export const THEME_COLORS = [
  {
    name: 'サンシャイン',
    class: 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300/30',
    value: 'sunshine',
    accent: '#FCD34D'
  },
  {
    name: 'ブロッサム',
    class: 'bg-gradient-to-br from-pink-100 to-rose-200 border-pink-300/30',
    value: 'blossom',
    accent: '#FB7185'
  },
  {
    name: 'オーシャン',
    class: 'bg-gradient-to-br from-sky-100 to-blue-200 border-blue-300/30',
    value: 'ocean',
    accent: '#60A5FA'
  },
  {
    name: 'フォレスト',
    class: 'bg-gradient-to-br from-emerald-100 to-green-200 border-green-300/30',
    value: 'forest',
    accent: '#34D399'
  },
  {
    name: 'ラベンダー',
    class: 'bg-gradient-to-br from-purple-100 to-violet-200 border-purple-300/30',
    value: 'lavender',
    accent: '#A78BFA'
  },
  {
    name: 'サンセット',
    class: 'bg-gradient-to-br from-orange-100 to-amber-200 border-orange-300/30',
    value: 'sunset',
    accent: '#F59E0B'
  },
  {
    name: 'ミスト',
    class: 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-300/30',
    value: 'mist',
    accent: '#64748B'
  },
  {
    name: 'ミント',
    class: 'bg-gradient-to-br from-teal-100 to-cyan-200 border-teal-300/30',
    value: 'mint',
    accent: '#14B8A6'
  },
] as const
 
export type ThemeColor = typeof THEME_COLORS[number]['value']
```
 
### カラー設計原則
- **グラデーション**: `from-{color}-100 to-{color}-200` で統一
- **ボーダー**: `border-{color}-300/30` で微細な境界線
- **アクセント**: 各色に対応するHEXカラーでブランド一貫性確保
- **透明度**: `/30`, `/50`, `/80` の段階的透明度システム
 
## 背景デザインアーキテクチャ
 
### 多層グラデーション構成
```tsx
{/* ベースグラデーション */}
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
 
  {/* 装飾レイヤー1 */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
 
  {/* 装飾レイヤー2: 大きなblur円 */}
  <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
 
  {/* 装飾レイヤー3: 小さなblur円 */}
  <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl" />
</div>
```
 
### 背景設計原則
- **3層構造**: ベース + 装飾1 + 装飾2,3
- **低透明度**: 5%〜10%で控えめな装飾効果
- **blur-3xl**: 大きなぼかしで自然な奥行き感
- **グラデーション方向**: `to-br`（右下）で統一感
 
## ヘッダーデザインパターン
 
### Glassmorphismヘッダー
```tsx
<header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm z-50">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    {/* ブランドセクション */}
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          App Name
        </h1>
        <p className="text-sm text-gray-500 font-medium">説明文</p>
      </div>
    </div>
 
    {/* アクションボタン */}
    <div className="flex items-center gap-3">
      {/* プライマリボタン */}
      <button className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-blue-400/20">
        <Icon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        ボタンテキスト
      </button>
    </div>
  </div>
</header>
```
 
### ヘッダー設計原則
- **固定配置**: `fixed top-0` でスクロール時も表示
- **Glassmorphism**: `bg-white/70 backdrop-blur-xl`
- **最大幅制限**: `max-w-7xl mx-auto` で中央揃え
- **アイコングラデーション**: ブランドアイコンにグラデーション適用
- **マイクロインタラクション**: ホバー時の回転・スケール変化
- **メイン要素の阻害注意**: メインとなる要素がヘッダーの下に隠れてしまわないよう注意
 
## コンポーネントデザインパターン
 
### メインカードコンポーネント
```tsx
<div className={`
  relative w-full max-w-sm p-6 rounded-2xl shadow-lg
  ${getColorClass(color)}
  ${isActive ? 'shadow-2xl scale-[1.02]' : 'shadow-lg hover:shadow-xl'}
  ${isInteractive ? 'cursor-pointer hover:scale-[1.01]' : ''}
  transition-all duration-200 ease-out
  backdrop-blur-sm border border-white/30 hover:border-white/50
`}
style={{
  boxShadow: isActive
    ? `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px ${accentColor}33`
    : `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px ${accentColor}22`,
}}>
  {/* カード内容 */}
</div>
```
 
### カード設計原則
- **適切なサイズ**: `max-w-sm` (384px) で読みやすさ重視
- **rounded-2xl**: 16pxの大きな角丸でモダン感
- **動的シャドウ**: アクティブ状態で影の強度を変更
- **カスタムボックスシャドウ**: アクセントカラーによる境界線効果
- **backdrop-blur-sm**: 背景のぼかし効果
- **レスポンシブ**: モバイルでのタッチ操作考慮
 
### マイクロインタラクションボタン
```tsx
<button className="
  group p-2 rounded-xl bg-white/40 hover:bg-white/60
  backdrop-blur-sm border border-white/30 hover:border-white/50
  transition-all duration-200 hover:scale-110
  shadow-sm hover:shadow-md
">
  <Icon className="w-4 h-4 text-gray-700 group-hover:text-gray-900 transition-colors" />
</button>
```
 
### ボタン設計原則
- **Glassmorphism**: `bg-white/40` + `backdrop-blur-sm`
- **スケール変化**: `hover:scale-110` で反応性向上
- **グループホバー**: `group` + `group-hover:` でアイコン連動
- **段階的透明度**: `bg-white/40` → `hover:bg-white/60`
 
## セレクター・ピッカーデザイン
 
### グリッドセレクター
```tsx
<div className="selector-panel absolute top-16 left-0 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-3 border border-white/30 z-20">
  <div className="grid grid-cols-4 gap-2">
    {OPTIONS.map((option) => (
      <button
        className={`
          w-10 h-10 rounded-xl ${option.class}
          border-2 transition-all duration-200
          hover:scale-110 hover:shadow-lg cursor-pointer
          ${isSelected ? 'border-gray-600 scale-110 shadow-lg' : 'border-white/50 hover:border-gray-300'}
        `}
        title={option.name}
      >
        {option.icon && <Icon className="w-5 h-5" />}
      </button>
    ))}
  </div>
</div>
```
 
### セレクター設計原則
- **4列グリッド**: オプションを整理された形で表示
- **選択状態**: 現在の選択を`scale-110 + shadow-lg`で強調
- **ホバー効果**: `hover:scale-110 hover:shadow-lg`
- **アイコン対応**: テキストとアイコン両方に対応
- **高z-index**: `z-20`で他要素より前面表示
- **アクセシビリティ**: `title`属性でツールチップ提供
 
## アニメーション設計
 
### トランジション統一
```css
transition-all duration-200 ease-out  /* 基本 */
transition-transform duration-300     /* アイコン回転 */
transition-colors                     /* 色変化 */
```
 
### アニメーション原則
- **統一duration**: 200ms（基本）、300ms（特殊効果）
- **ease-out**: 自然な減速カーブ
- **transform優先**: パフォーマンス重視でtransformプロパティ使用
- **hover時反応**: 即座の視覚的フィードバック
 
## 空状態デザイン
 
### 中央配置レイアウト
```tsx
<div className="flex flex-col items-center justify-center h-full relative z-10">
  <div className="text-center max-w-2xl mx-auto px-6">
    {/* 装飾アイコン */}
    <div className="mb-8 relative">
      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-xl">
        <Icon className="w-16 h-16 text-blue-500" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse" />
    </div>
 
    {/* グラデーションタイトル */}
    <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
      メインメッセージ
    </h2>
 
    {/* 機能紹介グリッド */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {/* 各カード */}
    </div>
  </div>
</div>
```
 
### 空状態設計原則
- **中央配置**: `flex items-center justify-center h-full`
- **装飾要素**: アニメーション付きドット装飾
- **グラデーションテキスト**: `bg-clip-text text-transparent`
- **3列グリッド**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` でレスポンシブ対応
 
## レスポンシブ設計
 
### ブレークポイント戦略
```css
/* モバイル優先 */
className="grid-cols-1 md:grid-cols-3"  /* 1列→3列 */
className="px-4 md:px-6"                /* パディング調整 */
className="text-2xl md:text-4xl"        /* テキストサイズ */
className="gap-2 md:gap-4"              /* ギャップ調整 */
```
 
### レスポンシブ原則
- **モバイルファースト**: 小画面から設計開始
- **mdブレークポイント**: 768px以上で変更
- **段階的拡張**: パディング、テキスト、レイアウトを段階的に調整
 
## パフォーマンス考慮事項
 
### 最適化手法
- **backdrop-filter**: `backdrop-blur-sm/xl` は適度に使用
- **transform使用**: `scale`、`rotate` でGPU加速
- **will-change回避**: 必要時のみ適用
- **グラデーション**: CSS変数で再利用性向上
 
### パフォーマンス原則
- **60fps維持**: アニメーションはtransformとopacityを中心に
- **レイヤー分離**: 重要な要素は適切なz-indexで管理
- **メモリ効率**: 不要なblur効果は避ける
 
## 実装チェックリスト
 
### デザインシステム適用確認
- [ ] **カラーシステム**: 8色グラデーションパレット構成
- [ ] **背景デザイン**: 3層構造（ベース + 装飾2層）
- [ ] **ヘッダー**: Glassmorphism仕様で実装
- [ ] **ボタン**: 全てマイクロインタラクション対応
- [ ] **カードコンポーネント**: 動的シャドウ・ホバー効果
- [ ] **アニメーション**: 200ms/300ms統一タイミング
- [ ] **空状態画面**: 魅力的なウェルカム画面
- [ ] **レスポンシブ**: モバイルファースト（1列→3列グリッド）
 
### 技術品質確認
- [ ] **TypeScript**: 型安全性・any型なし
- [ ] **ESLint**: コード品質基準クリア
- [ ] **テスト**: 主要機能のテストカバレッジ
- [ ] **ビルド**: 本番環境でのエラーなし
- [ ] **パフォーマンス**: Core Web Vitals目標値達成
 
### UX/アクセシビリティ確認
- [ ] **ホバー状態**: 全インタラクティブ要素に実装
- [ ] **クリックしてアクションが起きる要素のホバー時反応**: たとえばリンクやボタンはホバー時に cursor-pointer や濃い影を付与
- [ ] **フォーカス管理**: キーボードナビゲーション対応
- [ ] **コントラスト比**: WCAG 2.1 AA準拠
- [ ] **タッチデバイス**: 適切なタップターゲットサイズ
- [ ] **レスポンシブ**: 各ブレークポイントでの表示確認
- [ ] **ローディング**: 60fps維持・スムーズなアニメーション
 
### プロダクション準備確認
- [ ] **データ永続化**: localStorage動作確認
- [ ] **エラーハンドリング**: 適切なエラー処理
- [ ] **SEO対応**: メタタグ・構造化データ
- [ ] **PWA対応**: マニフェスト・サービスワーカー（オプション）
- [ ] **デプロイ**: 静的ホスティング環境での動作確認