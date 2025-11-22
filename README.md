# FreeBiz - 個人事業主向け会計・確定申告アプリ

## 概要

個人事業主向けの会計・確定申告を自動化するアプリケーションです。
事業タイプ（物販、サービス業、クリエイティブ、コンサルなど）に応じてUIが自動切り替えされ、
初心者でも簡単に会計管理と確定申告ができるよう設計されています。

## 主な機能

- 事業タイプ別の自動UI切り替え
- 売上管理（手入力・CSV・API連携）
- 経費・領収書管理（OCR・AI分類）
- 在庫・仕入れ管理（物販向け）
- 案件管理（クリエイター・サービス向け）
- 青色申告・白色申告の自動書類生成
- 税金シミュレーター
- 副業バレ防止チェック
- ダッシュボード

## 技術スタック

- **フロントエンド**: Next.js 14, React, TypeScript, Tailwind CSS
- **バックエンド**: Supabase
- **データベース**: PostgreSQL
- **AI**: OpenAI API
- **OCR**: Tesseract.js
- **グラフ**: Recharts

## セットアップ

詳細なセットアップ手順は [セットアップガイド](./docs/SETUP_GUIDE.md) を参照してください。

### クイックスタート

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
`.env.local`ファイルを作成し、以下を設定：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

3. Supabaseデータベースのセットアップ
   - Supabaseプロジェクトを作成
   - `supabase/schema.sql`を実行
   - `supabase/storage-setup.sql`を実行

4. 開発サーバーの起動
```bash
npm run dev
```

## プロジェクト構造

```
freebiz/
├── app/                    # Next.js App Router
│   ├── auth/              # 認証ページ
│   ├── dashboard/         # ダッシュボード
│   ├── onboarding/        # オンボーディング
│   ├── revenues/          # 売上管理
│   ├── expenses/          # 経費管理
│   ├── inventory/         # 在庫管理（物販向け）
│   ├── projects/          # 案件管理（サービス向け）
│   ├── tax-simulation/    # 税金シミュレーター
│   └── tax-documents/     # 確定申告書類
├── components/             # Reactコンポーネント
├── lib/                    # ユーティリティ・設定
│   ├── supabase.ts        # Supabaseクライアント
│   ├── business-type-config.ts  # 事業タイプ設定
│   ├── ai-classification.ts    # AI分類
│   ├── ocr.ts             # OCR処理
│   ├── tax-calculation.ts # 税金計算
│   └── tax-documents.ts   # 確定申告書類生成
├── types/                  # TypeScript型定義
├── supabase/              # Supabase設定・マイグレーション
│   ├── schema.sql         # データベーススキーマ
│   └── storage-setup.sql  # ストレージ設定
└── docs/                  # ドキュメント
    ├── SETUP_GUIDE.md     # セットアップガイド
    ├── API_SPEC.md        # API仕様書
    ├── ER_DIAGRAM.md      # ER図
    ├── UI_WIREFRAME.md    # UIワイヤーフレーム
    ├── AI_PROMPT_TEMPLATES.md  # AIプロンプトテンプレート
    ├── BUSINESS_TYPE_LOGIC.md  # 事業タイプ分岐ロジック
    └── DEVELOPMENT_ROADMAP.md  # 開発ロードマップ
```

## ドキュメント

- [セットアップガイド](./docs/SETUP_GUIDE.md) - 詳細なセットアップ手順
- [API仕様書](./docs/API_SPEC.md) - APIエンドポイントの詳細
- [ER図](./docs/ER_DIAGRAM.md) - データベース設計
- [UIワイヤーフレーム](./docs/UI_WIREFRAME.md) - 画面設計
- [事業タイプ分岐ロジック](./docs/BUSINESS_TYPE_LOGIC.md) - UI分岐の実装詳細
- [AIプロンプトテンプレート](./docs/AI_PROMPT_TEMPLATES.md) - AI分類用プロンプト
- [開発ロードマップ](./docs/DEVELOPMENT_ROADMAP.md) - 今後の開発計画

## 主な機能の詳細

### 事業タイプ別UI切り替え

ユーザーが選択した事業タイプ（物販、サービス業、クリエイティブ、コンサル、その他）に応じて、表示する機能が自動的に切り替わります。

- **物販**: 在庫管理、プラットフォーム連携
- **サービス業・クリエイティブ・コンサル**: 案件管理
- **その他**: 基本的な売上・経費管理のみ

詳細は [事業タイプ分岐ロジック](./docs/BUSINESS_TYPE_LOGIC.md) を参照。

### AI分類機能

領収書の画像をアップロードすると、OCRでテキストを抽出し、AIが自動で科目を分類します。

### 青色申告対応

青色申告を選択した場合、売上・経費の登録時に自動で複式簿記の仕訳が生成されます。

### 税金シミュレーター

売上と経費を入力すると、所得税・住民税・個人事業税・消費税を自動計算し、納税額をシミュレーションできます。

### 副業バレ防止チェック

副業として事業を行っている場合、バレ防止のためのチェック項目を表示します。

## デプロイ

詳細なデプロイ手順は [デプロイガイド](./docs/DEPLOYMENT_GUIDE.md) を参照してください。

### Vercelへのデプロイ（推奨）

1. GitHubリポジトリにコードをプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

詳しくは [デプロイガイド](./docs/DEPLOYMENT_GUIDE.md) を参照してください。

## ライセンス

MIT

