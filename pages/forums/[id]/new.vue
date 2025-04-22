<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

definePageMeta({
  middleware: 'auth',
});

const route = useRoute()
const router = useRouter()
const forumId = Number(route.params.id)

const title = ref('')
const content = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

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
    if (response.status) {
        throw new Error('Erreur lors de la création du sujet' + response.message)
    }

    
    setTimeout(() => {
      router.push(`/forums/${forumId}`)
    }, 1000)

  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}

</script>

<template>
    <div class="min-h-screen bg-[#1a1a1b] py-10 px-4">
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
            <h1 class="text-2xl font-bold mb-6 text-gray-800">Créer un nouveau sujet</h1>

            <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                    <label class="block text-gray-700 mb-1">Titre du sujet</label>
                    <input v-model="title" type="text" class="w-full p-2 border border-gray-300 rounded" />
                </div>

                <div>
                    <label class="block text-gray-700 mb-1">Premier message</label>
                    <textarea v-model="content" rows="6"
                        class="w-full p-2 border border-gray-300 rounded resize-none" />
                </div>

                <div v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</div>

                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    :disabled="isSubmitting">
                    {{ isSubmitting ? 'En cours...' : 'Publier' }}
                </button>
            </form>
        </div>
    </div>
</template>
