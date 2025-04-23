<script setup lang="ts">
import { useForumStore } from '~/stores/forums'

const forumStore = useForumStore()

await forumStore.fetchForums()
</script>


<template>
  <div class="min-h-screen bg-[#1a1a1b] py-8 px-4">
    <!-- Loader de chargement -->
    <Loader :isLoading="forumStore.isLoading && !forumStore.hasError" message="Chargement des forums..." />

    <!-- Message d'erreur -->
    <div v-if="forumStore.hasError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ forumStore.error }}
    </div>

    <!--Page principale-->
    <div v-if="forumStore.getForums.length > 0 && !forumStore.isLoading && !forumStore.hasError" class="space-y-6">
      <h1 class="text-3xl md:text-4xl font-bold text-white text-center mb-6">Bienvenue sur Raiedit</h1>

      <!-- Liste des forums -->
      <NuxtLink v-for="forum in forumStore.getForums" :key="forum.id" :to="`/forums/${forum.id}`"
        class="block bg-[#1a1a1b] border-2 border-gray-700 hover:border-gray-500 rounded-md p-5 transition duration-200 cursor-pointer hover:bg-[#212122]">

        <h2 class="text-lg md:text-xl font-semibold text-pink-400">
          {{ forum.name }}
        </h2>

        <p class="text-gray-400 mt-1 text-sm">
          {{ forum.description}}
        </p>
      </NuxtLink>

    </div>

    <!-- Message si aucun forum n'est trouvé -->
    <div v-else-if="!forumStore.isLoading" class="max-w-3xl mx-auto text-center mt-10">
      <h1 class="text-3xl md:text-4xl font-bold text-white">Aucun forum trouvé</h1>
      <p class="text-gray-400 mt-2">Il n'y a pas de forums disponibles pour le moment.</p>
    </div>
  </div>
</template>
