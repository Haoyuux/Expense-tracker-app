
// import { GoogleGenAI, Type } from "@google/genai";
// import { Transaction, SpendingInsight, ReceiptData } from "../types";
// import { CURRENCY_SYMBOL } from "../constants";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// export const getSpendingInsights = async (transactions: Transaction[]): Promise<SpendingInsight[]> => {
//   if (transactions.length === 0) return [];

//   const summary = transactions.slice(0, 50).map(t => 
//     `${t.date}: ${t.type} of ${CURRENCY_SYMBOL}${t.amount} for ${t.category} (${t.description})`
//   ).join('\n');

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       contents: `You are Blaise, a smart financial assistant for users in the Philippines. 
//       Analyze these recent transactions (all values are in Philippine Pesos - PHP) and provide 3 smart financial insights. 
//       Focus on patterns, potential savings, or local spending habits.
//       Transactions:
//       ${summary}`,
//       config: {
//         responseMimeType: "application/json",
//         responseSchema: {
//           type: Type.ARRAY,
//           items: {
//             type: Type.OBJECT,
//             properties: {
//               title: { type: Type.STRING },
//               description: { type: Type.STRING },
//               type: { type: Type.STRING, enum: ['saving', 'warning', 'tip'] }
//             },
//             required: ['title', 'description', 'type']
//           }
//         }
//       }
//     });

//     return JSON.parse(response.text || '[]');
//   } catch (error) {
//     console.error("Error getting insights:", error);
//     return [];
//   }
// };

// export const parseReceipt = async (base64Image: string): Promise<ReceiptData | null> => {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       contents: [
//         {
//           inlineData: {
//             mimeType: "image/jpeg",
//             data: base64Image.split(',')[1] || base64Image
//           }
//         },
//         {
//           text: "Extract the total amount, category, date (YYYY-MM-DD), and a brief description from this receipt. Assume the currency is Philippine Pesos (PHP)."
//         }
//       ],
//       config: {
//         responseMimeType: "application/json",
//         responseSchema: {
//           type: Type.OBJECT,
//           properties: {
//             amount: { type: Type.NUMBER },
//             category: { type: Type.STRING },
//             date: { type: Type.STRING },
//             description: { type: Type.STRING }
//           },
//           required: ['amount', 'category', 'date', 'description']
//         }
//       }
//     });

//     return JSON.parse(response.text || '{}');
//   } catch (error) {
//     console.error("Error parsing receipt:", error);
//     return null;
//   }
// };
