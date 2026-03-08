import { useGenAI } from "./useGenAi";

export const useGetGenerativeModelGP = async (prompt: string) => {
    const model = await useGenAI();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}