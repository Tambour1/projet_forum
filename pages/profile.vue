<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: 'auth',
});

const { session, reset } = await useSession();
const user = ref(null);
const router = useRouter();

onMounted(() => {
  if (session.value && session.value.user) {
    user.value = session.value.user;
  } else {
    router.push('/');
  }
});

const logout = async () => {
  await reset();
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div v-if="user" class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4">Bienvenue, {{ user.username }}</h1>
      <div class="mb-4">
        <p class="text-gray-700"><strong>Role:</strong> {{ user.role }}</p>
      </div>
      <v-btn @click="logout" color="primary">Se déconnecter</v-btn>
    </div>
    <div v-else class="text-center">
      <p>Chargement...</p>
    </div>
  </div>
</template>
