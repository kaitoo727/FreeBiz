import { createWorker } from 'tesseract.js';

// OCRで領収書からテキストを抽出
export async function extractTextFromImage(imageFile: File): Promise<string> {
  try {
    const worker = await createWorker('jpn');
    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('OCRエラー:', error);
    throw new Error('画像からテキストを抽出できませんでした');
  }
}

// 領収書から金額を抽出
export function extractAmountFromText(text: string): number | null {
  // 金額パターンを検索（円、¥、数字など）
  const patterns = [
    /(?:合計|総額|税込|税抜|金額)[\s:：]*[¥￥]?[\s]*(\d{1,3}(?:,\d{3})*)/,
    /[¥￥][\s]*(\d{1,3}(?:,\d{3})*)/,
    /(\d{1,3}(?:,\d{3})*)[\s]*円/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1].replace(/,/g, ''));
    }
  }

  return null;
}

