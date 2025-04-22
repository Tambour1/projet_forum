<script setup lang="ts">
import { defineProps } from 'vue'
import { NuxtLink } from '#components'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { timeSince } from '../mixins/utils'

defineProps<{
  sujet: {
    author: string
    created_at: string
    forum_name: string
    title: string
    content?: string
  },
  withDescription?: boolean
}>()
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-start mb-4">
      <!-- Partie auteur -->
      <div class="flex items-center">
        <NuxtLink v-if="withDescription" to="/" class="bg-gray-600 hover:bg-gray-300 p-2 rounded-full mr-3">
          <component :is="ChevronLeftIcon" class="w-5 h-5 text-white" />
        </NuxtLink>
        <img src="/public/utilisateur.png" alt="profil" class="rounded-full mr-4" width="40" height="40" />
        <p class="text-gray-400">
          Publié par <strong>{{ sujet.author }}</strong> - {{ timeSince(sujet.created_at) }}
        </p>
      </div>

      <!-- Partie forum -->
      <div class="text-sm text-gray-500 ml-auto text-right">
        <v-chip variant="outlined">
          {{ sujet.forum_name }}
        </v-chip>
      </div>
    </div>

    <h2 class="text-3xl font-semibold text-white">{{ sujet.title }}</h2>

    <p v-if="withDescription" class="text-gray-500 mt-8">{{ sujet.content }}</p>

    <v-divider class="mt-10" />
  </div>
</template>
