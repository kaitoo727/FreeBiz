import { UserProfile } from '@/types';

// 所得税計算
export function calculateIncomeTax(
  businessIncome: number,
  salaryIncome: number = 0,
  taxFilingType: 'blue' | 'white' = 'white'
): number {
  // 青色申告特別控除
  const blueDeduction = taxFilingType === 'blue' ? 650000 : 0;

  // 事業所得
  const adjustedBusinessIncome = Math.max(0, businessIncome - blueDeduction);

  // 総所得
  const totalIncome = adjustedBusinessIncome + salaryIncome;

  // 基礎控除
  const basicDeduction = totalIncome <= 24000000 ? 480000 : 0;

  // 課税所得
  const taxableIncome = Math.max(0, totalIncome - basicDeduction);

  // 所得税率（簡易版）
  let tax = 0;
  if (taxableIncome <= 1950000) {
    tax = taxableIncome * 0.05;
  } else if (taxableIncome <= 3300000) {
    tax = 97500 + (taxableIncome - 1950000) * 0.1;
  } else if (taxableIncome <= 6950000) {
    tax = 232500 + (taxableIncome - 3300000) * 0.2;
  } else if (taxableIncome <= 9000000) {
    tax = 962500 + (taxableIncome - 6950000) * 0.23;
  } else if (taxableIncome <= 18000000) {
    tax = 1437500 + (taxableIncome - 9000000) * 0.33;
  } else if (taxableIncome <= 40000000) {
    tax = 4400000 + (taxableIncome - 18000000) * 0.4;
  } else {
    tax = 13200000 + (taxableIncome - 40000000) * 0.45;
  }

  return Math.floor(tax);
}

// 住民税計算
export function calculateResidentTax(businessIncome: number, salaryIncome: number = 0): number {
  const totalIncome = businessIncome + salaryIncome;
  const basicDeduction = totalIncome <= 24000000 ? 480000 : 0;
  const taxableIncome = Math.max(0, totalIncome - basicDeduction);

  // 住民税（10%）
  return Math.floor(taxableIncome * 0.1);
}

// 個人事業税計算
export function calculateBusinessTax(businessIncome: number, businessType: string): number {
  // 事業主控除（290万円）
  const deduction = 2900000;
  const taxableIncome = Math.max(0, businessIncome - deduction);

  // 事業種別による税率（簡易版：5%）
  return Math.floor(taxableIncome * 0.05);
}

// 消費税計算
export function calculateConsumptionTax(
  revenue: number,
  expenses: number,
  isTaxable: boolean = true
): number {
  if (!isTaxable) return 0;

  // 簡易課税（みなし仕入率50%）
  const taxBase = revenue - expenses * 0.5;
  return Math.floor(Math.max(0, taxBase * 0.1));
}

// 総合的な税金シミュレーション
export function calculateTotalTax(
  revenue: number,
  expenses: number,
  profile: UserProfile
): {
  income_tax: number;
  resident_tax: number;
  business_tax: number;
  consumption_tax: number;
  total_tax: number;
  net_income: number;
} {
  const businessIncome = revenue - expenses;

  const incomeTax = calculateIncomeTax(
    businessIncome,
    profile.salary_income || 0,
    profile.tax_filing_type
  );
  const residentTax = calculateResidentTax(businessIncome, profile.salary_income || 0);
  const businessTax = calculateBusinessTax(businessIncome, profile.business_type);
  const consumptionTax = calculateConsumptionTax(revenue, expenses, true);

  const totalTax = incomeTax + residentTax + businessTax + consumptionTax;
  const netIncome = businessIncome - totalTax;

  return {
    income_tax: incomeTax,
    resident_tax: residentTax,
    business_tax: businessTax,
    consumption_tax: consumptionTax,
    total_tax: totalTax,
    net_income: netIncome,
  };
}

