<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center mt-16 mb-6 text-gray-300">
    <div class="w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" aria-label="Chargement..."></div>
    <p v-if="message" class="mt-4 text-sm animate-pulse">{{ message }}</p>
  </div>
</template>
