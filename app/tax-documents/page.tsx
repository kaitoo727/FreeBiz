'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, Revenue, Expense, JournalEntry } from '@/types';
import {
  generateTaxReturnB,
  generateBlueReturn,
  generateJournalBook,
} from '@/lib/tax-documents';
import { FileText, Download } from 'lucide-react';

export default function TaxDocumentsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadData();
  }, [selectedYear]);

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

    // 売上取得
    const { data: revenuesData } = await supabase
      .from('revenues')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', `${selectedYear}-01-01`)
      .lte('date', `${selectedYear}-12-31`)
      .order('date', { ascending: true });

    if (revenuesData) {
      setRevenues(revenuesData);
    }

    // 経費取得
    const { data: expensesData } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', `${selectedYear}-01-01`)
      .lte('date', `${selectedYear}-12-31`)
      .order('date', { ascending: true });

    if (expensesData) {
      setExpenses(expensesData);
    }

    // 仕訳取得
    const { data: journalData } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', `${selectedYear}-01-01`)
      .lte('date', `${selectedYear}-12-31`)
      .order('date', { ascending: true });

    if (journalData) {
      setJournalEntries(journalData);
    }

    setIsLoading(false);
  };

  const handleDownload = (type: 'taxReturnB' | 'blueReturn' | 'journal') => {
    if (!profile) return;

    let data: any;
    let filename: string;

    if (type === 'taxReturnB') {
      data = generateTaxReturnB(profile, revenues, expenses);
      filename = `確定申告書B_${selectedYear}.json`;
    } else if (type === 'blueReturn' && profile.tax_filing_type === 'blue') {
      data = generateBlueReturn(profile, revenues, expenses, journalEntries);
      filename = `青色申告決算書_${selectedYear}.json`;
    } else {
      data = generateJournalBook(journalEntries);
      filename = `仕訳帳_${selectedYear}.json`;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  const taxReturnB = generateTaxReturnB(profile, revenues, expenses);
  const blueReturn =
    profile.tax_filing_type === 'blue'
      ? generateBlueReturn(profile, revenues, expenses, journalEntries)
      : null;
  const journalBook = generateJournalBook(journalEntries);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">確定申告書類</h1>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 確定申告書B */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center">
              <FileText className="mr-2 h-6 w-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">確定申告書B</h2>
            </div>
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">売上:</span>
                <span className="font-medium">¥{taxReturnB.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">経費:</span>
                <span className="font-medium">¥{taxReturnB.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium text-gray-900">事業所得:</span>
                <span className="font-bold text-primary-600">
                  ¥{taxReturnB.businessIncome.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDownload('taxReturnB')}
              className="flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              <Download className="mr-2 h-4 w-4" />
              ダウンロード
            </button>
          </div>

          {/* 青色申告決算書 */}
          {profile.tax_filing_type === 'blue' && blueReturn && (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <FileText className="mr-2 h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">青色申告決算書</h2>
              </div>
              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">売上:</span>
                  <span className="font-medium">¥{blueReturn.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">経費:</span>
                  <span className="font-medium">¥{blueReturn.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">青色申告控除:</span>
                  <span className="font-medium">¥{blueReturn.blueDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium text-gray-900">事業所得:</span>
                  <span className="font-bold text-blue-600">
                    ¥{blueReturn.adjustedIncome.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDownload('blueReturn')}
                className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Download className="mr-2 h-4 w-4" />
                ダウンロード
              </button>
            </div>
          )}

          {/* 仕訳帳 */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center">
              <FileText className="mr-2 h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">仕訳帳</h2>
            </div>
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">仕訳数:</span>
                <span className="font-medium">{journalBook.length}件</span>
              </div>
            </div>
            <button
              onClick={() => handleDownload('journal')}
              className="flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              <Download className="mr-2 h-4 w-4" />
              ダウンロード
            </button>
          </div>
        </div>

        {/* 内訳書 */}
        {blueReturn && (
          <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">内訳書</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium text-gray-700">売上内訳</h3>
                <div className="space-y-1 text-sm">
                  {Object.entries(blueReturn.revenueBreakdown).map(([category, amount]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-gray-600">{category}:</span>
                      <span className="font-medium">¥{amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-gray-700">経費内訳</h3>
                <div className="space-y-1 text-sm">
                  {Object.entries(blueReturn.expenseBreakdown).map(([category, amount]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-gray-600">{category}:</span>
                      <span className="font-medium">¥{amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

