'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 環境変数のチェック（クライアント側）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl && 
                               supabaseKey && 
                               !supabaseUrl.includes('dummy') && 
                               !supabaseKey.includes('dummy') &&
                               supabaseUrl.startsWith('http');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 環境変数のチェック
      if (!isSupabaseConfigured) {
        setError(
          'Supabase環境変数が設定されていません。\n' +
          '.env.localファイルに以下を設定してください:\n' +
          'NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\n' +
          'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key\n\n' +
          '設定後、開発サーバーを再起動してください。'
        );
        setIsLoading(false);
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // エラーメッセージを日本語化
        let errorMessage = '';
        
        if (authError.message.includes('Email not confirmed')) {
          errorMessage = 
            'メールアドレスが確認されていません。\n' +
            '登録時に送信された確認メールを確認してください。\n\n' +
            'メールが届いていない場合:\n' +
            '1. 迷惑メールフォルダを確認\n' +
            '2. メールアドレスが正しいか確認\n' +
            '3. 再度「新規登録」を試してください';
        } else if (authError.message.includes('Invalid login credentials') || 
                   authError.message.includes('Invalid credentials')) {
          errorMessage = 
            'メールアドレスまたはパスワードが正しくありません。\n' +
            '入力内容を確認してください。';
        } else if (authError.message.includes('fetch') || 
                   authError.message.includes('network')) {
          errorMessage = 
            'Supabaseへの接続に失敗しました。\n' +
            '以下を確認してください:\n' +
            '1. .env.localファイルに正しいSupabase URLとキーが設定されているか\n' +
            '2. Supabaseプロジェクトがアクティブか\n' +
            '3. インターネット接続が正常か';
        } else {
          errorMessage = authError.message;
        }
        
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // プロファイルが存在するかチェック
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116は「データが見つからない」エラー（正常）
          setError('プロファイルの取得に失敗しました: ' + profileError.message);
          setIsLoading(false);
          return;
        }

        if (!profile) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('ログインエラー:', err);
      setError(
        '予期しないエラーが発生しました。\n' +
        'Supabase環境変数が正しく設定されているか確認してください。'
      );
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 環境変数のチェック
      if (!isSupabaseConfigured) {
        setError(
          'Supabase環境変数が設定されていません。\n' +
          '.env.localファイルに以下を設定してください:\n' +
          'NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\n' +
          'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key\n\n' +
          '設定後、開発サーバーを再起動してください。'
        );
        setIsLoading(false);
        return;
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        // エラーメッセージを日本語化
        let errorMessage = '';
        
        if (authError.message.includes('User already registered')) {
          errorMessage = 
            'このメールアドレスは既に登録されています。\n' +
            'ログインを試してください。';
        } else if (authError.message.includes('fetch') || 
                   authError.message.includes('network')) {
          errorMessage = 
            'Supabaseへの接続に失敗しました。\n' +
            '以下を確認してください:\n' +
            '1. .env.localファイルに正しいSupabase URLとキーが設定されているか\n' +
            '2. Supabaseプロジェクトがアクティブか\n' +
            '3. インターネット接続が正常か';
        } else {
          errorMessage = authError.message;
        }
        
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // メール確認が必要な場合
        if (data.user.email && !data.session) {
          setError(
            '確認メールを送信しました。\n' +
            'メールボックスを確認して、メール内のリンクをクリックしてください。\n\n' +
            'メールが届いていない場合、迷惑メールフォルダを確認してください。'
          );
          setIsLoading(false);
          return;
        }
        
        // メール確認が不要な場合（開発環境など）
        router.push('/onboarding');
      }
    } catch (err: any) {
      console.error('新規登録エラー:', err);
      setError(
        '予期しないエラーが発生しました。\n' +
        'Supabase環境変数が正しく設定されているか確認してください。'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-700">FreeBiz</h1>
          <p className="mt-2 text-gray-600">個人事業主向け会計アプリ</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 whitespace-pre-line">
              {error}
            </div>
          )}

          {!isSupabaseConfigured && (
            <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
              ⚠️ Supabase環境変数が設定されていません。
              <br />
              .env.localファイルにSupabaseのURLとキーを設定してください。
              <br />
              設定後、開発サーバーを再起動してください。
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
                className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'パスワードを非表示' : 'パスワードを表示'}
                title={showPassword ? 'パスワードを非表示' : 'パスワードを表示'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {password && (
              <p className="mt-1 text-xs text-gray-500">
                {showPassword ? 'パスワードを非表示にするには、右側のアイコンをクリック' : 'パスワードを表示するには、右側のアイコンをクリック'}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? '処理中...' : 'ログイン'}
            </button>

            <button
              type="button"
              onClick={handleSignUp}
              disabled={isLoading}
              className="w-full rounded-md border border-primary-600 bg-white px-4 py-2 text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              新規登録
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

