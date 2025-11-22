'use client';

export default function DebugEnvPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">環境変数のデバッグ</h1>
        
        <div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
          <div>
            <h2 className="mb-2 font-semibold">NEXT_PUBLIC_SUPABASE_URL</h2>
            {supabaseUrl ? (
              <div className="rounded bg-green-50 p-3">
                <p className="text-sm text-green-800">✅ 設定されています</p>
                <p className="mt-1 break-all text-xs text-gray-600">
                  {supabaseUrl.substring(0, 50)}...
                </p>
                <p className="mt-1 text-xs text-gray-500">長さ: {supabaseUrl.length}文字</p>
              </div>
            ) : (
              <div className="rounded bg-red-50 p-3">
                <p className="text-sm text-red-800">❌ 未設定</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-2 font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</h2>
            {supabaseKey ? (
              <div className="rounded bg-green-50 p-3">
                <p className="text-sm text-green-800">✅ 設定されています</p>
                <p className="mt-1 break-all text-xs text-gray-600">
                  {supabaseKey.substring(0, 50)}...
                </p>
                <p className="mt-1 text-xs text-gray-500">長さ: {supabaseKey.length}文字</p>
              </div>
            ) : (
              <div className="rounded bg-red-50 p-3">
                <p className="text-sm text-red-800">❌ 未設定</p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">トラブルシューティング</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-blue-800">
              <li>.env.localファイルがプロジェクトルート（package.jsonと同じフォルダ）にあるか確認</li>
              <li>ファイル名が正確か確認（.env.localで、.envではない）</li>
              <li>値に余分なスペースや引用符がないか確認</li>
              <li>開発サーバーを再起動したか確認（Ctrl+C → npm run dev）</li>
              <li>環境変数名が正確か確認（NEXT_PUBLIC_で始まる）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


