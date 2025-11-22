// 環境変数の確認用スクリプト
// 実行方法: node check-env.js

require('dotenv').config({ path: '.env.local' });

console.log('=== 環境変数の確認 ===\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

console.log('NEXT_PUBLIC_SUPABASE_URL:');
if (supabaseUrl) {
  console.log('  ✅ 設定されています');
  console.log('  値:', supabaseUrl.substring(0, 30) + '...');
  console.log('  長さ:', supabaseUrl.length);
} else {
  console.log('  ❌ 未設定');
}

console.log('\nNEXT_PUBLIC_SUPABASE_ANON_KEY:');
if (supabaseKey) {
  console.log('  ✅ 設定されています');
  console.log('  値:', supabaseKey.substring(0, 30) + '...');
  console.log('  長さ:', supabaseKey.length);
} else {
  console.log('  ❌ 未設定');
}

console.log('\nOPENAI_API_KEY:');
if (openaiKey) {
  console.log('  ✅ 設定されています');
} else {
  console.log('  ⚠️  未設定（オプション）');
}

console.log('\n=== 確認完了 ===');


