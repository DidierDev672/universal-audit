import { GoogleGenAI } from "@google/genai";

export const useGetGenerativeModelGP = async (prompt: string) => {
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyAsXZPh1ijufWr1sy2WscK4IrK2S9020so",
  });
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  const response = result.text;
  return response;
};
