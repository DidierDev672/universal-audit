<template>
    <div>
        <p v-if="answer">{{ answer }}</p>
    </div>
</template>
<script setup lang="ts">
    defineProps<{
        answer: string;
    }>();
</script>
<style scoped>

</style>