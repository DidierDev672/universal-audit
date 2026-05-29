export type GenerativeModelProvider = "codex" | "gemini" | "claude";

export const GENERATIVE_MODEL_PROVIDER_LABELS: Record<
  GenerativeModelProvider,
  string
> = {
  codex: "Codex (OpenAI)",
  gemini: "Gemini (Google)",
  claude: "Claude (Anthropic)",
};

export const DEFAULT_MODEL_BY_PROVIDER: Record<
  GenerativeModelProvider,
  string
> = {
  codex: "gpt-4o",
  gemini: "gemini-3-flash-preview",
  claude: "claude-sonnet-4-20250514",
};
