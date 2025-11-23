import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { description, amount, businessType } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        category: '売上',
        description: description || '',
      });
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
      parsed = { category: '売上', description: description || '' };
    }

    return NextResponse.json({
      category: parsed.category || '売上',
      description: parsed.description || description || '',
    });
  } catch (error: any) {
    console.error('AI分類エラー:', error);
    return NextResponse.json(
      {
        category: '売上',
        description: '',
        error: error.message || 'AI分類に失敗しました',
      },
      { status: 500 }
    );
  }
}

