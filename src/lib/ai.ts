import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateHealthInsight(biomarkers: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an AI health companion for an app called Healtho.
Your goal is to provide a very short, calm, encouraging, and plain-language summary (1-2 sentences max) based on the user's latest biomarker data.
Do not use medical jargon. Make the user feel informed and hopeful.

Here is the data:
${JSON.stringify(biomarkers, null, 2)}

Provide just the short summary string, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating AI insight:", error);
    return "Your health is stabilizing. Keep up the good work!";
  }
}

export async function analyzeMedicalReport(base64Data: string, mimeType: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are a medical data extraction AI. Extract the biomarkers and lab results from this document.
Respond ONLY with a valid JSON array of objects. Do not include markdown code blocks or any other text.
Each object must have the following exact keys:
- "label": String (e.g. "Fasting Blood Sugar", "Iron")
- "value": Number (the numeric value found)
- "unit": String (e.g. "mg/dL")
- "category": String (must be one of: "heart", "thyroid", "immune", "hormone", "metabolic", "nutrients", "blood", "longevity")
- "status": String (must be one of: "optimal", "in-range", "out-of-range" based on typical medical reference ranges if provided, or default to in-range if unsure).`;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text().trim();
    
    // Attempt to parse the JSON (stripping markdown if the model hallucinated it)
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error analyzing medical report:", error);
    throw new Error("Failed to analyze report");
  }
}
