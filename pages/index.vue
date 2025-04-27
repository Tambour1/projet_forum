<script setup lang="ts">
import { useForumStore } from '~/stores/forums'

const forumStore = useForumStore()

await forumStore.fetchForums()
</script>


<template>
  <div class="min-h-screen bg-[#1a1a1b] py-8 px-4">
    <h1 class="text-3xl md:text-4xl font-bold text-white text-center mb-6">Bienvenue sur Raiedit</h1>
    <!-- Loader de chargement -->
    <Loader v-if="forumStore.isLoading && !forumStore.hasError" message="Chargement des forums..." />

    <!-- Message d'erreur -->
    <div v-else-if="forumStore.hasError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ forumStore.error }}
    </div>

    <!--Page principale-->
    <div v-else-if="forumStore.getForums.length > 0 && !forumStore.isLoading && !forumStore.hasError" class="space-y-6">      

      <!-- Liste des forums -->
      <NuxtLink v-for="forum in forumStore.getForums" :key="forum.id" :to="`/forums/${forum.id}`"
        class="block bg-[#1a1a1b] border-2 border-gray-700 hover:border-gray-500 rounded-md p-5 transition duration-200 cursor-pointer hover:bg-[#212122]">

        <h2 class="text-lg md:text-xl font-semibold text-pink-400">
          {{ forum.name }}
        </h2>

        <p class="text-gray-400 mt-1 text-sm">
          {{ forum.description }}
        </p>

        <p class="text-gray-500 mt-2 text-xs italic">
          {{ forum.sujetsCount }} sujet{{ forum.sujetsCount > 1 ? 's' : '' }}
        </p>
      </NuxtLink>

    </div>
    <!-- Message si aucun forum n'est trouvé -->
    <div v-else class="italic text-gray-500 text-center">
      Aucun forum trouvé.
      </div>
  </div>
</template>
