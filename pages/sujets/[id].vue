<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const sujetId = route.params.id
const showForm = ref(false)
const newMessage = ref('')
const isLoadingSujet = ref(true)
const errorMessageSujet = ref('')
const isLoadingMessage = ref(true)
const errorMessage = ref('')
const modalType = ref<null | 'login' | 'register'>(null)
const userStore = useUserStore()

// const { data : sujetData } = await useAsyncData(`sujet-${sujetId}`, () => {
//   try {
//     isLoadingSujet.value = true; 
//     return $fetch(`/api/sujets/${sujetId}`);
//   } finally {
//     isLoadingSujet.value = false;
//   }
// }
// );

// const { data : messagesData } = await useAsyncData(`sujet-${sujetId}-messages`, () => {
//   try {
//     isLoadingMessage.value = true; 
//     return $fetch(`/api/sujets/${sujetId}/messages`);
//   } finally {
//     isLoadingMessage.value = false;
//   }
// }
// );
const { data: sujetData } = await useAsyncData(`sujet-${sujetId}`, async () => {
  try {
    isLoadingSujet.value = true;
    const response = await Promise.resolve({
      status: 200,
      message: 'Erreur blabla',
      sujet: {
        id: 1,
        author: 'testuser',
        created_at: '2024-04-22 12:00:00',
        forum_name: 'Forum Général',
        title: 'Sujet de test très intéressant',
        content: 'Voici un exemple de contenu pour tester le rendu dans le composant.',
      }
    }
    )
    return response;
  } finally {
    isLoadingSujet.value = false;
  }
}
)

const { data: messagesData } = await useAsyncData(`sujet-${sujetId}-messages`, async () => {
  try {
    isLoadingMessage.value = true;
    const response = await Promise.resolve({
      status: 200,
      message: "Blablaa",
      messages: [
        {
          id: 1,
          content: 'Je trouve ce sujet vraiment intéressant !',
          author: 'user42',
          created_at: '2024-04-22 12:30:00'
        },
        {
          id: 2,
          content: 'Merci pour le partage, ça m’a aidé à comprendre un truc.',
          author: 'devnoob',
          created_at: '2024-04-22 13:15:00'
        },
        {
          id: 3,
          content: 'Petite question : tu pourrais préciser un point ?',
          author: 'curiouscat',
          created_at: '2024-04-22 14:00:00'
        }
      ]
    })
    return response;
  } finally {
    isLoadingMessage.value = false
  }
})

if (sujetData.value?.status === 400 || sujetData.value?.status === 500 || sujetData.value?.status === 404) {
  errorMessageSujet.value = sujetData.value.message;
} else if (sujetData.value?.status === 200) {
  errorMessageSujet.value = '';
}

if (messagesData.value?.status === 400 || messagesData.value?.status === 500) {
  errorMessage.value = messagesData.value.message;
} else if (sujetData.value?.status === 200) {
  errorMessage.value = '';
}

const sujet = computed(() => sujetData.value?.sujet)
const messages = computed(() => messagesData.value?.messages)

async function sendMessage() {
  if (!newMessage.value.trim()) return

  try {
    const response = await $fetch(`/api/sujets/${sujetId}/messages`, {
      method: 'POST',
      body: {
        content: newMessage.value
      }
    })

    if (response.status === 200) {
      newMessage.value = ''
      showForm.value = false
    }
  } catch (err) {
    console.error('Erreur lors de l’envoi du message', err)
  }
}

function openNewMessage() {
  if (!userStore.isAuthenticated) {
    modalType.value = 'login'
  } else {
    showForm.value = true
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#1a1a1b] py-8 px-4">
    <SujetHead v-if="sujet && !errorMessageSujet && !isLoadingSujet" :sujet="sujet" :withDescription="true" :isLinkEnabled="false" />
    <!-- Message d'erreur sujet -->
    <div v-if="errorMessageSujet" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ errorMessageSujet }}
    </div>
    <Loader :isLoading="isLoadingSujet && !errorMessageSujet" message="Chargement du sujet..." />

    <div class="border-2 border-gray-500 text-gray-400 hover:text-white px-4 py-3 rounded-xl w-full mb-6">
      <!-- Affichage par défaut : bouton -->
      <div v-if="!showForm" @click="openNewMessage" class="cursor-pointer">
        Ajouter un message
      </div>

      <!-- Formulaire après clic -->
      <div v-else>
        <textarea v-model="newMessage" rows="3" placeholder="Ajouter un message"
          class="w-full p-3 rounded-md text-white resize-none focus:outline-none focus:ring-transparent"></textarea>
        <div class="mt-3 flex justify-end gap-2">
          <button @click="showForm = false" class="px-4 py-2 rounded-full bg-gray-600 text-white hover:bg-gray-700">
            Annuler
          </button>
          <button @click="sendMessage" class="px-4 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-700">
            Envoyer
          </button>
        </div>
      </div>
    </div>

    <Message v-if="messages && !errorMessage && !isLoadingMessage" v-for="message in messages" :key="message.id" :message="message" />
    
    <!-- Message d'erreur messages -->
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ errorMessage }}
    </div>

    <Loader :isLoading="isLoadingMessage && !errorMessage" message="Chargement des messages..." />
    <v-divider></v-divider>

    <!-- Modales -->
    <LoginModal v-if="modalType === 'login'" @close="modalType = null" @switch-to-register="modalType = 'register'" />
    <RegisterModal v-if="modalType === 'register'" @close="modalType = null" @switch-to-login="modalType = 'login'" />
  </div>
</template>
