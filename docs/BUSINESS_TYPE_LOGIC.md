# 事業タイプ別UI分岐ロジック

## 概要

FreeBizでは、ユーザーが選択した事業タイプに応じて、表示する機能とUIが自動的に切り替わります。

## 事業タイプ一覧

1. **retail（物販）**
   - 在庫管理を表示
   - 売上にプラットフォーム・商品IDフィールドを表示
   - 案件管理は非表示

2. **service（サービス業）**
   - 案件管理を表示
   - 売上に案件IDフィールドを表示
   - 在庫管理は非表示

3. **creative（クリエイティブ）**
   - 案件管理を表示
   - 売上に案件IDフィールドを表示
   - 在庫管理は非表示

4. **consulting（コンサル）**
   - 案件管理を表示
   - 売上に案件IDフィールドを表示
   - 在庫管理は非表示

5. **custom（その他）**
   - 在庫管理・案件管理ともに非表示
   - 基本的な売上・経費管理のみ

## 実装詳細

### 設定ファイル

`lib/business-type-config.ts`で各事業タイプの設定を定義：

```typescript
export const businessTypeConfigs: Record<BusinessType, BusinessTypeConfig> = {
  retail: {
    showInventory: true,
    showProjects: false,
    revenueFields: {
      showPlatform: true,
      showItemId: true,
      showProjectId: false,
    },
    defaultCategories: ['商品販売', '手数料収入', 'その他'],
  },
  // ...
};
```

### 使用例

```typescript
import { businessTypeConfigs } from '@/lib/business-type-config';

const config = businessTypeConfigs[profile.business_type];

// 在庫管理を表示するか
if (config.showInventory) {
  // 在庫管理UIを表示
}

// 案件管理を表示するか
if (config.showProjects) {
  // 案件管理UIを表示
}

// 売上登録フォームでプラットフォームフィールドを表示するか
if (config.revenueFields.showPlatform) {
  // プラットフォーム選択を表示
}
```

## ダッシュボードでの分岐

`components/Dashboard.tsx`で事業タイプに応じたクイックアクションを表示：

```typescript
{config.showInventory && (
  <Link href="/inventory">
    在庫管理
  </Link>
)}

{config.showProjects && (
  <Link href="/projects">
    案件管理
  </Link>
)}
```

## 売上登録フォームでの分岐

`app/revenues/new/page.tsx`で事業タイプに応じたフィールドを表示：

```typescript
{config.revenueFields.showPlatform && (
  <div>
    <label>プラットフォーム</label>
    <select>...</select>
  </div>
)}

{config.revenueFields.showItemId && (
  <div>
    <label>商品ID</label>
    <input type="text" />
  </div>
)}
```

## カテゴリのデフォルト値

各事業タイプに応じたデフォルトカテゴリを設定：

- **物販**: 商品販売、手数料収入、その他
- **サービス業**: サービス提供、コンサルティング、その他
- **クリエイティブ**: デザイン、動画編集、Web制作、その他
- **コンサル**: コンサルティング、コーチング、その他
- **その他**: 売上、その他

## 拡張方法

新しい事業タイプを追加する場合：

1. `types/index.ts`の`BusinessType`に追加
2. `types/index.ts`の`BusinessTypeLabels`に日本語名を追加
3. `lib/business-type-config.ts`の`businessTypeConfigs`に設定を追加
4. 必要に応じてUIコンポーネントを更新

