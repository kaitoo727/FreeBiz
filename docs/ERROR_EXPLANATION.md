# Supabase環境変数エラーの詳細説明

## エラーの内容

ターミナルに表示されている警告：
```
⚠️ Supabase環境変数が設定されていません
⚠️ .env.localファイルに以下を設定してください:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## エラーの原因

### 1. 何が起きているか

このエラーは、**Supabase（データベース・認証サービス）への接続に必要な環境変数が設定されていない**ことを示しています。

### 2. なぜこのエラーが発生するのか

FreeBizアプリは、以下の機能でSupabaseを使用しています：

- **ユーザー認証**（ログイン・新規登録）
- **データベース**（売上、経費、在庫、案件などのデータ保存）
- **ストレージ**（領収書画像の保存）

これらの機能を使うには、SupabaseプロジェクトのURLと認証キーが必要です。これらは環境変数として設定する必要があります。

### 3. 現在の状態

現在、環境変数が設定されていないため：

- ✅ **アプリ自体は起動します**（エラーではなく警告）
- ❌ **Supabase機能は動作しません**（ログイン、データ保存など）
- ⚠️ **ダミー値が使用されています**（`https://dummy.supabase.co`）

## エラーの影響

### 動作しない機能

1. **ログイン・新規登録**
   - 「Failed to fetch」エラーが発生
   - 認証ができない

2. **データの保存・読み込み**
   - 売上、経費、在庫、案件などのデータが保存できない
   - ダッシュボードにデータが表示されない

3. **領収書画像のアップロード**
   - 画像を保存できない

### 動作する機能

- UIの表示
- フォームの入力
- 画面遷移（ただしデータは保存されない）

## 解決方法

### ステップ1: Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセス
2. アカウントを作成（無料）
3. 「New Project」をクリック
4. 以下を入力：
   - **Project Name**: 任意の名前（例: `freebiz`）
   - **Database Password**: 強力なパスワードを設定（忘れないように！）
   - **Region**: 最寄りのリージョンを選択（例: `Northeast Asia (Tokyo)`）
5. 「Create new project」をクリック
6. プロジェクトの作成完了を待つ（1-2分）

### ステップ2: 環境変数の取得

1. Supabaseダッシュボードで、作成したプロジェクトを開く
2. 左メニューの「Settings」（⚙️）をクリック
3. 「API」をクリック
4. 以下の値をコピー：
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co` のような形式
   - **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` のような長い文字列

### ステップ3: .env.localファイルの作成・編集

1. プロジェクトルート（`FreeBiz`フォルダ）に`.env.local`ファイルを作成
2. 以下の内容を記述：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=
```

**重要**：
- `NEXT_PUBLIC_SUPABASE_URL`には、ステップ2で取得した**Project URL**を貼り付け
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`には、ステップ2で取得した**anon public** keyを貼り付け
- `OPENAI_API_KEY`は、AI分類機能を使う場合のみ設定（空欄でも動作します）

### ステップ4: データベーススキーマの適用

1. Supabaseダッシュボードで「SQL Editor」を開く
2. 「New query」をクリック
3. `supabase/schema.sql`ファイルの内容をすべてコピー
4. SQL Editorに貼り付けて「Run」をクリック
5. 成功メッセージが表示されることを確認
6. 同様に、`supabase/storage-setup.sql`の内容も実行

### ステップ5: ストレージバケットの作成

1. Supabaseダッシュボードで「Storage」を開く
2. 「Create bucket」をクリック
3. 以下を設定：
   - **Name**: `receipts`
   - **Public bucket**: ON（チェックを入れる）
4. 「Create bucket」をクリック

### ステップ6: 開発サーバーの再起動

1. ターミナルで`Ctrl+C`を押して開発サーバーを停止
2. `npm run dev`を実行して再起動
3. 警告が消えていることを確認

## 確認方法

### 環境変数が正しく設定されているか確認

1. ターミナルで警告が表示されない
2. ブラウザでログイン画面にアクセス
3. 黄色の警告ボックスが表示されない
4. 新規登録を試みて、エラーが発生しない

### 動作確認

1. 新規登録でアカウントを作成
2. オンボーディングが正常に動作する
3. ダッシュボードが表示される
4. 売上や経費を登録できる

## よくある質問

### Q: 環境変数を設定したのに、まだエラーが出る

**A**: 以下の点を確認してください：
1. `.env.local`ファイルがプロジェクトルートにあるか
2. ファイル名が正確か（`.env.local`で、`.env`ではない）
3. 値に余分なスペースや引用符がないか
4. 開発サーバーを再起動したか

### Q: Supabaseは無料で使える？

**A**: はい、無料プランがあります。個人開発や小規模なプロジェクトには十分です。

### Q: 環境変数を設定しなくてもアプリは動く？

**A**: UIは表示されますが、認証やデータ保存などの機能は動作しません。

### Q: 他の人に環境変数を見せても大丈夫？

**A**: **anon public** keyは公開しても問題ありませんが、**service_role** keyは絶対に公開しないでください。

## トラブルシューティング

### エラー: "Invalid API key"

- `.env.local`のキーが正しくコピーされているか確認
- 余分なスペースや改行がないか確認

### エラー: "Failed to fetch"

- Supabaseプロジェクトがアクティブか確認（一時停止されていないか）
- インターネット接続を確認
- ブラウザのコンソールで詳細なエラーを確認

### エラー: "relation does not exist" または "relation 'projects' does not exist"

このエラーは、テーブルの作成順序の問題で発生します。`revenues`テーブルが`projects`テーブルを参照していますが、`projects`テーブルがまだ作成されていない場合に発生します。

**解決方法1: 既存のテーブルを削除して再作成**

1. Supabaseダッシュボードの「SQL Editor」を開く
2. `supabase/reset-schema.sql`の内容をコピーして実行（すべてのテーブルを削除）
3. その後、`supabase/schema.sql`を実行（修正済みの順序でテーブルを作成）

**解決方法2: 手動でテーブルを削除**

Supabaseダッシュボードの「Table Editor」で、以下の順序でテーブルを削除：
1. `journal_entries`
2. `revenues`
3. `expenses`
4. `inventories`
5. `projects`
6. `user_profiles`

その後、`supabase/schema.sql`を実行してください。

**注意**: 既存のデータがある場合、すべて削除されます。本番環境では使用しないでください。

## 次のステップ

環境変数を設定したら：

1. 新規登録でアカウントを作成
2. オンボーディングで事業タイプを選択
3. 売上や経費を登録して動作確認

詳しい使い方は [セットアップガイド](./SETUP_GUIDE.md) を参照してください。

