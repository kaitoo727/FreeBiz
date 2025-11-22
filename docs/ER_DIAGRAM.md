# データベースER図

## エンティティ関係図

```
┌─────────────┐
│ auth.users  │ (Supabase Auth)
└──────┬──────┘
       │
       │ 1:1
       ▼
┌──────────────────┐
│ user_profiles    │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ business_type    │
│ business_name    │
│ tax_filing_type  │
│ is_side_business │
│ salary_income    │
└──────────────────┘
       │
       │ 1:N
       ├─────────────────┬─────────────────┬─────────────────┐
       │                 │                 │                 │
       ▼                 ▼                 ▼                 ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ revenues    │  │ expenses    │  │ inventories │  │ projects    │
├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤
│ id (PK)     │  │ id (PK)     │  │ id (PK)     │  │ id (PK)     │
│ user_id(FK) │  │ user_id(FK) │  │ user_id(FK) │  │ user_id(FK) │
│ amount      │  │ amount      │  │ product_name│  │ client_name │
│ date        │  │ date        │  │ sku         │  │ project_name│
│ category    │  │ category    │  │ cost        │  │ unit_price  │
│ description │  │ description │  │ unit_price  │  │ work_date   │
│ platform    │  │ receipt_url │  │ quantity    │  │ payment_*   │
│ item_id     │  │ is_depr     │  └─────────────┘  └─────────────┘
│ project_id  │  └─────────────┘
└─────────────┘
       │                 │
       │                 │
       └────────┬────────┘
                │
                │ N:1
                ▼
       ┌──────────────────┐
       │ journal_entries  │
       ├──────────────────┤
       │ id (PK)          │
       │ user_id (FK)     │
       │ date             │
       │ debit_account    │
       │ credit_account   │
       │ amount           │
       │ description      │
       │ revenue_id (FK)  │
       │ expense_id (FK)  │
       └──────────────────┘
```

## テーブル詳細

### user_profiles
ユーザーの事業プロファイル情報

- `business_type`: 事業タイプ（retail, service, creative, consulting, custom）
- `tax_filing_type`: 申告タイプ（blue, white）
- `is_side_business`: 副業かどうか
- `salary_income`: 給与所得（副業の場合）

### revenues
売上記録

- `platform`: プラットフォーム名（物販の場合）
- `item_id`: 商品ID（物販の場合）
- `project_id`: 案件ID（サービス・クリエイターの場合）

### expenses
経費記録

- `receipt_image_url`: 領収書画像URL
- `is_depreciation`: 減価償却対象かどうか

### inventories
在庫管理（物販向け）

- `product_name`: 商品名
- `sku`: SKUコード
- `cost`: 原価
- `unit_price`: 単価
- `quantity`: 在庫数

### projects
案件管理（サービス・クリエイター向け）

- `client_name`: 取引先名
- `project_name`: 案件名
- `unit_price`: 単価
- `work_date`: 作業日
- `payment_status`: 入金状況
- `payment_date`: 入金日

### journal_entries
仕訳帳（複式簿記）

- `debit_account`: 借方科目
- `credit_account`: 貸方科目
- `revenue_id`: 関連する売上ID
- `expense_id`: 関連する経費ID

