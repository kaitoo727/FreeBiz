# セットアップガイド

## 前提条件

- Node.js 18以上
- npm または yarn
- Supabaseアカウント
- OpenAI APIキー（AI分類機能を使用する場合）

## 1. プロジェクトのセットアップ

### 依存関係のインストール

```bash
npm install
```

## 2. Supabaseのセットアップ

### 2.1 Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAnon Keyを取得

### 2.2 データベーススキーマの適用

1. Supabaseダッシュボードの「SQL Editor」を開く
2. `supabase/schema.sql`の内容をコピーして実行
3. `supabase/storage-setup.sql`の内容をコピーして実行

### 2.3 ストレージバケットの作成

1. Supabaseダッシュボードの「Storage」を開く
2. 「Create bucket」をクリック
3. バケット名: `receipts`
4. Public bucket: ON

## 3. 環境変数の設定

`.env.local`ファイルをプロジェクトルートに作成：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

## 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## 5. 初回起動時の確認事項

1. ログイン画面が表示されることを確認
2. 新規登録でアカウントを作成
3. オンボーディングが正常に動作することを確認
4. ダッシュボードが表示されることを確認

## トラブルシューティング

### Supabase接続エラー

- 環境変数が正しく設定されているか確認
- Supabaseプロジェクトがアクティブか確認
- RLSポリシーが正しく設定されているか確認

### OCR機能が動作しない

- Tesseract.jsはブラウザで動作しますが、初回読み込みに時間がかかります
- より高精度なOCRが必要な場合は、Google Vision API等への移行を検討

### AI分類が動作しない

- OpenAI APIキーが正しく設定されているか確認
- APIキーに十分なクレジットがあるか確認

## 本番環境へのデプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

### 環境変数の設定（本番）

Vercelダッシュボードの「Settings」→「Environment Variables」で以下を設定：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

## 次のステップ

- [開発ロードマップ](./DEVELOPMENT_ROADMAP.md)を確認
- [API仕様書](./API_SPEC.md)を参照
- [UIワイヤーフレーム](./UI_WIREFRAME.md)を確認

