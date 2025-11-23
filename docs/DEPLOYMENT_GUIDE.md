# デプロイガイド

## 概要

FreeBizアプリを本番環境にデプロイする方法を説明します。Vercelを使用したデプロイを推奨します。

## Vercelへのデプロイ（推奨）

### 前提条件

- GitHubアカウント
- Vercelアカウント（無料）
- Supabaseプロジェクト（本番環境用）

### ステップ1: GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 新しいリポジトリを作成
3. リポジトリ名を入力（例: `freebiz`）
4. 「Create repository」をクリック

### ステップ2: コードをGitHubにプッシュ

```bash
# Gitの初期化（まだの場合）
git init

# リモートリポジトリを追加
git remote add origin https://github.com/your-username/freebiz.git

# ファイルを追加
git add .

# コミット
git commit -m "Initial commit"

# プッシュ
git push -u origin main
```

### ステップ3: Vercelでプロジェクトを作成

1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」でGitHubアカウントでサインアップ
3. 「Add New Project」をクリック
4. 作成したGitHubリポジトリを選択
5. 「Import」をクリック

### ステップ4: 環境変数の設定

Vercelのプロジェクト設定画面で、以下のいずれかの方法で環境変数を設定：

#### 方法1: .envファイルをインポート（推奨）

1. 「Environment Variables」セクションを開く
2. 「.env」タブをクリック
3. ローカルの`.env.local`ファイルの内容をコピーして貼り付け
   - または「Upload .env file」ボタンでファイルをアップロード
4. 「Save」をクリック

**注意**: `.env.local`ファイルには実際の値が入力されている必要があります。

#### 方法2: 手動で入力

1. 「Environment Variables」セクションを開く
2. 以下の変数を1つずつ追加：

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
OPENAI_API_KEY = your_openai_api_key（オプション）
```

3. 各変数の右側で「Production」「Preview」「Development」すべてにチェックを入れる
4. 「Save」をクリック

### ステップ5: デプロイ

1. 「Deploy」をクリック
2. ビルドが完了するまで待つ（数分）
3. デプロイが完了すると、URLが表示されます（例: `https://freebiz.vercel.app`）

## その他のデプロイ方法

### Netlify

1. [Netlify](https://www.netlify.com)にサインアップ
2. 「Add new site」→「Import an existing project」
3. GitHubリポジトリを選択
4. ビルド設定：
   - Build command: `npm run build`
   - Publish directory: `.next`
5. 環境変数を設定
6. 「Deploy site」をクリック

### その他のホスティングサービス

- **Railway**: [railway.app](https://railway.app)
- **Render**: [render.com](https://render.com)
- **Fly.io**: [fly.io](https://fly.io)

## 本番環境での注意事項

### 1. 環境変数の管理

- `.env.local`ファイルはGitにコミットしない（`.gitignore`に含まれています）
- 本番環境では、ホスティングサービスの環境変数設定を使用

### 2. Supabaseの設定

- 本番環境用のSupabaseプロジェクトを作成することを推奨
- または、開発環境のSupabaseプロジェクトを使用（無料プランの制限に注意）

### 3. メール確認の設定

本番環境では、セキュリティのためメール確認を有効にすることを推奨：

1. Supabaseダッシュボード → Authentication → Settings
2. 「Enable email confirmations」を有効にする
3. メールテンプレートをカスタマイズ（オプション）

### 4. カスタムドメインの設定（オプション）

Vercelでカスタムドメインを設定：

1. Vercelダッシュボード → Settings → Domains
2. ドメインを追加
3. DNS設定を更新

## トラブルシューティング

### ビルドエラー

- 環境変数が正しく設定されているか確認
- `npm run build`をローカルで実行してエラーを確認

### 環境変数が読み込まれない

- 環境変数名が正しいか確認（`NEXT_PUBLIC_`で始まる）
- デプロイ後に環境変数を追加した場合、再デプロイが必要

### Supabase接続エラー

- 本番環境のSupabase URLとキーが正しいか確認
- Supabaseプロジェクトがアクティブか確認

## 継続的デプロイ（CI/CD）

GitHubにプッシュするたびに自動デプロイされるように設定：

1. Vercelで「Settings」→「Git」を開く
2. 「Production Branch」を設定（通常は`main`）
3. プッシュするたびに自動デプロイされます

## パフォーマンス最適化

### 画像の最適化

Next.jsの`Image`コンポーネントを使用（今後実装）

### キャッシュの設定

Vercelでは自動でキャッシュが設定されます

## セキュリティ

- 環境変数は絶対にGitにコミットしない
- `service_role` keyは絶対に公開しない
- HTTPSを使用（Vercelでは自動で有効）

## 次のステップ

デプロイ後：

1. 本番環境のURLでアプリにアクセス
2. 新規登録でアカウントを作成
3. 機能をテスト
4. カスタムドメインを設定（オプション）

