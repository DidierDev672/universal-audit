import { GoogleGenAI } from "@google/genai";

export const useGetGenerativeModelGP = async (prompt: string) => {
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyB3Bb6LFJvYkjauytuks1jMccTktc0cWdE",
  });
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  const response = result.text;
  return response;
};
