import { GoogleGenAI } from "@google/genai";


export const useGetGenerativeModelGP = async (prompt: string) => {   
    const ai = new GoogleGenAI({
    apiKey: "AIzaSyApTMmcWmy6FqUKDNIfYUOLJQwyXP9xlQw"
});
    const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    const response = result.text;
    return response;
}