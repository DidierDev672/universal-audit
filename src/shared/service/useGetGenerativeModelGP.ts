import { GoogleGenAI } from "@google/genai";
import { useGenerativeModelConfigStore } from "@/stores/generativeModelConfig";
import {
  DEFAULT_MODEL_BY_PROVIDER,
  type GenerativeModelProvider,
} from "@/shared/types/generativeModel";

function getConfig() {
  const store = useGenerativeModelConfigStore();
  const key = store.apiKey.trim();
  if (!key) {
    throw new Error(
      "No hay API key configurada. Configúrala en Configuración de modelo IA.",
    );
  }
  return { provider: store.provider, apiKey: key };
}

async function generateWithGemini(apiKey: string, prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const result = await ai.models.generateContent({
    model: DEFAULT_MODEL_BY_PROVIDER.gemini,
    contents: prompt,
  });
  const text = result.text;
  if (!text) throw new Error("Gemini no devolvió texto en la respuesta.");
  return text;
}

async function generateWithClaude(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL_BY_PROVIDER.claude,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error (${res.status}): ${err}`);
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const block = data.content?.find((c) => c.type === "text");
  if (!block?.text) throw new Error("Claude no devolvió texto en la respuesta.");
  return block.text;
}

async function generateWithCodex(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL_BY_PROVIDER.codex,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Codex/OpenAI no devolvió texto en la respuesta.");
  return text;
}

const generators: Record<
  GenerativeModelProvider,
  (apiKey: string, prompt: string) => Promise<string>
> = {
  gemini: generateWithGemini,
  claude: generateWithClaude,
  codex: generateWithCodex,
};

export const useGetGenerativeModelGP = async (prompt: string) => {
  const { provider, apiKey } = getConfig();
  const generate = generators[provider];
  return generate(apiKey, prompt);
};
