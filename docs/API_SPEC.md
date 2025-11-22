# API仕様書

## 概要

FreeBizアプリケーションのAPI仕様書です。Supabaseを使用したRESTful APIとリアルタイムサブスクリプションを提供します。

## 認証

すべてのAPIリクエストはSupabase Authを使用して認証されます。

```typescript
const { data: { session } } = await supabase.auth.getSession();
```

## エンドポイント

### ユーザープロファイル

#### GET /user_profiles
現在のユーザーのプロファイルを取得

```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId)
  .single();
```

#### POST /user_profiles
プロファイルを作成

```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .insert({
    user_id: userId,
    business_type: 'retail',
    tax_filing_type: 'blue',
    // ...
  });
```

#### PATCH /user_profiles
プロファイルを更新

```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .update({ business_name: '新しい事業名' })
  .eq('user_id', userId);
```

### 売上管理

#### GET /revenues
売上一覧を取得

```typescript
const { data, error } = await supabase
  .from('revenues')
  .select('*')
  .eq('user_id', userId)
  .gte('date', '2024-01-01')
  .lte('date', '2024-12-31')
  .order('date', { ascending: false });
```

#### POST /revenues
売上を登録

```typescript
const { data, error } = await supabase
  .from('revenues')
  .insert({
    user_id: userId,
    amount: 10000,
    date: '2024-01-15',
    category: '商品販売',
    description: '商品Aの販売',
    platform: 'メルカリ',
  });
```

#### PATCH /revenues
売上を更新

```typescript
const { data, error } = await supabase
  .from('revenues')
  .update({ amount: 15000 })
  .eq('id', revenueId);
```

#### DELETE /revenues
売上を削除

```typescript
const { data, error } = await supabase
  .from('revenues')
  .delete()
  .eq('id', revenueId);
```

### 経費管理

#### GET /expenses
経費一覧を取得

```typescript
const { data, error } = await supabase
  .from('expenses')
  .select('*')
  .eq('user_id', userId)
  .order('date', { ascending: false });
```

#### POST /expenses
経費を登録

```typescript
const { data, error } = await supabase
  .from('expenses')
  .insert({
    user_id: userId,
    amount: 5000,
    date: '2024-01-15',
    category: '交通費',
    description: '電車代',
    receipt_image_url: 'https://...',
    is_depreciation: false,
  });
```

### 在庫管理（物販向け）

#### GET /inventories
在庫一覧を取得

```typescript
const { data, error } = await supabase
  .from('inventories')
  .select('*')
  .eq('user_id', userId);
```

#### POST /inventories
在庫を登録

```typescript
const { data, error } = await supabase
  .from('inventories')
  .insert({
    user_id: userId,
    product_name: '商品A',
    sku: 'SKU001',
    cost: 1000,
    unit_price: 2000,
    quantity: 10,
  });
```

### 案件管理（サービス・クリエイター向け）

#### GET /projects
案件一覧を取得

```typescript
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

#### POST /projects
案件を登録

```typescript
const { data, error } = await supabase
  .from('projects')
  .insert({
    user_id: userId,
    client_name: '株式会社○○',
    project_name: 'Webサイト制作',
    unit_price: 100000,
    work_date: '2024-01-15',
    payment_status: 'pending',
  });
```

### 仕訳帳（複式簿記）

#### GET /journal_entries
仕訳一覧を取得

```typescript
const { data, error } = await supabase
  .from('journal_entries')
  .select('*')
  .eq('user_id', userId)
  .order('date', { ascending: true });
```

#### POST /journal_entries
仕訳を登録

```typescript
const { data, error } = await supabase
  .from('journal_entries')
  .insert({
    user_id: userId,
    date: '2024-01-15',
    debit_account: '現金',
    credit_account: '売上',
    amount: 10000,
    description: '商品販売',
    revenue_id: revenueId,
  });
```

### ストレージ（領収書画像）

#### アップロード

```typescript
const fileExt = file.name.split('.').pop();
const fileName = `${userId}/${Date.now()}.${fileExt}`;
const { data, error } = await supabase.storage
  .from('receipts')
  .upload(fileName, file);
```

#### ダウンロードURL取得

```typescript
const { data } = supabase.storage
  .from('receipts')
  .getPublicUrl(fileName);
```

## リアルタイムサブスクリプション

### 売上のリアルタイム更新

```typescript
const subscription = supabase
  .channel('revenues')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'revenues',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('売上が更新されました', payload);
    }
  )
  .subscribe();
```

## エラーハンドリング

すべてのAPI呼び出しでエラーハンドリングを行います：

```typescript
const { data, error } = await supabase.from('revenues').select('*');

if (error) {
  console.error('エラー:', error.message);
  // エラー処理
}
```

## Row Level Security (RLS)

すべてのテーブルでRLSが有効になっており、ユーザーは自分のデータのみアクセス可能です。

