<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { timeSince } from '../mixins/utils'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'

defineProps<{
    message: {
        id: number
        author: string
        created_at: string
        content: string
    }
    currentUser: {
        id: number
        username: string
        role: string
    }
}>()

const showEdit = ref(false)
const editedMessage = ref('')
const showDeleteModal = ref(false)


const editMessage = () => {
    showEdit.value = true
    editedMessage.value = props.message.content
}

const cancelEdit = () => {
    showEdit.value = false
    editedMessage.value = ''
}

const saveMessage = () => {
    props.message.content = editedMessage.value
    showEdit.value = false
}

const deleteMessage = () => {
    console.log('Message supprimé')
    showDeleteModal.value = true
}

const confirmDeleteMessage = () => {
    // logique de suppression du message
    showDeleteModal.value = false
}
</script>


<template>
    <div class="p-6 mb-4 border border-gray-600 rounded-md bg-[#2a2a2b] text-white">
        <!-- Partie utilisateur et date -->
        <div class="flex justify-between items-center">
            <div class="flex items-center">
                <img src="/public/utilisateur.png" alt="profil" class="rounded-full mr-4" width="40" height="40" />
                <p class="text-gray-300">
                    <strong>{{ message.author }}</strong> – {{ timeSince(message.created_at) }}
                </p>
            </div>
        </div>

        <!-- Contenu du message -->
        <p v-if="!showEdit" class="text-gray-400 mt-6">{{ message.content }}</p>

        <!-- Deux boutons-->
        <div class="flex justify-end items-center gap-2 mt-4"
            v-if="!showEdit && (message.author === currentUser.username || currentUser.role === 'admin')">
            <button
                class="flex items-center text-sm text-gray-400 rounded-full px-4 py-2 hover:bg-gray-500 hover:text-white"
                @click="editMessage">
                <PencilIcon class="h-5 w-5 mr-2" />
                Modifier
            </button>
            <button
                class="flex items-center text-sm text-gray-400 rounded-full px-4 py-2 hover:bg-red-500 hover:text-white"
                @click="deleteMessage">
                <TrashIcon class="h-5 w-5 mr-2" />
                Supprimer
            </button>
        </div>

        <!-- Modification d'un message -->
        <div v-if="showEdit" class="mt-4">
            <textarea v-model="editedMessage" class="w-full p-3 rounded-md text-white resize-none focus:outline-none"
                rows="3" placeholder="Modifier votre message..."></textarea>
            <div class="mt-3 flex justify-end gap-2">
                <button class="px-4 py-2 rounded-full bg-gray-600 text-white hover:bg-gray-700" @click="cancelEdit">
                    Annuler
                </button>
                <button class="px-4 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-700" @click="saveMessage">
                    Enregistrer
                </button>
            </div>
        </div>

        <!-- Modal de confirmation de suppression -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-gray-200 bg-opacity-40 flex items-center justify-center z-50">
            <div class="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
                <h3 class="text-lg mb-4 text-white">Êtes-vous sûr de vouloir supprimer ce message ?</h3>
                <div class="flex justify-end gap-4">
                    <button class="px-4 py-2 bg-gray-600 text-white rounded-full" @click="showDeleteModal = false">
                        Annuler
                    </button>
                    <button class="px-4 py-2 bg-red-600 text-white rounded-full" @click="confirmDeleteMessage">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
