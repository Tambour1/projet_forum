<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { NuxtLink } from '#components'
import { ChevronLeftIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { timeSince } from '../mixins/utils'
import { useUserStore } from '@/stores/user';
import { useNotificationStore } from '~/stores/notification';
import { useWebSocketStore } from '@/stores/websocket'

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const websocketStore = useWebSocketStore();
const router = useRouter();

const props = defineProps<{
  sujet: {
    id: number
    author: string
    created_at: string
    forum_id: number
    forum_name: string
    title: string
    content?: string
    last_message_date?: string
  },
  withDescription?: boolean,
  isLinkEnabled?: boolean
}>()

const showDeleteModal = ref(false)
const deleteSujet = async () => {
  try {
    const response = await fetch(`/api/sujets/${props.sujet.id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    
    if (data.status === 400 || data.status === 500) {
      notificationStore.showNotification(data.message, 'error');
    } else if (data.status === 200) {
      notificationStore.showNotification(data.message, 'success');
      websocketStore.send('ping');
    }
  } finally {
    if(props.withDescription) {
      router.back();
    } else {
      router.push(`/forums/${props.sujet.forum_id}`);
    }
    showDeleteModal.value = false
  }
}


</script>

<template>
  <div class="p-6">
  <div class="flex justify-between items-start mb-4">
    <!-- Partie auteur -->
    <div class="flex items-center space-x-4">
      <NuxtLink v-if="withDescription" @click.prevent="router.back()"
        class="bg-gray-600 hover:bg-gray-300 p-2 rounded-full cursor-pointer">
        <component :is="ChevronLeftIcon" class="w-5 h-5 text-white" />
      </NuxtLink>
      <img src="/utilisateur.png" alt="profil" class="rounded-full" width="40" height="40" />
      <p class="text-gray-400">
        Publié par <strong>{{ sujet.author }}</strong> - {{ timeSince(sujet.created_at) }}
      </p>
      <div v-if="sujet.last_message_date" class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
        Dernier message {{ timeSince(sujet.last_message_date) }}
      </div>
    </div>

    <!-- Chip forum -->
    <div class="text-sm text-gray-500 ml-auto text-right">
      <v-chip variant="outlined">
        {{ sujet.forum_name }}
      </v-chip>
    </div>
  </div>

  <div class="flex items-center justify-between space-x-4">
    <NuxtLink 
      v-if="isLinkEnabled"
      :to="`/sujets/${sujet.id}`" 
      class="text-3xl font-semibold text-white hover:underline"
    >
      {{ sujet.title }}
    </NuxtLink>
    <h2 v-else class="text-3xl font-semibold text-white">
      {{ sujet.title }}
    </h2>

    <button v-if="userStore.currentUser?.role === 'admin'" @click="showDeleteModal = true"
      class="hover:bg-red-600 text-white p-2 rounded-full">
      <component :is="TrashIcon" class="w-6 h-6 text-white" />
    </button>
  </div>

  <p v-if="withDescription" class="text-gray-500 mt-8">{{ sujet.content }}</p>

  <!-- Modal de suppression -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-200 bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
      <h3 class="text-lg mb-4 text-white">Êtes-vous sûr de vouloir supprimer ce sujet ?</h3>
      <div class="flex justify-end gap-4">
        <button class="px-4 py-2 bg-gray-600 text-white rounded-full" @click="showDeleteModal = false">
          Annuler
        </button>
        <button class="px-4 py-2 bg-red-600 text-white rounded-full" @click="deleteSujet">
          Supprimer
        </button>
      </div>
    </div>
  </div>

  <v-divider class="mt-10" />
</div>

</template>
