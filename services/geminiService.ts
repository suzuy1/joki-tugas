import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionType } from "../types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const suggestCategory = async (description: string, type: TransactionType): Promise<string | null> => {
  const ai = getClient();
  if (!ai) return null;

  const categories = type === TransactionType.EXPENSE ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const prompt = `
    Saya memiliki transaksi keuangan dengan deskripsi: "${description}".
    Tolong kategorikan transaksi ini ke dalam salah satu kategori berikut: ${categories.join(', ')}.
    Jika tidak ada yang cocok, pilih "Lainnya".
    Hanya kembalikan nama kategorinya saja.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING }
          },
          required: ["category"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    const json = JSON.parse(text);
    return json.category || "Lainnya";

  } catch (error) {
    console.error("Error suggesting category:", error);
    return null;
  }
};

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Maaf, kunci API belum dikonfigurasi.";

  // Simplify data for token efficiency
  const summary = transactions.map(t => ({
    date: t.date.split('T')[0],
    desc: t.description,
    amt: t.amount,
    type: t.type,
    cat: t.category
  }));

  const prompt = `
    Bertindaklah sebagai penasihat keuangan pribadi yang bijak dan ramah.
    Mata uang yang digunakan adalah Rupiah (IDR).
    
    Berikut adalah riwayat transaksi pengguna dalam format JSON:
    ${JSON.stringify(summary)}

    Tolong berikan analisis singkat dan saran yang dapat ditindaklanjuti (maksimal 3 poin utama) dalam Bahasa Indonesia.
    Fokus pada pola pengeluaran, peluang penghematan, atau pujian jika keuangan sehat.
    Gunakan format Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Tidak ada saran yang tersedia saat ini.";
  } catch (error) {
    console.error("Error getting advice:", error);
    return "Maaf, terjadi kesalahan saat menganalisis data keuangan Anda.";
  }
};