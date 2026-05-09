import { GoogleGenAI } from "@google/genai";


export const useGetGenerativeModelGP = async (prompt: string) => {   
    const ai = new GoogleGenAI({
    apiKey: "AIzaSyB8fRJtuLeziB1NIewDWrZ95MinCEqVOfg"
});
    const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    const response = result.text;
    return response;
}