<template>
  <div class="note-node" :class="noteColorClass">
    <div class="note-title">{{ truncatedTitle }}</div>
    <div class="note-content">{{ truncatedContent }}</div>
    <div class="note-footer">
      <span class="note-date">{{ formattedDate }}</span>
      <div class="note-actions">
        <button @click="$emit('addContext')" class="context-btn" title="Agregar contexto">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button @click="$emit('expand')" class="expand-btn" title="Ver nota completa">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Contexto agregado -->
    <div v-if="props.data.context" class="note-context">
      <div class="context-label">Contexto:</div>
      <div class="context-text">{{ props.data.context }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'NoteNode'
});

interface NoteData {
  title: string;
  content: string;
  createdAt: string;
  color?: string;
  context?: string;
}

const props = defineProps<{
  data: NoteData;
}>();

const emit = defineEmits<{
  expand: [];
  addContext: [];
}>();

const truncatedTitle = computed(() => {
  const title = props.data.title || '';
  if (title.length <= 40) return title;
  return title.substring(0, 40) + '...';
});

const truncatedContent = computed(() => {
  const content = props.data.content || '';
  if (content.length <= 80) return content;
  return content.substring(0, 80) + '...';
});

const formattedDate = computed(() => {
  const date = new Date(props.data.createdAt);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
});

const noteColorClass = computed(() => {
  return props.data.color || 'bg-white';
});
</script>

<style scoped>
.note-node {
  width: 240px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.note-title {
  font-weight: 600;
  font-size: 14px;
  color: #1F2937;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-content {
  font-size: 12px;
  color: #6B7280;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-date {
  font-size: 11px;
  color: #9CA3AF;
}

.note-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.expand-btn {
  padding: 4px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  transition: all 0.2s;
}

.expand-btn:hover {
  background: white;
  border-color: #6366F1;
  color: #6366F1;
}

.note-actions {
  display: flex;
  gap: 4px;
}

.context-btn {
  padding: 4px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  transition: all 0.2s;
}

.context-btn:hover {
  background: white;
  border-color: #10B981;
  color: #10B981;
}

.note-context {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #E5E7EB;
}

.context-label {
  font-size: 10px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.context-text {
  font-size: 11px;
  color: #4B5563;
  line-height: 1.4;
  font-style: italic;
}
</style>
