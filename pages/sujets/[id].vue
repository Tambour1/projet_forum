<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sujetId = route.params.id
const showForm = ref(false)
const newMessage = ref('')


// const { data, error } = await useAsyncData(`sujet-${sujetId}`, () =>
//   $fetch(`/api/sujets/${sujetId}`)
// )

const { data, error } = await useAsyncData(`sujet-${sujetId}`, () =>
  Promise.resolve({
    author: 'testuser',
    created_at: '2024-04-22 12:00:00',
    forum_name: 'Forum Général',
    title: 'Sujet de test très intéressant',
    content: 'Voici un exemple de contenu pour tester le rendu dans le composant.',
  })
)

const currentUser = ref({
  id: 1,
  username: 'user42',
  role: 'admin',
})

const sujet = computed(() => data.value)

const { data: messagesData } = await useAsyncData(`sujet-${sujetId}-messages`, () =>
  Promise.resolve([
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
  ])
)

const messages = computed(() => messagesData.value)


function handleSendMessage() {
  console.log('Message envoyé :', newMessage.value)
  newMessage.value = ''
  showForm.value = false
}

</script>

<template>
  <div class="min-h-screen bg-[#1a1a1b] py-8 px-4">
    <div v-if="error" class="text-red-500 text-center">
      Erreur lors du chargement du sujet.
    </div>

    <SujetHead :sujet="sujet" :withDescription="true" :currentUser="currentUser" />
    <div class="border-2 border-gray-500 text-gray-400 hover:text-white px-4 py-3 rounded-xl w-full mb-6">
      <!-- Affichage par défaut : bouton -->
      <div v-if="!showForm" @click="showForm = true" class="cursor-pointer">
        Ajouter un message
      </div>

      <!-- Formulaire après clic -->
      <div v-else>
        <textarea v-model="newMessage" rows="3"
          class="w-full p-3 rounded-md text-white resize-none focus:outline-none focus:ring-transparent"></textarea>
        <div class="mt-3 flex justify-end gap-2">
          <button @click="showForm = false" class="px-4 py-2 rounded-full bg-gray-600 text-white hover:bg-gray-700">
            Annuler
          </button>
          <button @click="handleSendMessage" class="px-4 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-700">
            Envoyer
          </button>
        </div>
      </div>
    </div>

    <Message v-for="message in messages" :key="message.id" :message="message" :currentUser="currentUser" />
    <v-divider></v-divider>
  </div>
</template>
