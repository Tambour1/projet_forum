<script setup>
import { ref } from 'vue';
import { useUserStore } from '~/stores/user';

const emit = defineEmits(['close']);

const username = ref('');
const password = ref('');
const userStore = useUserStore()

const loginUser = async () => {
    const response = await $fetch('/api/login', {
        method: 'POST',
        body: { username: username.value, password: password.value },
    });

    if (response.error) {
        alert(response.error);
    } else {
        const { user } = await $fetch('/api/session')

        if (user) {
            userStore.login(user)
        }

        emit('close')
    }
};
</script>

<template>
    <div class="fixed inset-0 bg-gray-200 bg-opacity-40 flex items-center justify-center z-50">
        <!-- Modal -->
        <div class="flex flex-col bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button
                class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-white bg-gray-700 rounded-full hover:bg-gray-600"
                @click="$emit('close')">
                ✕
            </button>

            <h2 class="text-xl text-white text-center font-bold my-8">Se connecter</h2>

            <form @submit.prevent="loginUser" class="space-y-4">
                <input v-model="username" placeholder="Nom d'utilisateur" required
                    class="w-full px-4 py-3 border rounded-lg bg-gray-700" />
                <input v-model="password" type="password" placeholder="Mot de passe" required
                    class="w-full px-4 py-3 border rounded-lg bg-gray-700" />
                <p class="mt-4 text-sm text-center text-gray-200">
                    Première fois sur Raiedit ?
                    <a @click="$emit('switch-to-register')"
                        class="text-pink-600 hover:underline cursor-pointer">Inscrit-toi</a>
                </p>
                <v-divider :thickness="2"></v-divider>
                <button type="submit"
                    class="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition">Se
                    connecter</button>
            </form>
        </div>
    </div>
</template>
