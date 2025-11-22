'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, TaxSimulation } from '@/types';
import { calculateTotalTax } from '@/lib/tax-calculation';
import { DollarSign, AlertCircle } from 'lucide-react';

export default function TaxSimulationPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [simulation, setSimulation] = useState<TaxSimulation | null>(null);
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // プロファイル取得
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // 今年の売上・経費合計
    const currentYear = new Date().getFullYear();
    const { data: revenues } = await supabase
      .from('revenues')
      .select('amount')
      .eq('user_id', user.id)
      .gte('date', `${currentYear}-01-01`)
      .lte('date', `${currentYear}-12-31`);

    const revenueSum = revenues?.reduce((sum, r) => sum + r.amount, 0) || 0;
    setRevenue(revenueSum);

    const { data: expensesData } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', user.id)
      .gte('date', `${currentYear}-01-01`)
      .lte('date', `${currentYear}-12-31`);

    const expenseSum = expensesData?.reduce((sum, e) => sum + e.amount, 0) || 0;
    setExpenses(expenseSum);

    if (profileData) {
      const sim = calculateTotalTax(revenueSum, expenseSum, profileData);
      setSimulation(sim);
    }

    setIsLoading(false);
  };

  const handleCalculate = () => {
    if (profile) {
      const sim = calculateTotalTax(revenue, expenses, profile);
      setSimulation(sim);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">税金シミュレーター</h1>

        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <div className="flex items-start">
            <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              このシミュレーションは概算です。実際の納税額は税理士にご相談ください。
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 入力フォーム */}
          <div className="space-y-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900">収支を入力</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">売上（年）</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">経費（年）</label>
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              計算する
            </button>
          </div>

          {/* シミュレーション結果 */}
          {simulation && (
            <div className="space-y-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900">シミュレーション結果</h2>

              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">事業所得</span>
                  <span className="font-medium">
                    ¥{(revenue - expenses).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">所得税</span>
                  <span className="font-medium">¥{simulation.income_tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">住民税</span>
                  <span className="font-medium">¥{simulation.resident_tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">個人事業税</span>
                  <span className="font-medium">¥{simulation.business_tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">消費税</span>
                  <span className="font-medium">
                    ¥{simulation.consumption_tax.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-2">
                  <span className="text-lg font-semibold text-gray-900">合計納税額</span>
                  <span className="text-lg font-bold text-primary-600">
                    ¥{simulation.total_tax.toLocaleString()}
                  </span>
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-900">手取り</span>
                    <span className="text-xl font-bold text-green-700">
                      ¥{simulation.net_income.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 副業バレ防止チェック */}
        {profile.is_side_business && (
          <div className="mt-6 rounded-lg bg-yellow-50 p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-yellow-900">
              副業バレ防止チェック
            </h2>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>✓ 普通徴収設定が推奨されます（会社に知られないため）</li>
              <li>✓ 給与所得と事業所得を分離して計算しています</li>
              <li>✓ 入金口座は個人名義の口座を使用してください</li>
              <li>✓ 会社の就業規則を確認してください</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

