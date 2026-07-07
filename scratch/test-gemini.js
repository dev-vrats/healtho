import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBrzn4SChjyuDj1RujkDbOnlKecjGP31aI";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Hello, are you working?");
    console.log(await result.response.text());
  } catch(e) {
    console.error("ERROR:", e);
  }
}
run();
