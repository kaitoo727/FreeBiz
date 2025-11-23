import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { description, amount, receiptText } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      // APIキーがない場合はデフォルト値を返す
      return NextResponse.json({
        category: 'その他',
        description: description || '',
      });
    }

    const prompt = `以下の経費情報を分析し、適切な会計科目を提案してください。

説明: ${description}
金額: ${amount}円
${receiptText ? `領収書テキスト: ${receiptText.substring(0, 500)}` : ''}

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || '';
    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch {
      // JSON解析に失敗した場合はデフォルト値を返す
      parsed = { category: 'その他', description: description || '' };
    }

    return NextResponse.json({
      category: parsed.category || 'その他',
      description: parsed.description || description || '',
    });
  } catch (error: any) {
    console.error('AI分類エラー:', error);
    return NextResponse.json(
      {
        category: 'その他',
        description: '',
        error: error.message || 'AI分類に失敗しました',
      },
      { status: 500 }
    );
  }
}

