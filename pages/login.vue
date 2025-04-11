<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const loginUser = async () => {
  const response = await $fetch('/api/login', {
    method: 'POST',
    body: { username: username.value, password: password.value },
  });

  if (response.error) {
    alert(response.error);
  } else {
    alert('Connexion réussie');
    router.push('/profile');
  }
};
</script>

<template>
  <div>
    <h1>Se connecter</h1>
    <form @submit.prevent="loginUser">
      <input v-model="username" placeholder="username" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>