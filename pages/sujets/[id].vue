<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { timeSince } from '../../mixins/utils'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const sujetId = route.params.id

const { data, error } = await useAsyncData(`sujet-${sujetId}`, () =>
  $fetch(`/api/sujets/${sujetId}`)
)

// Récupère le sujet depuis la réponse
const sujet = computed(() => data.value)


</script>

<template>
  <div class="min-h-screen bg-[#1a1a1b] py-8 px-4">
    <div v-if="error" class="text-red-500 text-center">
      Erreur lors du chargement du sujet.
    </div>

    <SujetHead :sujet="sujet" :withDescription="true" />

  </div>
</template>
