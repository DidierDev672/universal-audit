import { GoogleGenAI } from "@google/genai";


export const useGetGenerativeModelGP = async (prompt: string) => {   
    const ai = new GoogleGenAI({
    apiKey: "AIzaSyDIIdihE7XjR-7QroTgNYoike6OQjHSl88"
});
    const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    const response = result.text;
    return response;
}