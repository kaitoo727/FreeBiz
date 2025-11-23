# OpenAIエラーの修正方法

## 問題
ブラウザで以下のエラーが発生：
```
It looks like you're running in a browser-like environment.
This is disabled by default, as it risks exposing your secret API credentials to attackers.
```

## 原因
OpenAIパッケージがクライアントバンドルに含まれていたため、ブラウザで実行されようとしていました。

## 修正内容
1. OpenAI APIをサーバーサイド（API Route）に移動
2. `next.config.js`でOpenAIをクライアントバンドルから除外

## 解決方法

### ローカル開発環境の場合

1. **開発サーバーを停止**（Ctrl+C）

2. **ビルドキャッシュをクリア**
   ```powershell
   # .nextフォルダを削除
   Remove-Item -Recurse -Force .next
   ```

3. **開発サーバーを再起動**
   ```powershell
   npm run dev
   ```

### Vercelにデプロイしている場合

1. **変更をGitにコミット**
   ```powershell
   git add .
   git commit -m "Fix: OpenAI APIをサーバーサイドに移動"
   git push
   ```

2. **Vercelが自動的に再デプロイ**します
   - Vercelのダッシュボードでデプロイ状況を確認
   - デプロイが完了するまで数分待つ

3. **ブラウザで強制リロード**
   - `Ctrl+Shift+R`（Windows）または `Cmd+Shift+R`（Mac）

## 確認方法

1. ブラウザの開発者ツール（F12）を開く
2. Consoleタブでエラーが消えているか確認
3. 経費登録ページが正常に表示されるか確認
4. OCR機能をテスト（領収書画像をアップロード）

## トラブルシューティング

### まだエラーが表示される場合

1. **ブラウザのキャッシュをクリア**
   - `Ctrl+Shift+Delete`でキャッシュをクリア
   - または、シークレットモードで開く

2. **Vercelの環境変数を確認**
   - Vercelダッシュボード → プロジェクト設定 → Environment Variables
   - `OPENAI_API_KEY`が設定されているか確認

3. **ビルドログを確認**
   - Vercelダッシュボード → Deployments → 最新のデプロイ → Build Logs
   - エラーがないか確認

## 技術的な詳細

### 変更前
- `lib/ai-classification.ts`でOpenAIを直接使用（クライアントサイド）
- APIキーがブラウザに露出する危険性

### 変更後
- `app/api/ai/classify-expense/route.ts`でOpenAIを使用（サーバーサイド）
- `lib/ai-classification.ts`はAPI Routeを呼び出すだけ
- APIキーはサーバーサイドのみで使用（安全）

