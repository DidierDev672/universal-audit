import { GoogleGenAI } from "@google/genai";

export const useGetGenerativeModelGP = async (prompt: string) => {
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyDSBUAnxeT4DNWTF8XNg-U_kNnlcR-1V2g",
  });
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  const response = result.text;
  return response;
};
