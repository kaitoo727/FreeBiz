'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, BusinessType } from '@/types';
import { businessTypeConfigs } from '@/lib/business-type-config';
import Link from 'next/link';
import { TrendingUp, TrendingDown, DollarSign, Receipt, Package, Briefcase } from 'lucide-react';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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

    // 今年の売上合計
    const currentYear = new Date().getFullYear();
    const { data: revenues } = await supabase
      .from('revenues')
      .select('amount')
      .eq('user_id', user.id)
      .gte('date', `${currentYear}-01-01`)
      .lte('date', `${currentYear}-12-31`);

    const revenueSum = revenues?.reduce((sum, r) => sum + r.amount, 0) || 0;
    setRevenueTotal(revenueSum);

    // 今年の経費合計
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', user.id)
      .gte('date', `${currentYear}-01-01`)
      .lte('date', `${currentYear}-12-31`);

    const expenseSum = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
    setExpenseTotal(expenseSum);

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>プロファイルが見つかりません</p>
      </div>
    );
  }

  const config = businessTypeConfigs[profile.business_type as BusinessType];
  const profit = revenueTotal - expenseTotal;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-700">FreeBiz</h1>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/auth/login';
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ダッシュボード統計 */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">売上（今年）</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  ¥{revenueTotal.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">経費（今年）</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  ¥{expenseTotal.toLocaleString()}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">利益（今年）</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  ¥{profit.toLocaleString()}
                </p>
              </div>
              {profit >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">予測納税額</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  ¥{Math.max(0, Math.floor(profit * 0.1)).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">クイックアクション</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/revenues/new"
              className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50"
            >
              <DollarSign className="mr-3 h-6 w-6 text-green-500" />
              <span className="font-medium text-gray-900">売上を登録</span>
            </Link>

            <Link
              href="/expenses/new"
              className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50"
            >
              <Receipt className="mr-3 h-6 w-6 text-red-500" />
              <span className="font-medium text-gray-900">経費を登録</span>
            </Link>

            <Link
              href="/revenues"
              className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50"
            >
              <DollarSign className="mr-3 h-6 w-6 text-green-500" />
              <span className="font-medium text-gray-900">売上一覧</span>
            </Link>

            <Link
              href="/expenses"
              className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50"
            >
              <Receipt className="mr-3 h-6 w-6 text-red-500" />
              <span className="font-medium text-gray-900">経費一覧</span>
            </Link>

            {config.showInventory && (
              <Link
                href="/inventory"
                className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50"
              >
                <Package className="mr-3 h-6 w-6 text-blue-500" />
                <span className="font-medium text-gray-900">在庫管理</span>
              </Link>
            )}

            {config.showProjects && (
              <Link
                href="/projects"
                className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50"
              >
                <Briefcase className="mr-3 h-6 w-6 text-purple-500" />
                <span className="font-medium text-gray-900">案件管理</span>
              </Link>
            )}

            <Link
              href="/tax-simulation"
              className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50"
            >
              <TrendingUp className="mr-3 h-6 w-6 text-orange-500" />
              <span className="font-medium text-gray-900">税金シミュレーター</span>
            </Link>

            <Link
              href="/tax-documents"
              className="flex items-center rounded-lg bg-white p-4 shadow-md hover:bg-gray-50"
            >
              <Receipt className="mr-3 h-6 w-6 text-indigo-500" />
              <span className="font-medium text-gray-900">確定申告書類</span>
            </Link>
          </div>
        </div>

        {/* 次にすべきこと */}
        <div className="rounded-lg bg-blue-50 p-6">
          <h2 className="mb-4 text-xl font-bold text-blue-900">次にすべきこと</h2>
          <ul className="space-y-2 text-blue-800">
            <li>• 売上と経費を登録して帳簿を完成させましょう</li>
            {profile.tax_filing_type === 'blue' && (
              <li>• 青色申告のため、複式簿記の仕訳を確認しましょう</li>
            )}
            <li>• 税金シミュレーターで納税額を確認しましょう</li>
            <li>• 確定申告書類を生成して提出準備をしましょう</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

