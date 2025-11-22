import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// デバッグ用（開発環境のみ）
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 環境変数のデバッグ情報:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : '未設定');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '未設定');
}

// 環境変数が設定されていない場合のダミー値（開発用）
const dummyUrl = 'https://dummy.supabase.co';
const dummyKey = 'dummy-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase環境変数が設定されていません');
  console.warn('⚠️ .env.localファイルに以下を設定してください:');
  console.warn('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.warn('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.warn('⚠️ 設定後、開発サーバーを再起動してください（Ctrl+C → npm run dev）');
}

// 環境変数が設定されている場合のみ実際のクライアントを作成
export const supabase = createClient(
  supabaseUrl || dummyUrl,
  supabaseAnonKey || dummyKey
);

