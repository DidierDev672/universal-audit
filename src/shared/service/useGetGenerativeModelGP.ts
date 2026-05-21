import { GoogleGenAI } from "@google/genai";

export const useGetGenerativeModelGP = async (prompt: string) => {
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyBHU0wSwVOTGmpcLRAPBTMc7qnG9QGIcd0",
  });
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  const response = result.text;
  return response;
};
