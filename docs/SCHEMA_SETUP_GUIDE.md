# Supabaseスキーマセットアップガイド

## 概要

このガイドでは、FreeBizアプリで使用するデータベーススキーマをSupabaseに適用する手順を説明します。

## 前提条件

- Supabaseプロジェクトが作成済み
- Supabaseダッシュボードにアクセスできる

## セットアップ手順

### ステップ1: 既存のテーブルを削除（初回セットアップの場合）

**注意**: 既存のデータがある場合、すべて削除されます。本番環境では使用しないでください。

1. Supabaseダッシュボードで「SQL Editor」を開く
2. 「New query」をクリック
3. `supabase/reset-schema.sql`ファイルの内容をすべてコピー
4. SQL Editorに貼り付けて「Run」ボタンをクリック
5. 成功メッセージが表示されることを確認

### ステップ2: データベーススキーマの作成

1. SQL Editorで「New query」をクリック（または新しいタブを開く）
2. `supabase/schema.sql`ファイルの内容をすべてコピー
3. SQL Editorに貼り付ける
4. 「Run」ボタンをクリック
5. 以下のメッセージが表示されることを確認：
   - `Success. No rows returned`
   - または各テーブルの作成成功メッセージ

### ステップ3: ストレージの設定

1. SQL Editorで「New query」をクリック
2. `supabase/storage-setup.sql`ファイルの内容をすべてコピー
3. SQL Editorに貼り付けて「Run」ボタンをクリック
4. 成功メッセージが表示されることを確認

### ステップ4: ストレージバケットの作成（GUI）

1. Supabaseダッシュボードで「Storage」を開く
2. 「Create bucket」をクリック
3. 以下を設定：
   - **Name**: `receipts`
   - **Public bucket**: ON（チェックを入れる）
4. 「Create bucket」をクリック

### ステップ5: テーブルの確認

1. Supabaseダッシュボードで「Table Editor」を開く
2. 以下のテーブルが作成されていることを確認：
   - `user_profiles`
   - `projects`
   - `revenues`
   - `expenses`
   - `inventories`
   - `journal_entries`

## テーブル構造の確認

各テーブルが正しく作成されているか確認するには、SQL Editorで以下を実行：

```sql
-- すべてのテーブル一覧を表示
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

## よくあるエラーと解決方法

### エラー: "relation 'projects' does not exist"

**原因**: テーブルの作成順序の問題

**解決方法**:
1. `supabase/reset-schema.sql`を実行してすべてのテーブルを削除
2. 修正済みの`schema.sql`を実行

### エラー: "permission denied for schema public"

**原因**: 権限の問題

**解決方法**:
- Supabaseのプロジェクトオーナーアカウントで実行しているか確認
- プロジェクトの設定を確認

### エラー: "relation already exists"

**原因**: テーブルが既に存在している

**解決方法**:
- `CREATE TABLE IF NOT EXISTS`を使用しているため、通常は問題ありません
- エラーが続く場合は、`reset-schema.sql`を実行してから再作成

## 次のステップ

スキーマのセットアップが完了したら：

1. `.env.local`ファイルにSupabaseの環境変数を設定
2. 開発サーバーを再起動
3. アプリで新規登録を試して動作確認

詳しくは [セットアップガイド](./SETUP_GUIDE.md) を参照してください。

