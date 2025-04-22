<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();
const sujets = ref([]);
const errorMessage = ref('');
const forumId = route.params.id;

const showLoginModal = ref(false);

const handleNewSujetClick = async () => {
  const { session } = await useSession();

  if (!session.value?.user) {
    showLoginModal.value = true;
  } else {
    router.push(`/forums/${forumId}/new`);
  }
};

const { data, error } = await useAsyncData('forum-sujets', () =>
  $fetch(`/api/forums/${forumId}`)
);

if (error.value) {
  errorMessage.value = "Erreur lors du chargement des sujets.";
} else if (!Array.isArray(data.value?.sujets)) {
  errorMessage.value = "Réponse invalide du serveur.";
} else {
  sujets.value = data.value.sujets;
}
</script>

<template>
  <div class="min-h-screen bg-[#1a1a1b] py-8 px-4">

    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="bg-red-100 text-red-700 p-4 rounded mb-4">
      {{ errorMessage }}
    </div>

    <!-- En-tête du forum -->
    <div class="relative mb-24">
      <!-- Bannière -->
      <div class="w-full h-[150px] md:h-[182px] bg-center bg-cover rounded-lg"
        style="background-image: url('/banner.jpg');">
      </div>

      <!-- Icône + Titre + Bouton -->
      <div class="absolute left-6 -bottom-12 flex items-center w-full pr-6 justify-between">
        <!-- Icône + nom -->
        <div class="flex items-center">
          <div class="w-20 h-20 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
            <div class="w-full h-full bg-center bg-cover" style="background-image: url('/icon.jpg');">
            </div>
          </div>
          <h1 class="ml-4 text-2xl md:text-3xl font-bold text-white mt-12">
            /{{ data.forum_name }}
          </h1>
        </div>

        
        <!-- Bouton -->
        <button class="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow mt-12"
          @click="handleNewSujetClick">
          Nouveau sujet
        </button>

      </div>
    </div>

    <!-- Liste des sujets -->
    <div v-if="sujets.length > 0">
      <SujetHead v-for="sujet in sujets" :key="sujet.id" :sujet="sujet" />
    </div>

    <LoginModal v-if="showLoginModal" @close="showLoginModal = false" />

    <!-- Aucun sujet -->
    <div v-else class="text-center text-gray-600 pt-16">
      Aucun sujet trouvé pour ce forum.
    </div>
  </div>
</template>
