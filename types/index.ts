// 事業タイプ
export type BusinessType = 'retail' | 'service' | 'creative' | 'consulting' | 'custom';

// 事業タイプの日本語名
export const BusinessTypeLabels: Record<BusinessType, string> = {
  retail: '物販',
  service: 'サービス業',
  creative: 'クリエイティブ',
  consulting: 'コンサル',
  custom: 'その他（カスタム）',
};

// 申告タイプ
export type TaxFilingType = 'blue' | 'white';

// 売上
export interface Revenue {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  platform?: string; // プラットフォーム名（メルカリ、Amazon等）
  item_id?: string; // 商品ID（物販の場合）
  project_id?: string; // 案件ID（サービス・クリエイターの場合）
  created_at: string;
  updated_at: string;
}

// 経費
export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  receipt_image_url?: string;
  is_depreciation: boolean; // 減価償却対象か
  created_at: string;
  updated_at: string;
}

// 在庫（物販向け）
export interface Inventory {
  id: string;
  user_id: string;
  product_name: string;
  sku?: string;
  cost: number; // 原価
  unit_price: number; // 単価
  quantity: number; // 在庫数
  created_at: string;
  updated_at: string;
}

// 案件（サービス・クリエイター向け）
export interface Project {
  id: string;
  user_id: string;
  client_name: string;
  project_name: string;
  unit_price: number;
  work_date: string;
  payment_status: 'pending' | 'paid' | 'overdue';
  payment_date?: string;
  created_at: string;
  updated_at: string;
}

// ユーザープロファイル
export interface UserProfile {
  id: string;
  user_id: string;
  business_type: BusinessType;
  business_name?: string;
  tax_filing_type: TaxFilingType;
  is_side_business: boolean; // 副業かどうか
  salary_income?: number; // 給与所得（副業の場合）
  created_at: string;
  updated_at: string;
}

// 仕訳
export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  debit_account: string; // 借方科目
  credit_account: string; // 貸方科目
  amount: number;
  description: string;
  revenue_id?: string;
  expense_id?: string;
  created_at: string;
}

// 税金シミュレーション結果
export interface TaxSimulation {
  income_tax: number;
  resident_tax: number;
  business_tax: number;
  consumption_tax: number;
  total_tax: number;
  net_income: number;
}

// 副業バレ防止チェック結果
export interface SideBusinessCheck {
  payment_method_ok: boolean;
  bank_account_ok: boolean;
  company_rules_ok: boolean;
  income_separation_ok: boolean;
  warnings: string[];
  recommendations: string[];
}

