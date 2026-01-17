// utils/geminiClient.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Gemini 1.5 Flash (fast + cheap) or Pro (better reasoning)
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export default genAI;
