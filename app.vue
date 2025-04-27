<script setup>
import { ref } from 'vue';
import LoginModal from '~/components/LoginModal.vue';
import RegisterModal from '~/components/RegisterModal.vue';
import Navside from '~/components/Navside.vue';
import { useUserStore } from '~/stores/user'
import { useNotificationStore } from '~/stores/notification';

const modalType = ref(null);
const userStore = useUserStore()
const notificationStore = useNotificationStore();
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen bg-[#1a1a1b]">
      <!-- Navbar -->
      <header
        class="flex items-center justify-between px-6 py-4 bg-[#1a1a1b] border-b-2 border-gray-600 fixed top-0 left-0 right-0 z-50">
        <NuxtLink to="/" class="flex items-center space-x-3">
          <img src="/public/logo.png" alt="Logo" class="w-10 h-10 rounded-full" />
          <span class="text-xl font-semibold text-white">Raiedit</span>
        </NuxtLink>

        <!-- Connexion / Profil -->
        <div>
          <NuxtLink v-if="userStore.isAuthenticated" to="/profile"
            class="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-full transition duration-300">
            Mon Profil
          </NuxtLink>

          <button v-else @click="modalType = 'login'"
            class="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-full transition duration-300">
            Se connecter
          </button>
        </div>

      </header>

      <!-- Contenu principal -->
      <main class="pt-16 flex">
        <Navside />
        <NuxtPage class="w-full" />
      </main>

      <!-- Affichage conditionnel des modales -->
      <LoginModal v-if="modalType === 'login'" @close="modalType = null" @switch-to-register="modalType = 'register'" />
      <RegisterModal v-if="modalType === 'register'" @close="modalType = null" @switch-to-login="modalType = 'login'" />
      <Notification />
    </div>
  </NuxtLayout>
</template>