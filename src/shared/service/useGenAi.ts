import { GoogleGenerativeAI } from "@google/generative-ai";

export const  useGenAI = () => {
    const VITE_GOOGLE_AI_STUDIO_API_KEY = "AIzaSyCOAloAa18URxqe1QTQE_sAUg_JQPMDzcQ";
    const genAI = new GoogleGenerativeAI(VITE_GOOGLE_AI_STUDIO_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    return model;
}