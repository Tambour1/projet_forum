<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user';
import { useNotificationStore } from '@/stores/notification';

const route = useRoute()
const router = useRouter()
const forumId = Number(route.params.id)
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const title = ref('')
const content = ref('')

onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.push('/');
  }
});

const submitForm = async () => {
  try {
    const response = await fetch('/api/sujets/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title.value,
        content: content.value,
        forumId: forumId,
      }),
    })

    const data = await response.json();

    if (data.status === 400 || data.status === 500 || data.status === 401) {
      notificationStore.showNotification(data.message, 'error');
    } else if (data.status === 201) {
      notificationStore.showNotification(data.message, 'success');
      router.push(`/forums/${forumId}`)
    }
  } catch (error) {
    notificationStore.showNotification('Erreur serveur lors de la création du sujet.', 'error');
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
        <button type="submit" class="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700">
          Créer le sujet
        </button>
      </form>
    </div>
  </div>
</template>
