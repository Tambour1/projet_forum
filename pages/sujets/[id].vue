<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const sujetId = route.params.id
const showForm = ref(false)
const newMessage = ref('')
const modalType = ref<null | 'login' | 'register'>(null)
const userStore = useUserStore()
const responseMessage = ref('')
const responseMessageType = ref<'success' | 'error' | ''>('')



const { data: sujetData, pending: pendingSujet } = useAsyncData(`sujet-${sujetId}`, () =>
  $fetch(`/api/sujets/${sujetId}`)
);

const errorSujet = computed(() => {
  if (!sujetData.value) return '';
  if (sujetData.value.status === 400 || sujetData.value.status === 500 || sujetData.value.status === 404) {
    return sujetData.value.message;
  }
  return '';
});

const sujet = computed(() => {
  return sujetData.value?.status === 200 ? sujetData.value?.sujet : {};
});

const { data: messageData, pending: pendingMessage } = useAsyncData(`sujet-${sujetId}-messages`, () =>
  $fetch(`/api/sujets/${sujetId}/messages`)
);

const errorMessage = computed(() => {
  if (!messageData.value) return '';
  if (messageData.value.status === 400 || messageData.value.status === 500) {
    return messageData.value.message;
  }
  return '';
});

const messages = computed(() => {
  return messageData.value?.status === 200 ? messageData.value?.messages : [];
});

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
      responseMessage.value = response.message
      responseMessageType.value = 'success'
      newMessage.value = ''
      showForm.value = false
    } else {
      responseMessage.value = response.message
      responseMessageType.value = 'error'
    }
  } catch (err: any) {
    responseMessage.value = 'Erreur inconnue lors de l’envoi.'
    responseMessageType.value = 'error'
  }

  setTimeout(() => {
    responseMessage.value = ''
    responseMessageType.value = ''
  }, 2000)
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

    <!-- Header du sujet -->
    <Loader v-if="pendingSujet && !errorSujet" message="Chargement du sujet..." />
    <div v-else-if="errorSujet" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ errorSujet }}
    </div>

    <div v-else-if="sujet">
      <SujetHead :sujet="sujet" :withDescription="true" :isLinkEnabled="false" />
    </div>

    <!-- Ajout de message -->
    <div class="border-2 border-gray-500 text-gray-400 hover:text-white px-4 py-3 rounded-xl w-full mb-6">
      <div v-if="!showForm && (!pendingSujet || !pendingMessage)" @click="openNewMessage" class="cursor-pointer">
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
    
    <!-- Messages concernant l'ajout de message -->
    <div v-if="responseMessage" :class="{
      'bg-green-100 text-green-700 border-green-400': responseMessageType === 'success',
      'bg-red-100 text-red-700 border-red-400': responseMessageType === 'error'
    }" class="border px-4 py-3 rounded mb-4">
      {{ responseMessage }}
    </div>

    <!-- Messages du sujet -->
    <Loader v-if="pendingMessage && !errorMessage" message="Chargement des messages..." />
    <div v-else-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ errorMessage }}
    </div>

    <div v-else-if="messages.length > 0">
      <Message v-for="message in messages" :key="message.id" :message="message" />
    </div>
    <div v-else class="text-gray-400 text-center mb-12">
      Aucun message trouvé.
    </div>

    <v-divider></v-divider>

    <!-- Modales -->
    <LoginModal v-if="modalType === 'login'" @close="modalType = null" @switch-to-register="modalType = 'register'" />
    <RegisterModal v-if="modalType === 'register'" @close="modalType = null" @switch-to-login="modalType = 'login'" />
  </div>
</template>
