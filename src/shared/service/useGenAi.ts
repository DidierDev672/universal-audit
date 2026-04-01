import { GoogleGenerativeAI } from "@google/generative-ai";

export const  useGenAI = () => {
    const VITE_GOOGLE_AI_STUDIO_API_KEY = "AIzaSyAuCYSS-DjwCQE2fC4YV-X_GxOLHeU4FXc";
    const genAI = new GoogleGenerativeAI(VITE_GOOGLE_AI_STUDIO_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
    return model;
}