<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification';

const route = useRoute()
const sujetId = route.params.id
const showForm = ref(false)
const newMessage = ref('')
const modalType = ref<null | 'login' | 'register'>(null)

const userStore = useUserStore()
const notificationStore = useNotificationStore()

let ws : WebSocket

const connectWebSocket = () => {
  const isSecure = location.protocol === 'https:'
  const url = `${isSecure ? 'wss' : 'ws'}://${location.host}/_ws`

  if (ws) {
    ws.close()
  }

  ws = new WebSocket(url)

  ws.addEventListener('open', () => {
    console.log('WebSocket connecté!')
  })

  ws.addEventListener('message', (event) => {
    const message = event.data
    console.log(`Message recu via Websocket: ${message}`)

    if(message === 'pong') {
      refreshMessages()
    }
  })

  ws.addEventListener('close', () => {
    console.log('WebSocket déconnecté. Reconnexion...')
    setTimeout(connectWebSocket, 3000)
  })
}

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  if (ws) {
    ws.close()
  }
})

const { data: sujetData, pending: pendingSujet } = useAsyncData(`sujet-${sujetId}`, () =>
  $fetch(`/api/sujets/${sujetId}`)
);

const { data: messageData, pending: pendingMessage } = useAsyncData(`sujet-${sujetId}-messages`, () =>
  $fetch(`/api/sujets/${sujetId}/messages`)
);

const sujet = computed(() => {
  return sujetData.value?.status === 200 ? sujetData.value?.sujet : {};
});

const messages = computed(() => {
  return messageData.value?.status === 200 ? messageData.value?.messages : [];
});

watch(sujetData, (newData) => {
  if (!newData) return;

  if (newData.status === 400 || newData.status === 404 || newData.status === 500) {
    notificationStore.showNotification(newData.message, 'error');
  }
});

watch(messageData, (newData) => {
  if (!newData) return;

  if (newData.status === 400 || newData.status === 500) {
    notificationStore.showNotification(newData.message, 'error');
  }
});

async function sendMessage() {
  if (!newMessage.value.trim()) return

  try {
    const response = await fetch(`/api/sujets/${sujetId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        content: newMessage.value
      }),
    })

    const data = await response.json();

    if (data.status === 200) {
      notificationStore.showNotification(data.message, 'success');
      newMessage.value = ''
      showForm.value = false

      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send('ping')
      }
      refreshMessages()
    } else {
      notificationStore.showNotification(data.message, 'error');
    }
  } catch (err: any) {
    notificationStore.showNotification("Erreur serveur lors de la création du message", 'error');
  }
}

async function refreshMessages() {
  try {
    const response = await fetch(`/api/sujets/${sujetId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status === 200) {
      messageData.value = data; 
    } else {
      notificationStore.showNotification(data.message, 'error');
    }
  } catch (err: any) {
    notificationStore.showNotification("Erreur lors du rafraîchissement des messages", 'error');
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

    <!-- Header du sujet -->
    <Loader v-if="pendingSujet" message="Chargement du sujet..." />

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

    <!-- Messages du sujet -->
    <Loader v-if="pendingMessage" message="Chargement des messages..." />

    <div v-else-if="messages.length > 0">
      <Message v-for="message in messages" :key="message.id" :message="message" />
    </div>
    <div v-else class="text-gray-400 text-center mb-12">
      Aucun message ici.
    </div>

    <v-divider></v-divider>

    <!-- Modales -->
    <LoginModal v-if="modalType === 'login'" @close="modalType = null" @switch-to-register="modalType = 'register'" />
    <RegisterModal v-if="modalType === 'register'" @close="modalType = null" @switch-to-login="modalType = 'login'" />
  </div>
</template>
