'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Expense } from '@/types';
import { Plus, Receipt, Calendar, DollarSign, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    loadExpenses();
  }, [selectedYear]);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchTerm, selectedCategory]);

  const loadExpenses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', `${selectedYear}-01-01`)
      .lte('date', `${selectedYear}-12-31`)
      .order('date', { ascending: false });

    if (data) {
      setExpenses(data);
      const total = data.reduce((sum, e) => sum + e.amount, 0);
      setTotalAmount(total);
    }
    setIsLoading(false);
  };

  const filterExpenses = () => {
    let filtered = [...expenses];

    // カテゴリでフィルタ
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((e) => e.category === selectedCategory);
    }

    // 検索語でフィルタ
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.description?.toLowerCase().includes(term) ||
          e.category.toLowerCase().includes(term)
      );
    }

    setFilteredExpenses(filtered);
  };

  const categories = Array.from(new Set(expenses.map((e) => e.category)));

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">経費一覧</h1>
          <Link
            href="/expenses/new"
            className="flex items-center rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            経費を登録
          </Link>
        </div>

        {/* 統計情報 */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <p className="text-sm font-medium text-gray-600">合計経費</p>
            <p className="mt-2 text-2xl font-bold text-red-600">
              ¥{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <p className="text-sm font-medium text-gray-600">登録件数</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {expenses.length}件
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <p className="text-sm font-medium text-gray-600">平均金額</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              ¥{expenses.length > 0 ? Math.floor(totalAmount / expenses.length).toLocaleString() : 0}
            </p>
          </div>
        </div>

        {/* フィルター */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                年
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                科目
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              >
                <option value="all">すべて</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                検索
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="説明や科目で検索..."
                  className="block w-full rounded-md border border-gray-300 px-10 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <Receipt className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">
              {expenses.length === 0
                ? '経費が登録されていません'
                : '条件に一致する経費が見つかりませんでした'}
            </p>
            {expenses.length === 0 && (
              <Link
                href="/expenses/new"
                className="mt-4 inline-block rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
              >
                最初の経費を登録
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow-md">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    日付
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    科目
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    説明
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    備考
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {format(new Date(expense.date), 'yyyy年MM月dd日')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {expense.category}
                      </span>
                      {expense.is_depreciation && (
                        <span className="ml-2 inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          減価償却
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {expense.description || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-red-600 text-right">
                      ¥{expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {expense.receipt_image_url ? (
                        <a
                          href={expense.receipt_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800"
                        >
                          領収書あり
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                    合計
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-red-600">
                    ¥{filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

