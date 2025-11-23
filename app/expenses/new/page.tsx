'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { extractTextFromImage, extractAmountFromText } from '@/lib/ocr';
import { Upload, Loader2, FileText, Camera } from 'lucide-react';

type InputMode = 'ocr' | 'manual';

export default function NewExpensePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('manual');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('その他');
  const [description, setDescription] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | null>(null);
  const [isDepreciation, setIsDepreciation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      setPageError(null);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('認証エラー:', userError);
        router.push('/auth/login');
        return;
      }

      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // データが見つからない（プロファイル未作成）
          // プロファイルがなくても経費登録は可能
          setProfile(null);
        } else {
          console.error('プロファイル取得エラー:', profileError);
          setPageError('プロファイルの取得に失敗しました。');
        }
      } else if (data) {
        setProfile(data);
      }
    } catch (err: any) {
      console.error('プロファイル読み込みエラー:', err);
      setPageError('データの読み込みに失敗しました: ' + (err.message || '不明なエラー'));
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    setError('');

    // 画像をプレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
      setReceiptImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // OCRモードの場合のみOCR処理を実行
    if (inputMode === 'ocr') {
      setIsProcessingOCR(true);
      try {
        // OCR処理
        const text = await extractTextFromImage(file);
        const extractedAmount = extractAmountFromText(text);

        if (extractedAmount) {
          setAmount(extractedAmount.toString());
        }

        // AI分類（API Route経由）
        try {
          const classificationResponse = await fetch('/api/ai/classify-expense', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              description: description || text.substring(0, 100),
              amount: extractedAmount || parseInt(amount) || 0,
              receiptText: text,
            }),
          });

          if (classificationResponse.ok) {
            const classification = await classificationResponse.json();
            setCategory(classification.category || 'その他');
            if (!description) {
              setDescription(classification.description || '');
            }
          }
        } catch (err) {
          console.error('AI分類エラー:', err);
          // エラーが発生しても処理を続行
        }

        // 高額経費の場合は減価償却を案内
        if (extractedAmount && extractedAmount >= 100000) {
          setIsDepreciation(true);
        }
      } catch (err) {
        console.error('OCR処理エラー:', err);
        setError('領収書の読み取りに失敗しました。手動で入力してください。');
      } finally {
        setIsProcessingOCR(false);
      }
    }
  };

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    // モード変更時にフォームをリセット
    if (mode === 'manual') {
      setAmount('');
      setDescription('');
      setCategory('その他');
      setIsDepreciation(false);
    }
    setReceiptFile(null);
    setReceiptImageUrl(null);
    setError('');
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

    let imageUrl: string | null = null;

    // 画像をアップロード
    if (receiptFile) {
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, receiptFile);

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }
    }

    const expenseData = {
      user_id: user.id,
      amount: parseInt(amount),
      date,
      category,
      description: description || null,
      receipt_image_url: imageUrl,
      is_depreciation: isDepreciation,
    };

    const { error: insertError } = await supabase.from('expenses').insert(expenseData);

    if (insertError) {
      setError(insertError.message);
      setIsLoading(false);
      return;
    }

    // 仕訳を自動生成（青色申告の場合）
    if (profile && profile.tax_filing_type === 'blue') {
      try {
        await createJournalEntry(user.id, parseInt(amount), date, category, description);
      } catch (err) {
        console.error('仕訳生成エラー:', err);
        // 仕訳生成に失敗しても経費登録は成功とする
      }
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
    // 経費の仕訳: 借方: 科目、貸方: 現金/預金
    await supabase.from('journal_entries').insert({
      user_id: userId,
      date,
      debit_account: category,
      credit_account: '現金',
      amount,
      description: description || category,
    });
  };

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-600" />
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-red-600">エラー</h2>
          <p className="mb-4 text-gray-600">{pageError}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              ページを再読み込み
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              ダッシュボードに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">経費を登録</h1>

        {!profile && (
          <div className="mb-4 rounded-lg bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ プロファイルが設定されていません。青色申告の仕訳は自動生成されません。
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-md">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
          )}

          {/* 入力方法の選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              入力方法
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleModeChange('manual')}
                className={`flex-1 flex items-center justify-center space-x-2 rounded-lg border-2 p-4 transition-all ${
                  inputMode === 'manual'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span className="font-medium">手動入力</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('ocr')}
                className={`flex-1 flex items-center justify-center space-x-2 rounded-lg border-2 p-4 transition-all ${
                  inputMode === 'ocr'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                }`}
              >
                <Camera className="h-5 w-5" />
                <span className="font-medium">OCR入力</span>
              </button>
            </div>
          </div>

          {/* 領収書画像アップロード */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {inputMode === 'ocr' 
                ? '領収書画像（AIが自動で金額・科目を認識します）' 
                : '領収書画像（任意）'}
            </label>
            <div className="mt-2">
              <label className="flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 hover:border-primary-500">
                {isProcessingOCR ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                    <span className="text-sm text-gray-600">OCR処理中...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-600">
                      {inputMode === 'ocr' 
                        ? 'クリックして画像をアップロード（自動認識）' 
                        : 'クリックして画像をアップロード（任意）'}
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isProcessingOCR}
                />
              </label>
            </div>
            {receiptImageUrl && (
              <div className="mt-4">
                <img
                  src={receiptImageUrl}
                  alt="領収書"
                  className="max-h-48 rounded-md border"
                />
                {inputMode === 'ocr' && (
                  <p className="mt-2 text-xs text-gray-500">
                    OCR処理が完了しました。内容を確認してください。
                  </p>
                )}
              </div>
            )}
          </div>

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
              科目 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              <option value="開業費">開業費（開業準備費用）</option>
              <option value="通信費">通信費</option>
              <option value="仕入れ">仕入れ</option>
              <option value="研修費">研修費</option>
              <option value="交通費">交通費</option>
              <option value="交際費">交際費</option>
              <option value="消耗品費">消耗品費</option>
              <option value="減価償却費">減価償却費</option>
              <option value="その他">その他</option>
            </select>
            {category === '開業費' && (
              <div className="mt-2 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                <p className="font-medium">開業費について</p>
                <p className="mt-1">
                  開業準備費用（登記費用、初期投資など）は開業費として計上できます。
                  開業費は一定の条件を満たす必要があります。詳細は税理士にご相談ください。
                </p>
              </div>
            )}
          </div>

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

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isDepreciation}
                onChange={(e) => setIsDepreciation(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-900">減価償却対象（10万円以上の備品など）</span>
            </label>
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
              disabled={isLoading || isProcessingOCR}
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

