'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NewProjectPage() {
  const router = useRouter();
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'overdue'>('pending');
  const [paymentDate, setPaymentDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clientName || !projectName || !unitPrice || !workDate) {
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

    const { error: insertError } = await supabase.from('projects').insert({
      user_id: user.id,
      client_name: clientName,
      project_name: projectName,
      unit_price: parseInt(unitPrice),
      work_date: workDate,
      payment_status: paymentStatus,
      payment_date: paymentDate || null,
    });

    if (insertError) {
      setError(insertError.message);
      setIsLoading(false);
      return;
    }

    router.push('/projects');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">案件を追加</h1>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-md">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              取引先名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="株式会社○○"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              案件名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="Webサイト制作"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              単価 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="100000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              作業日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">入金状況</label>
            <select
              value={paymentStatus}
              onChange={(e) =>
                setPaymentStatus(e.target.value as 'pending' | 'paid' | 'overdue')
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              <option value="pending">未入金</option>
              <option value="paid">入金済み</option>
              <option value="overdue">期限超過</option>
            </select>
          </div>

          {paymentStatus === 'paid' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">入金日</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
            </div>
          )}

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

