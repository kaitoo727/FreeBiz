'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BusinessType, BusinessTypeLabels } from '@/types';
import { CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, title: '事業タイプの選択', description: 'あなたの事業に最も近いタイプを選択してください' },
  { id: 2, title: '基本情報の入力', description: '事業名や申告タイプを設定します' },
  { id: 3, title: 'チュートリアル', description: 'アプリの使い方を学びます' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [taxFilingType, setTaxFilingType] = useState<'blue' | 'white'>('white');
  const [isSideBusiness, setIsSideBusiness] = useState(false);
  const [salaryIncome, setSalaryIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 認証チェック
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth/login');
      }
    });
  }, [router]);

  const handleNext = async () => {
    if (currentStep === 1 && !businessType) {
      alert('事業タイプを選択してください');
      return;
    }

    if (currentStep === 2) {
      // プロファイルを作成
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from('user_profiles').insert({
          user_id: user.id,
          business_type: businessType,
          business_name: businessName || null,
          tax_filing_type: taxFilingType,
          is_side_business: isSideBusiness,
          salary_income: isSideBusiness ? salaryIncome : 0,
        });

        if (error) {
          console.error('プロファイル作成エラー:', error);
          alert('エラーが発生しました');
          setIsLoading(false);
          return;
        }
      }
      setIsLoading(false);
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* ステップインジケーター */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      currentStep >= step.id
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <p className="mt-2 text-xs font-medium text-gray-600">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-1 w-24 ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ステップコンテンツ */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            {steps[currentStep - 1].title}
          </h2>
          <p className="mb-6 text-gray-600">{steps[currentStep - 1].description}</p>

          {currentStep === 1 && (
            <div className="space-y-4">
              {Object.entries(BusinessTypeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setBusinessType(key as BusinessType)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    businessType === key
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">{label}</span>
                    {businessType === key && (
                      <CheckCircle className="h-6 w-6 text-primary-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  事業名（任意）
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  placeholder="例: 山田商店"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  申告タイプ
                </label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="white"
                      checked={taxFilingType === 'white'}
                      onChange={(e) => setTaxFilingType(e.target.value as 'white')}
                      className="mr-2"
                    />
                    <span className="text-gray-900">白色申告</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="blue"
                      checked={taxFilingType === 'blue'}
                      onChange={(e) => setTaxFilingType(e.target.value as 'blue')}
                      className="mr-2"
                    />
                    <span className="text-gray-900">青色申告（65万円控除）</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSideBusiness}
                    onChange={(e) => setIsSideBusiness(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-900">副業として行っています</span>
                </label>
              </div>

              {isSideBusiness && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    給与所得（年収）
                  </label>
                  <input
                    type="number"
                    value={salaryIncome}
                    onChange={(e) => setSalaryIncome(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                    placeholder="5000000"
                  />
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="font-semibold text-blue-900">売上の登録方法</h3>
                <p className="mt-2 text-sm text-blue-800">
                  売上は手入力、CSVインポート、API連携のいずれかで登録できます。
                  {businessType === 'retail' && '物販の場合は商品ごとに管理できます。'}
                  {(businessType === 'service' || businessType === 'creative' || businessType === 'consulting') &&
                    'サービス業の場合は案件ごとに管理できます。'}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="font-semibold text-green-900">経費の登録方法</h3>
                <p className="mt-2 text-sm text-green-800">
                  領収書の画像をアップロードすると、AIが自動で金額や科目を認識します。
                  承認するだけで登録が完了します。
                </p>
              </div>

              <div className="rounded-lg bg-purple-50 p-4">
                <h3 className="font-semibold text-purple-900">帳簿の自動生成</h3>
                <p className="mt-2 text-sm text-purple-800">
                  売上と経費を登録すると、自動で帳簿が作成されます。
                  青色申告の場合は複式簿記にも対応しています。
                </p>
              </div>

              <div className="rounded-lg bg-orange-50 p-4">
                <h3 className="font-semibold text-orange-900">確定申告</h3>
                <p className="mt-2 text-sm text-orange-800">
                  確定申告書類は自動で生成されます。
                  税金シミュレーターで納税額を事前に確認できます。
                </p>
              </div>
            </div>
          )}

          {/* ナビゲーションボタン */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              戻る
            </button>
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? '処理中...' : currentStep === steps.length ? '完了' : '次へ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

