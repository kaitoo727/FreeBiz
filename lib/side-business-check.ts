import { UserProfile } from '@/types';

// 副業バレ防止チェック
export function checkSideBusinessSafety(profile: UserProfile): {
  payment_method_ok: boolean;
  bank_account_ok: boolean;
  company_rules_ok: boolean;
  income_separation_ok: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // 普通徴収設定のチェック
  const payment_method_ok = true; // 実際の実装では、ユーザーの設定を確認
  if (!payment_method_ok) {
    warnings.push('特別徴収が設定されている可能性があります');
    recommendations.push('普通徴収に変更することを推奨します');
  }

  // 入金口座のチェック
  const bank_account_ok = true; // 実際の実装では、口座情報を確認
  if (!bank_account_ok) {
    warnings.push('会社名義の口座を使用している可能性があります');
    recommendations.push('個人名義の口座を使用してください');
  }

  // 会社規則のチェック
  const company_rules_ok = true; // 実際の実装では、ユーザーが確認したかどうかを記録
  if (!company_rules_ok) {
    warnings.push('会社の就業規則を確認していません');
    recommendations.push('就業規則で副業が許可されているか確認してください');
  }

  // 所得分離のチェック
  const income_separation_ok = profile.is_side_business && profile.salary_income !== undefined;
  if (!income_separation_ok && profile.is_side_business) {
    warnings.push('給与所得と事業所得が分離されていません');
    recommendations.push('給与所得と事業所得を分離して計算してください');
  }

  return {
    payment_method_ok,
    bank_account_ok,
    company_rules_ok,
    income_separation_ok,
    warnings,
    recommendations,
  };
}

