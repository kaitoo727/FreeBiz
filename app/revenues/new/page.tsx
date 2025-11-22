'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { UserProfile, BusinessType } from '@/types';
import { businessTypeConfigs } from '@/lib/business-type-config';

export default function NewRevenuePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('');
  const [itemId, setItemId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile(data);
      const config = businessTypeConfigs[data.business_type as BusinessType];
      if (config.defaultCategories.length > 0) {
        setCategory(config.defaultCategories[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || !date || !category) {
      setError('必須項目を入力してください');
      return;
    }

    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('ログインが必要です');
      setIsLoading(false);
      return;
    }

    const revenueData: any = {
      user_id: user.id,
      amount: parseInt(amount),
      date,
      category,
      description: description || null,
    };

    if (profile) {
      const config = businessTypeConfigs[profile.business_type as BusinessType];
      if (config.revenueFields.showPlatform && platform) {
        revenueData.platform = platform;
      }
      if (config.revenueFields.showItemId && itemId) {
        revenueData.item_id = itemId;
      }
      if (config.revenueFields.showProjectId && projectId) {
        revenueData.project_id = projectId;
      }
    }

    const { error: insertError } = await supabase.from('revenues').insert(revenueData);

    if (insertError) {
      setError(insertError.message);
      setIsLoading(false);
      return;
    }

    // 仕訳を自動生成（青色申告の場合）
    if (profile?.tax_filing_type === 'blue') {
      await createJournalEntry(user.id, parseInt(amount), date, category, description);
    }

    router.push('/dashboard');
  };

  const createJournalEntry = async (
    userId: string,
    amount: number,
    date: string,
    category: string,
    description: string | null
  ) => {
    // 売上の仕訳: 借方: 現金/預金、貸方: 売上
    await supabase.from('journal_entries').insert({
      user_id: userId,
      date,
      debit_account: '現金',
      credit_account: '売上',
      amount,
      description: description || category,
    });
  };

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  const config = businessTypeConfigs[profile.business_type as BusinessType];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">売上を登録</h1>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-md">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              金額 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              日付 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              カテゴリ <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              {config.defaultCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {config.revenueFields.showPlatform && (
            <div>
              <label className="block text-sm font-medium text-gray-700">プラットフォーム</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              >
                <option value="">選択してください</option>
                <option value="メルカリ">メルカリ</option>
                <option value="Amazon">Amazon</option>
                <option value="BASE">BASE</option>
                <option value="Shopify">Shopify</option>
                <option value="その他">その他</option>
              </select>
            </div>
          )}

          {config.revenueFields.showItemId && (
            <div>
              <label className="block text-sm font-medium text-gray-700">商品ID</label>
              <input
                type="text"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="商品ID（任意）"
              />
            </div>
          )}

          {config.revenueFields.showProjectId && (
            <div>
              <label className="block text-sm font-medium text-gray-700">案件ID</label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="案件ID（任意）"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">備考</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="備考（任意）"
              />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? '登録中...' : '登録'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

