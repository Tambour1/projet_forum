<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/solid';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const forumId = route.params.id;
const userStore = useUserStore();

const modalType = ref<null | 'login' | 'register'>(null);

const { data, pending } = useAsyncData('forum-sujets', () =>
  $fetch(`/api/forums/${forumId}`)
);

const errorMessage = computed(() => {
  if (!data.value) return '';
  if (data.value.status === 400 || data.value.status === 500 || data.value.status === 404) {
    return data.value.message;
  }
  return '';
});

const sujets = computed(() => {
  return data.value?.status === 200 ? data.value?.sujets : [];
});

const forumName = computed(() => {
  return data.value?.status === 200 ? data.value?.forum_name : '';
});

const openNewSujet = () => {
  if (!userStore.isAuthenticated) {
    modalType.value = 'login';
  } else {
    router.push(`/forums/${forumId}/new`);
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#1a1a1b] py-8 px-4">
    <!-- En-tête -->
    <div class="relative mb-24">
      <div class="w-full h-[150px] md:h-[182px] bg-center bg-cover rounded-lg"
        style="background-image: url('/banner.jpg');"></div>

      <div class="absolute left-6 -bottom-12 flex items-center w-full pr-6 justify-between">
        <div class="flex items-center">
          <div class="w-20 h-20 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
            <div class="w-full h-full bg-center bg-cover" style="background-image: url('/icon.jpg');"></div>
          </div>
          <h1 class="ml-4 text-2xl md:text-3xl font-bold text-white mt-12">
            /{{ forumName }}
          </h1>
        </div>

        <!-- Bouton -->
        <div
          class="border-2 border-gray-400 text-white hover:border-gray-300 px-4 py-2 rounded-xl mt-13 absolute right-6">
          <button @click="openNewSujet" class="flex items-center gap-2">
            <PlusIcon class="h-5 w-5 text-white" />
            Nouveau sujet
          </button>
        </div>
      </div>
    </div>

    <Loader v-if="pending && !errorMessage" message="Chargement des sujets..." />

    <div v-else-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ errorMessage }}
    </div>

    <div v-else-if="sujets.length > 0">
      <SujetHead v-for="sujet in sujets" :key="sujet.id" :sujet="sujet" :isLinkEnabled="true" />
    </div>

    <div v-else class="text-center text-gray-400 mt-8">
      Aucun sujet trouvé dans ce forum.
    </div>

    <!-- Modales -->
    <LoginModal v-if="modalType === 'login'" @close="modalType = null" @switch-to-register="modalType = 'register'" />
    <RegisterModal v-if="modalType === 'register'" @close="modalType = null" @switch-to-login="modalType = 'login'" />
  </div>
</template>
