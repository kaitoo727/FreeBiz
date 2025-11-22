# 環境変数設定のステップバイステップガイド

## 問題: 環境変数が読み込まれない

`.env.local`ファイルに値が入力されていない場合、環境変数は読み込まれません。

## 解決方法

### ステップ1: SupabaseのURLとキーを取得

1. [Supabase](https://supabase.com)にログイン
2. プロジェクトを選択
3. 左メニューから「Settings」（⚙️）をクリック
4. 「API」をクリック
5. 以下をコピー：
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co` のような形式
   - **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` のような長い文字列

### ステップ2: .env.localファイルを編集

1. プロジェクトルート（`FreeBiz`フォルダ）で`.env.local`ファイルを開く
2. 以下の形式で、**実際の値**を入力：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=
```

**重要**:
- `https://xxxxxxxxxxxxx.supabase.co` を、ステップ1でコピーした**実際のURL**に置き換える
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` を、ステップ1でコピーした**実際のキー**に置き換える
- 等号（`=`）の前後にスペースを入れない
- 値に引用符（`"`や`'`）を付けない

### ステップ3: ファイルを保存

1. ファイルを保存（Ctrl+S）
2. エディタを閉じる

### ステップ4: 開発サーバーを再起動

1. ターミナルで `Ctrl+C` を押して開発サーバーを停止
2. `npm run dev` を実行して再起動
3. 警告が消えていることを確認

## 確認方法

### 方法1: ターミナルで確認

開発サーバーを起動したとき、以下のような警告が**表示されない**ことを確認：

```
⚠️ Supabase環境変数が設定されていません
```

### 方法2: デバッグページで確認

ブラウザで以下にアクセス：
```
http://localhost:3003/debug-env
```

両方の環境変数が「✅ 設定されています」と表示されることを確認。

## よくある間違い

### ❌ 間違い1: 値が空

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

→ 実際の値を入力する必要があります

### ❌ 間違い2: プレースホルダーのまま

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

→ 実際の値に置き換える必要があります

### ❌ 間違い3: 等号の前後にスペース

```env
NEXT_PUBLIC_SUPABASE_URL = https://...
```

→ スペースを削除してください

### ❌ 間違い4: 値に引用符

```env
NEXT_PUBLIC_SUPABASE_URL="https://..."
```

→ 引用符を削除してください

## 正しい例

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTIzNDU2MywiZXhwIjoxOTYwODEwNTYzfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=
```

## それでも解決しない場合

1. `.env.local`ファイルを削除
2. 新しく`.env.local`ファイルを作成
3. 上記の正しい形式で値を入力
4. ファイルを保存
5. 開発サーバーを再起動

