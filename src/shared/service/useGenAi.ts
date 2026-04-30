import { GoogleGenerativeAI } from "@google/generative-ai";

export const useGenAI = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY;

    if (!apiKey) {
        throw new Error("VITE_GOOGLE_AI_STUDIO_API_KEY no está configurada. Añádela al archivo .env");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    return model;
}