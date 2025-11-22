import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// 経費のAI分類
export async function classifyExpense(
  description: string,
  amount: number,
  receiptText?: string
): Promise<{ category: string; description: string }> {
  if (!process.env.OPENAI_API_KEY) {
    // APIキーがない場合はデフォルト値を返す
    return { category: 'その他', description };
  }

  const prompt = `以下の経費情報を分析し、適切な会計科目を提案してください。

説明: ${description}
金額: ${amount}円
${receiptText ? `領収書テキスト: ${receiptText}` : ''}

以下の科目から最も適切なものを選択してください：
- 通信費（インターネット、電話代など）
- 仕入れ（商品の仕入れ）
- 研修費（セミナー、書籍など）
- 交通費（電車、タクシーなど）
- 交際費（飲食代など）
- 消耗品費（文房具、備品など）
- 減価償却費（高額な備品など）
- その他

JSON形式で返答してください：
{
  "category": "科目名",
  "description": "整理された説明文"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || '';
    const parsed = JSON.parse(response);
    return {
      category: parsed.category || 'その他',
      description: parsed.description || description,
    };
  } catch (error) {
    console.error('AI分類エラー:', error);
    return { category: 'その他', description };
  }
}

// 売上のAI分類
export async function classifyRevenue(
  description: string,
  amount: number,
  businessType: string
): Promise<{ category: string; description: string }> {
  if (!process.env.OPENAI_API_KEY) {
    return { category: '売上', description };
  }

  const prompt = `以下の売上情報を分析し、適切な会計科目を提案してください。

説明: ${description}
金額: ${amount}円
事業タイプ: ${businessType}

JSON形式で返答してください：
{
  "category": "科目名",
  "description": "整理された説明文"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || '';
    const parsed = JSON.parse(response);
    return {
      category: parsed.category || '売上',
      description: parsed.description || description,
    };
  } catch (error) {
    console.error('AI分類エラー:', error);
    return { category: '売上', description };
  }
}

