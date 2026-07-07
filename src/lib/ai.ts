import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBrzn4SChjyuDj1RujkDbOnlKecjGP31aI";
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
