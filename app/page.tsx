'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 認証状態をチェック
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('認証チェックエラー:', error);
          router.push('/auth/login');
          return;
        }
        if (session) {
          router.push('/dashboard');
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('認証チェックエラー:', error);
        router.push('/auth/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">FreeBiz</h1>
        <p className="mt-2 text-gray-600">読み込み中...</p>
      </div>
    </div>
  );
}

