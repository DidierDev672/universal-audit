import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { GenerativeModelProvider } from "../shared/types/generativeModel";

export const useGenerativeModelConfigStore = defineStore(
  "generativeModelConfig",
  () => {
    const provider = ref<GenerativeModelProvider>("gemini");
    const apiKey = ref("");

    const isConfigured = computed(() => apiKey.value.trim().length > 0);

    function setProvider(value: GenerativeModelProvider) {
      provider.value = value;
    }

    function setApiKey(value: string) {
      apiKey.value = value.trim();
    }

    function saveConfig(
      nextProvider: GenerativeModelProvider,
      nextApiKey: string,
    ) {
      provider.value = nextProvider;
      apiKey.value = nextApiKey.trim();
    }

    function clearApiKey() {
      apiKey.value = "";
    }

    return {
      provider,
      apiKey,
      isConfigured,
      setProvider,
      setApiKey,
      saveConfig,
      clearApiKey,
    };
  },
  { persist: true },
);
