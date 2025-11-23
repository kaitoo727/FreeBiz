// 経費のAI分類（API Route経由）
export async function classifyExpense(
  description: string,
  amount: number,
  receiptText?: string
): Promise<{ category: string; description: string }> {
  try {
    const response = await fetch('/api/ai/classify-expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        amount,
        receiptText,
      }),
    });

    if (!response.ok) {
      throw new Error('AI分類APIの呼び出しに失敗しました');
    }

    const data = await response.json();
    return {
      category: data.category || 'その他',
      description: data.description || description,
    };
  } catch (error) {
    console.error('AI分類エラー:', error);
    return { category: 'その他', description };
  }
}

// 売上のAI分類（API Route経由）
export async function classifyRevenue(
  description: string,
  amount: number,
  businessType: string
): Promise<{ category: string; description: string }> {
  try {
    const response = await fetch('/api/ai/classify-revenue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        amount,
        businessType,
      }),
    });

    if (!response.ok) {
      throw new Error('AI分類APIの呼び出しに失敗しました');
    }

    const data = await response.json();
    return {
      category: data.category || '売上',
      description: data.description || description,
    };
  } catch (error) {
    console.error('AI分類エラー:', error);
    return { category: '売上', description };
  }
}

