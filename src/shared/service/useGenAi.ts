import { GoogleGenerativeAI } from "@google/generative-ai";

export const  useGenAI = () => {
    const VITE_GOOGLE_AI_STUDIO_API_KEY = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY || 'AIzaSyA0d131iHkh88ar3uiiQoiEBQRSJ-q7J7c';
    const genAI = new GoogleGenerativeAI(VITE_GOOGLE_AI_STUDIO_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });
    return model;
}