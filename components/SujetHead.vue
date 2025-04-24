<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { NuxtLink } from '#components'
import { ChevronLeftIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { timeSince } from '../mixins/utils'
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();

defineProps<{
  sujet: {
    id: number
    author: string
    created_at: string
    forum_name: string
    title: string
    content?: string
    last_message_date?: string
  },
  withDescription?: boolean,
  isLinkEnabled?: boolean
}>()

const showDeleteModal = ref(false)
function handleDeleteSubject() {
  console.log("Sujet supprimé")
  showDeleteModal.value = false
}
</script>

<template>
  <div class="p-6">
    <component :is="isLinkEnabled ? NuxtLink : 'div'" :to="isLinkEnabled ? `/sujets/${sujet.id}` : undefined">
      <div class="flex justify-between items-start mb-4">
        <!-- Partie auteur -->
        <div class="flex items-center space-x-4">
          <NuxtLink v-if="withDescription" @click.prevent="router.back()"
            class="bg-gray-600 hover:bg-gray-300 p-2 rounded-full  cursor-pointer">
            <component :is="ChevronLeftIcon" class="w-5 h-5 text-white" />
          </NuxtLink>
          <img src="/public/utilisateur.png" alt="profil" class="rounded-full" width="40" height="40" />
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

      <!-- Titre du sujet avec bouton de suppression -->
      <div class="flex space-x-4">
        <h2 class="text-3xl font-semibold text-white">{{ sujet.title }}</h2>
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
            <button class="px-4 py-2 bg-red-600 text-white rounded-full" @click="handleDeleteSubject">
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <v-divider class="mt-10" />
    </component>
  </div>
</template>
