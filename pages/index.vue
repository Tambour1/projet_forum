<script setup lang="ts">
import { useForumStore } from '~/stores/forums'

const forumStore = useForumStore()

await forumStore.fetchForums()
</script>


<template>
  <div class="min-h-screen bg-[#1a1a1b] py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-6 text-center text-gray-100">Forums</h1>

      <div v-if="forumStore.hasError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ forumStore.error }}
      </div>

      <div v-else-if="forumStore.isLoading" class="text-center text-gray-300">
        Chargement des forums...
      </div>

      <div v-else-if="forumStore.getForums.length > 0" class="space-y-4">
        <div
          v-for="forum in forumStore.getForums"
          :key="forum.id"
          class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
        >
          <h2 class="text-2xl font-semibold text-blue-600">{{ forum.name }}</h2>
          <p class="text-gray-600 mt-2">
            {{ forum.description || 'Aucune description disponible.' }}
          </p>
        </div>
      </div>

      <div v-else class="text-center text-gray-400">
        <p>Aucun forum disponible pour le moment.</p>
      </div>
    </div>
  </div>
</template>
