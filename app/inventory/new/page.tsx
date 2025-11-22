'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NewInventoryPage() {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [cost, setCost] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!productName || !cost || !unitPrice) {
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

    const { error: insertError } = await supabase.from('inventories').insert({
      user_id: user.id,
      product_name: productName,
      sku: sku || null,
      cost: parseInt(cost),
      unit_price: parseInt(unitPrice),
      quantity: parseInt(quantity) || 0,
    });

    if (insertError) {
      setError(insertError.message);
      setIsLoading(false);
      return;
    }

    router.push('/inventory');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">商品を追加</h1>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-md">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              商品名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="商品名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="SKU（任意）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              原価 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="1000"
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
              placeholder="2000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">在庫数</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="0"
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

