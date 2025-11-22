import { UserProfile, Revenue, Expense, JournalEntry } from '@/types';

// 確定申告書Bの生成
export function generateTaxReturnB(
  profile: UserProfile,
  revenues: Revenue[],
  expenses: Expense[]
): {
  businessName: string;
  businessType: string;
  totalRevenue: number;
  totalExpenses: number;
  businessIncome: number;
  blueDeduction: number;
  adjustedIncome: number;
} {
  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const businessIncome = totalRevenue - totalExpenses;
  const blueDeduction = profile.tax_filing_type === 'blue' ? 650000 : 0;
  const adjustedIncome = Math.max(0, businessIncome - blueDeduction);

  return {
    businessName: profile.business_name || '個人事業',
    businessType: profile.business_type,
    totalRevenue,
    totalExpenses,
    businessIncome,
    blueDeduction,
    adjustedIncome,
  };
}

// 青色申告決算書の生成
export function generateBlueReturn(
  profile: UserProfile,
  revenues: Revenue[],
  expenses: Expense[],
  journalEntries: JournalEntry[]
): {
  revenueBreakdown: Record<string, number>;
  expenseBreakdown: Record<string, number>;
  totalRevenue: number;
  totalExpenses: number;
  businessIncome: number;
  blueDeduction: number;
  adjustedIncome: number;
} {
  const revenueBreakdown: Record<string, number> = {};
  revenues.forEach((r) => {
    revenueBreakdown[r.category] = (revenueBreakdown[r.category] || 0) + r.amount;
  });

  const expenseBreakdown: Record<string, number> = {};
  expenses.forEach((e) => {
    expenseBreakdown[e.category] = (expenseBreakdown[e.category] || 0) + e.amount;
  });

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const businessIncome = totalRevenue - totalExpenses;
  const blueDeduction = 650000;
  const adjustedIncome = Math.max(0, businessIncome - blueDeduction);

  return {
    revenueBreakdown,
    expenseBreakdown,
    totalRevenue,
    totalExpenses,
    businessIncome,
    blueDeduction,
    adjustedIncome,
  };
}

// 仕訳帳の生成
export function generateJournalBook(journalEntries: JournalEntry[]): JournalEntry[] {
  return journalEntries.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
}

// PDF生成用のデータ構造
export interface TaxDocumentData {
  taxReturnB: ReturnType<typeof generateTaxReturnB>;
  blueReturn?: ReturnType<typeof generateBlueReturn>;
  journalBook: JournalEntry[];
}

