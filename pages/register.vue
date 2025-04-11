<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const register = async () => {
  const response = await $fetch('/api/register', {
    method: 'POST',
    body: { username: username.value, password: password.value },
  });

  if (response.error) {
    alert(response.error);
  } else {
    alert('Inscription réussie');
    router.push('/login');
  }
};
</script>

<template>
  <div>
    <h1>Créer un compte</h1>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="username" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">S'inscrire</button>
    </form>
  </div>
</template>