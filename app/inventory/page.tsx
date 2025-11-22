'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Inventory } from '@/types';
import { Plus, Package } from 'lucide-react';
import Link from 'next/link';

export default function InventoryPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventories();
  }, []);

  const loadInventories = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('inventories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setInventories(data);
    }
    setIsLoading(false);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">在庫管理</h1>
          <Link
            href="/inventory/new"
            className="flex items-center rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            商品を追加
          </Link>
        </div>

        {inventories.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">在庫が登録されていません</p>
            <Link
              href="/inventory/new"
              className="mt-4 inline-block rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              最初の商品を追加
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow-md">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    商品名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    原価
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    単価
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    在庫数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    在庫金額
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {inventories.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {item.sku || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      ¥{item.cost.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      ¥{item.unit_price.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      ¥{(item.cost * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

