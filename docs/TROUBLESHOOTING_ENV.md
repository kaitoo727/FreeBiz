# 環境変数のトラブルシューティング

## 環境変数が読み込まれない場合の対処法

### 1. ファイルの場所を確認

`.env.local`ファイルは、`package.json`と同じフォルダに配置する必要があります。

```
FreeBiz/
├── package.json          ← ここと同じフォルダ
├── .env.local           ← ここに配置
├── app/
├── lib/
└── ...
```

### 2. ファイル名を確認

- ✅ 正しい: `.env.local`
- ❌ 間違い: `.env`
- ❌ 間違い: `.env.local.txt`
- ❌ 間違い: `env.local`

Windowsでドットで始まるファイルを作成する方法：
- VS Code: 新規ファイルを作成して `.env.local` と入力して保存
- メモ帳: 「名前を付けて保存」で、ファイル名を `.env.local` にして、種類を「すべてのファイル (*.*)」に変更

### 3. ファイルの内容を確認

正しい形式：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=
```

**よくある間違い**：

❌ 等号の前後にスペースがある
```env
NEXT_PUBLIC_SUPABASE_URL = https://...
```

❌ 値に引用符がある
```env
NEXT_PUBLIC_SUPABASE_URL="https://..."
```

❌ 変数名が間違っている
```env
SUPABASE_URL=...  ← NEXT_PUBLIC_が必要
```

❌ コメントが変数と同じ行にある
```env
NEXT_PUBLIC_SUPABASE_URL=https://... # コメント  ← これは問題ないが、念のため別行に
```

### 4. 開発サーバーの再起動

環境変数を変更した後は、**必ず開発サーバーを再起動**してください。

1. ターミナルで `Ctrl+C` を押してサーバーを停止
2. `npm run dev` を実行して再起動

### 5. デバッグ方法

ブラウザで以下のURLにアクセスして、環境変数が読み込まれているか確認：

```
http://localhost:3003/debug-env
```

（ポート番号は実際に使用されているものを使用）

### 6. ファイルのエンコーディング

`.env.local`ファイルはUTF-8エンコーディングで保存してください。

- VS Code: 右下のエンコーディング表示を確認（UTF-8であること）
- メモ帳: 「名前を付けて保存」で、エンコーディングを「UTF-8」に設定

### 7. キャッシュのクリア

環境変数が読み込まれない場合、Next.jsのキャッシュをクリアしてみてください：

```bash
# .nextフォルダを削除
rm -rf .next

# Windows PowerShellの場合
Remove-Item -Recurse -Force .next

# その後、開発サーバーを再起動
npm run dev
```

### 8. 環境変数の確認コマンド

PowerShellで環境変数を確認：

```powershell
# .env.localファイルの内容を表示（機密情報なので注意）
Get-Content .env.local
```

### 9. よくある問題と解決方法

#### 問題: 環境変数が空文字列として読み込まれる

**原因**: 値の前後にスペースがある可能性

**解決方法**: `.env.local`ファイルを開いて、等号の前後と値の前後にスペースがないか確認

#### 問題: 一部の環境変数だけ読み込まれない

**原因**: ファイルの形式が間違っている可能性

**解決方法**: 
1. `.env.local`ファイルを開く
2. 各行が正しい形式か確認
3. 改行コードが正しいか確認（LF推奨）

#### 問題: 開発サーバーを再起動しても反映されない

**解決方法**:
1. 開発サーバーを完全に停止（Ctrl+C）
2. `.next`フォルダを削除
3. 再度 `npm run dev` を実行

### 10. 確認チェックリスト

- [ ] `.env.local`ファイルが`package.json`と同じフォルダにある
- [ ] ファイル名が正確（`.env.local`）
- [ ] 環境変数名が正確（`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`）
- [ ] 値に余分なスペースや引用符がない
- [ ] 開発サーバーを再起動した
- [ ] ファイルがUTF-8エンコーディングで保存されている

## それでも解決しない場合

1. `/debug-env`ページで環境変数の状態を確認
2. ブラウザのコンソールでエラーメッセージを確認
3. ターミナルのエラーメッセージを確認
4. `.env.local`ファイルの内容を再確認（値が正しくコピーされているか）


