<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user';

const route = useRoute()
const router = useRouter()
const forumId = Number(route.params.id)
const userStore = useUserStore();

const title = ref('')
const content = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.push('/');
  }
});

const submitForm = async () => {
  isSubmitting.value = true
  try {
    const response = await $fetch('/api/sujets/create', {
      method: 'POST',
      body: {
        title: title.value,
        content: content.value,
        forumId,
      },
    })

    if (response.status === 400 || response.status === 500 || response.status === 401) {
      errorMessage.value = response.message;
    } else if (response.status === 200) {
      errorMessage.value = '';
    }

    setTimeout(() => {
      router.push(`/forums/${forumId}`)
    }, 1000)

  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#1a1a1b]">
    <div class="mx-36 my-12 p-6">
      <h1 class="text-2xl font-bold mb-8 text-gray-300">Créer un nouveau sujet</h1>
      <!--Formulaire-->
      <form @submit.prevent="submitForm" class="space-y-8">
        <input v-model="title" placeholder="Titre du sujet" type="text"
          class="w-full text-white p-2 border-2 border-gray-400 border-solid rounded-lg resize-none focus:outline-none" />
        <textarea v-model="content" rows="6" placeholder="Premier message du sujet"
          class="w-full text-white p-2 border-2 border-gray-300 border-dashed rounded-lg resize-none focus:outline-none" />
        <button type="submit" class="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700"
          :disabled="isSubmitting">
          {{ isSubmitting ? 'En cours...' : 'Publier' }}
        </button>
      </form>
      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-8">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>
