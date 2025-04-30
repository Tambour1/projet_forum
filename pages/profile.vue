<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useForumStore } from '@/stores/forums'
import { useNotificationStore } from '@/stores/notification';
import { useWebSocketStore } from '@/stores/websocket'

const forumStore = useForumStore()
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const websocketStore = useWebSocketStore()
const router = useRouter();

const newAdmin = ref({ username: '', password: '' });
const newForum = ref({ name: '', description: '' });
const renameForumId = ref('');
const renameForumName = ref('');
const deleteForumId = ref('');

await forumStore.fetchForums()

const createAdmin = async () => {
  try {
    const response = await fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: newAdmin.value.username,
        password: newAdmin.value.password,
      }),
    })

    const data = await response.json();

    if (data.status === 400 || data.status === 500 || data.status === 401) {
      notificationStore.showNotification(data.message, 'error');
    } else if (data.status === 201) {
      notificationStore.showNotification(data.message, 'success');
      newAdmin.value = { username: '', password: '' }
    }
  } catch (error) {
    notificationStore.showNotification('Erreur serveur lors de la création de l\'admin.', 'error');
  }  
};

const createForum = async () => {
  try {
    const response = await fetch('/api/forums/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newForum.value.name,
        description: newForum.value.description,
      }),
    })

    const data = await response.json();

    if (data.status === 400 || data.status === 500 || data.status === 401) {
      notificationStore.showNotification(data.message, 'error');
    } else if (data.status === 201) {
      notificationStore.showNotification(data.message, 'success');
      websocketStore.send('ping')
      newForum.value = { name: '', description: '' }
    }
  } catch (error) {
    notificationStore.showNotification('Erreur serveur lors de la création du forum.', 'error');    
  }
};

const renameForum = async () => {
  try {
    const response = await fetch(`/api/forums/${renameForumId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: renameForumName.value,
      }),
    });

    const data = await response.json();

    if (data.status === 400 || data.status === 500 || data.status === 401) {
      notificationStore.showNotification(data.message, 'error');
    } else if (data.status === 200) {
      notificationStore.showNotification(data.message, 'success');
      websocketStore.send('ping')
      renameForumName.value = ''
    }
  } catch (error) {
    notificationStore.showNotification('Erreur serveur lors de la modification du forum.', 'error');
  } 
};


const deleteForum = async () => {
  try {
    const response = await fetch(`/api/forums/${deleteForumId.value}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.status === 400 || data.status === 500 || data.status === 401) {
      notificationStore.showNotification(data.message, 'error');
    } else if (data.status === 200) {
      notificationStore.showNotification(data.message, 'success');
      websocketStore.send('ping')
      deleteForumId.value = ''
    } 
  } catch (error) {
    notificationStore.showNotification('Erreur serveur lors de la suppression du forum.', 'error');
  } 
};

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
    <div class="flex flex-col md:flex-row items-center justify-between mx-4 md:mx-56 mt-12 rounded border-2 border-gray-600 p-4">
      <div class="flex items-center">
        <img src="/public/utilisateur.png" alt="User Avatar" class="w-16 h-16 md:w-20 md:h-20 rounded-full mr-4" />
        <h1 class="text-xl md:text-2xl text-white font-bold relative">
          {{ userStore.currentUser.username }}
          <v-chip class="absolute top-0 right-16 transform translate-x-full -translate-y-1/2">
            {{ userStore.currentUser.role }}
          </v-chip>
        </h1>
      </div>
      <button @click="logout" class="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 mt-4 md:mt-0">Se déconnecter</button>
    </div>

    <!-- Partie admin -->
    <div v-if="userStore.currentUser.role === 'admin'">
      <div class="mx-4 md:mx-56 mt-8 p-6 p-4 border-2 border-solid border-gray-600 rounded-lg text-white space-y-8">
        <h2 class="text-xl font-bold">Espace Administrateur</h2>

        <!-- Créer un nouvel administrateur -->
        <div class="flex flex-col space-y-4 p-4 border-2 border-solid border-gray-600 rounded-lg bg-gray-800">
          <h3 class="font-semibold">Créer un nouveau compte admin</h3>
          <input v-model="newAdmin.username" placeholder="Nom d'utilisateur"
            class="bg-gray-500 resize-none focus:outline-none focus:ring-transparent px-4 py-2 rounded text-white w-full" />
          <input v-model="newAdmin.password" type="password" placeholder="Mot de passe"
            class="bg-gray-500 resize-none focus:outline-none focus:ring-transparent px-4 py-2 rounded text-gray-800 w-full" />
          <button @click="createAdmin" class="self-end bg-green-600 hover:bg-green-700 px-4 py-2 rounded mt-2">Créer</button>
        </div>

        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <!-- Créer un forum -->
          <div class="flex flex-col space-y-4 p-4 border-2 border-solid border-gray-600 rounded-lg w-full bg-gray-800">
            <h3 class="font-semibold">Créer un forum</h3>
            <input v-model="newForum.name" placeholder="Nom du forum"
              class="bg-gray-500 resize-none focus:outline-none focus:ring-transparent px-4 py-2 rounded text-white w-full" />
            <textarea v-model="newForum.description" placeholder="Description du forum"
              class="bg-gray-500 resize-none focus:outline-none focus:ring-transparent px-4 py-2 rounded text-white w-full"></textarea>
            <button @click="createForum" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded self-end mt-2">Créer Forum</button>
          </div>

          <!-- Renommer un forum -->
          <div class="flex flex-col space-y-4 p-4 border-2 border-solid border-gray-600 rounded-lg w-full bg-gray-800">
            <h3 class="font-semibold">Renommer un forum</h3>
            <select v-model="renameForumId"
              class="bg-gray-500 resize-none focus:outline-none focus:ring-transparent px-4 py-2 rounded text-white w-full">
              <option disabled value="">Sélectionnez un forum</option>
              <option v-for="forum in forumStore.getForums" :key="forum.id" :value="forum.id">
                {{ forum.name }}
              </option>
            </select>
            <input v-model="renameForumName" placeholder="Nouveau nom du forum"
              class="bg-gray-500 resize-none focus:outline-none focus:ring-transparent px-4 py-2 rounded text-white w-full" />
            <button @click="renameForum" class="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded self-end mt-2">Renommer</button>
          </div>

          <!-- Supprimer un forum -->
          <div class="flex flex-col space-y-4 p-4 border-2 border-solid border-gray-600 rounded-lg w-full bg-gray-800">
            <h3 class="font-semibold">Supprimer un forum</h3>
            <select v-model="deleteForumId"
              class="bg-gray-500 resize-none focus:outline-none focus:ring-transparent px-4 py-2 rounded text-white w-full">
              <option disabled value="">Sélectionnez un forum</option>
              <option v-for="forum in forumStore.getForums" :key="forum.id" :value="forum.id">
                {{ forum.name }}
              </option>
            </select>
            <button @click="deleteForum" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded self-end mt-2">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Page de connexion -->
  <div v-else class="text-center min-h-screen bg-[#1a1a1b] w-full flex items-center justify-center">
    <p class="text-red-500">Pour accéder à cette page, veuillez vous connecter.</p>
  </div>
</template>

