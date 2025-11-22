# 環境変数の取得方法ガイド

## 概要

このガイドでは、FreeBizアプリで使用する環境変数の取得方法を詳しく説明します。

## 必要な環境変数

1. `NEXT_PUBLIC_SUPABASE_URL` - SupabaseプロジェクトのURL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabaseの公開認証キー
3. `OPENAI_API_KEY` - OpenAI APIキー（オプション、AI分類機能を使用する場合のみ）

---

## 1. Supabase環境変数の取得方法

### ステップ1: Supabaseアカウントの作成

1. ブラウザで [https://supabase.com](https://supabase.com) にアクセス
2. 右上の「Start your project」または「Sign in」をクリック
3. GitHubアカウント、Googleアカウント、またはメールアドレスでサインアップ/サインイン

### ステップ2: プロジェクトの作成

1. ダッシュボードで「New Project」をクリック
2. 以下の情報を入力：
   - **Project Name**: 任意の名前（例: `freebiz`、`my-business-app`）
   - **Database Password**: 強力なパスワードを設定
     - 12文字以上
     - 大文字・小文字・数字・記号を含む
     - **重要**: このパスワードは後で確認できないため、安全な場所に保存してください
   - **Region**: 最寄りのリージョンを選択
     - 日本からは「Northeast Asia (Tokyo)」が最適
     - その他のアジア地域も選択可能
   - **Pricing Plan**: Freeプランを選択（無料）
3. 「Create new project」をクリック
4. プロジェクトの作成完了を待つ（1-2分）

### ステップ3: 環境変数の取得

1. **プロジェクトダッシュボードに移動**
   - プロジェクトが作成されると、自動的にプロジェクトダッシュボードが表示されます
   - もし他の画面にいる場合は、左上のプロジェクト名をクリックして選択

2. **Settings（設定）を開く**
   - 左側のメニューから「Settings」（⚙️アイコン）をクリック
   - または、左下の「Settings」をクリック

3. **API設定を開く**
   - Settingsメニューの中から「API」をクリック
   - または、Settingsページの「API Settings」セクションを探す

4. **Project URLをコピー**
   - 「Project URL」というセクションを探す
   - URLは以下のような形式です：
     ```
     https://xxxxxxxxxxxxx.supabase.co
     ```
   - 「Copy」ボタンをクリックするか、URLを選択してコピー（Ctrl+C）
   - この値が `NEXT_PUBLIC_SUPABASE_URL` になります

5. **anon public keyをコピー**
   - 「Project API keys」セクションを探す
   - 複数のキーが表示されます：
     - **anon** `public` - これを使用します（公開しても安全）
     - **service_role** `secret` - **絶対に公開しないでください**
   - **anon** `public` の右側にある「Copy」ボタンをクリック
   - または、キーを選択してコピー（Ctrl+C）
   - キーは以下のような長い文字列です：
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTIzNDU2MywiZXhwIjoxOTYwODEwNTYzfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   - この値が `NEXT_PUBLIC_SUPABASE_ANON_KEY` になります

### ステップ4: .env.localファイルに設定

1. **プロジェクトルートに移動**
   - `FreeBiz`フォルダを開く
   - エクスプローラーで `C:\Users\tennt\OneDrive\ドキュメント\FreeBiz` に移動

2. **.env.localファイルを作成**
   - エディタ（VS Code、メモ帳など）で新規ファイルを作成
   - ファイル名を `.env.local` にする
     - **重要**: ファイル名は `.env.local` で、拡張子はありません
     - Windowsでファイル名にドットで始まるファイルを作成する場合：
       - VS Code: 新規ファイルを作成して `.env.local` と保存
       - メモ帳: 「名前を付けて保存」でファイル名を `.env.local` にして、種類を「すべてのファイル」に変更

3. **環境変数を記述**
   - 以下の形式で記述します：
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     OPENAI_API_KEY=
     ```
   - **注意事項**:
     - 各変数の後にスペースを入れない
     - 値に引用符（`"`や`'`）を付けない
     - 等号（`=`）の前後にスペースを入れない
     - 各変数は1行で記述する

4. **実際の値に置き換える**
   - `https://xxxxxxxxxxxxx.supabase.co` を、ステップ3でコピーした実際のURLに置き換える
   - `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` を、ステップ3でコピーした実際のキーに置き換える

5. **ファイルを保存**
   - ファイルを保存（Ctrl+S）

### ステップ5: 設定の確認

1. **ファイルの場所を確認**
   - `.env.local`ファイルが`package.json`と同じフォルダにあることを確認

2. **ファイル内容を確認**
   - ファイルを開いて、値が正しく設定されているか確認
   - URLは `https://` で始まることを確認
   - キーは長い文字列であることを確認

---

## 2. OpenAI APIキーの取得方法（オプション）

AI分類機能（領収書の自動分類など）を使用する場合のみ必要です。使用しない場合は空欄のままで問題ありません。

### ステップ1: OpenAIアカウントの作成

1. [https://platform.openai.com](https://platform.openai.com) にアクセス
2. 「Sign up」をクリックしてアカウントを作成
3. メールアドレスを確認

### ステップ2: APIキーの作成

1. ログイン後、右上のプロフィールアイコンをクリック
2. 「View API keys」をクリック
3. 「Create new secret key」をクリック
4. キー名を入力（例: `freebiz`）
5. 「Create secret key」をクリック
6. **重要**: 表示されたキーをコピーして安全な場所に保存
   - このキーは2度と表示されません

### ステップ3: .env.localに追加

`.env.local`ファイルに以下を追加：

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 3. 環境変数の設定例

完成した`.env.local`ファイルの例：

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTIzNDU2MywiZXhwIjoxOTYwODEwNTYzfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=
```

または、OpenAI APIキーも設定する場合：

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTIzNDU2MywiZXhwIjoxOTYwODEwNTYzfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 4. よくある質問

### Q: ファイル名が`.env.local`にならない

**A**: Windowsでは、ドットで始まるファイル名を作成するのが難しい場合があります。
- VS Codeを使用する場合: 新規ファイルを作成して `.env.local` と入力して保存
- メモ帳を使用する場合: 「名前を付けて保存」で、ファイル名を `.env.local` にして、種類を「すべてのファイル (*.*)」に変更

### Q: 環境変数を設定したのに、まだエラーが出る

**A**: 以下の点を確認してください：
1. ファイル名が正確か（`.env.local`で、`.env`ではない）
2. ファイルがプロジェクトルート（`package.json`と同じフォルダ）にあるか
3. 値に余分なスペースや引用符がないか
4. 開発サーバーを再起動したか（環境変数の変更は再起動が必要）

### Q: anon keyとservice_role keyの違いは？

**A**:
- **anon key**: クライアント側（ブラウザ）で使用。公開しても安全。これを使用します。
- **service_role key**: サーバー側でのみ使用。**絶対に公開しないでください**。クライアント側では使用しません。

### Q: 環境変数はGitにコミットしても大丈夫？

**A**: `.env.local`ファイルは`.gitignore`に含まれているため、Gitにコミットされません。これは正しい動作です。環境変数は機密情報のため、Gitにコミットしてはいけません。

---

## 5. 次のステップ

環境変数を設定したら：

1. 開発サーバーを再起動（`Ctrl+C`で停止 → `npm run dev`で再起動）
2. ブラウザでアプリにアクセス
3. 警告が消えていることを確認
4. 新規登録を試して動作確認

詳しくは [セットアップガイド](./SETUP_GUIDE.md) を参照してください。

