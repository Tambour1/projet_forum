<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { timeSince } from '../../mixins/utils'

const route = useRoute();
const sujets = ref([]);
const errorMessage = ref('');
const forumId = route.params.id;

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
    <div class="relative mb-24">
      <!-- Bannière -->
      <div class="w-full h-[150px] md:h-[182px] bg-center bg-cover rounded-lg"
        style="background-image: url('/banner.jpg');">
      </div>

      <!-- Bloc d'en-tête superposé -->
      <div class="absolute left-6 -bottom-12 flex items-center w-full pr-6 justify-between">
        <!-- Icône + Nom du forum -->
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
        <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-12">
          Ajouter un sujet
        </button>
      </div>
    </div>





    <div v-if="errorMessage" class="bg-red-100 text-red-700 p-4 rounded mb-4">
      {{ errorMessage }}
    </div>

    <div v-else-if="sujets.length > 0" class="space-y-4">
      <div v-for="sujet in sujets" :key="sujet.id"
        class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
        <div class="flex justify-between items-start align-center mb-4">
          <!-- Partie à gauche (Image + Nom du Forum) -->
          <div class="flex items-center">
            <img src="/public/utilisateur.png" alt="profil" class="rounded-full mr-4" width="40" height="40" />
            <p>Publié par <strong>{{ sujet.author }}</strong>, {{ timeSince(sujet.created_at) }}</p>
          </div>

          <!-- Partie à droite (Posté par + Temps) avec alignement à droite -->
          <div class="text-sm text-gray-500 ml-auto text-right">
            <p class="text-lg font-semibold text-gray-800">{{ sujet.forum_name }}</p>
          </div>
        </div>

        <h2 class="text-xl font-semibold text-gray-800">{{ sujet.title }}</h2>
      </div>
    </div>

    <div v-else class="text-center text-gray-600">
      Aucun sujet trouvé pour ce forum.
    </div>
  </div>
</template>
