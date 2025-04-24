<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.push('/');
  }
});

const logout = () => {
  userStore.logout();
  router.push('/');
};
</script>

<template>
  <div v-if="userStore.isAuthenticated && userStore.currentUser" class="min-h-screen bg-[#1a1a1b] w-full">
    <div class="flex items-center justify-between mx-56 mt-12 rounded border-2 border-gray-600 p-4 relative">
      <div class="flex items-center">
        <img src="/public/utilisateur.png" alt="User Avatar" class="w-20 h-20 rounded-full mr-4" />
        <h1 class="text-2xl text-white font-bold relative">
          {{ userStore.currentUser.username }}
          <v-chip class="absolute top-0 right-16 transform translate-x-full -translate-y-1/2">
            {{ userStore.currentUser.role }}
          </v-chip>
        </h1>
      </div>
      <button @click="logout" class="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700">Se déconnecter</button>
    </div>
  </div>
  <div v-else class="text-center min-h-screen bg-[#1a1a1b] w-full flex items-center justify-center">
    <p class="text-red-500">Pour accéder à cette page, veuillez vous connecter.</p>
  </div>
</template>


