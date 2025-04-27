<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useForumStore } from '@/stores/forums'

const forumStore = useForumStore()
const userStore = useUserStore();
const router = useRouter();

const newAdmin = ref({ username: '', password: '' });
const newForum = ref({ name: '', description: '' });
const renameForumId = ref('');
const renameForumName = ref('');
const deleteForumId = ref('');
const errorMessage = ref('');
const statusMessage = ref('')
const statusType = ref < 'success' | 'error' | '' > ('')

await forumStore.fetchForums()

const createAdmin = async () => {
  try {
    const response = await $fetch('/api/users/create', {
      method: 'POST',
      body: {
        username: newAdmin.value.username,
        password: newAdmin.value.password,
      },
    })

    if (response.status === 400 || response.status === 500 || response.status === 401) {
      errorMessage.value = response.message;
    } else if (response.status === 201) {
      errorMessage.value = '';
    }
  } finally {
    alert(`Création admin : ${newAdmin.value.username}`);
    newAdmin.value = {}
  }  
};

const createForum = async () => {
  try {
    const response = await $fetch('/api/forums/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newForum.value.name,
        description: newForum.value.description,
      }),
    })

    if (response.status === 400 || response.status === 500 || response.status === 401) {
      errorMessage.value = response.message;
    } else if (response.status === 201) {
      errorMessage.value = '';
    }
  } finally {
    alert(`Création forum : ${newForum.value.name} ---${newForum.value.description}`);
    newForum.value = {}
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

    if (response.status === 400 || response.status === 500 || response.status === 401) {
      statusType.value = 'error'
      statusMessage.value = data.message
    } else if (response.status === 200) {
      statusType.value = 'success'
      statusMessage.value = data.message
    }
  } finally {
    alert(`Renommage forum ID ${renameForumId.value} -> ${renameForumName.value}`);
    renameForumName.value = ''
  }
};


const deleteForum = async () => {
  try {
    const response = await fetch(`/api/forums/${deleteForumId.value}`, {
      method: 'DELETE',
    });

    if (response.status === 400 || response.status === 500 || response.status === 401) {
      statusType.value = 'error'
      statusMessage.value = response.message
    } else if (response.status === 200) {
      statusType.value = 'success'
      statusMessage.value = response.message 
    }  
  } finally {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce forum ? Cette action est irréversible.')) {
    alert(`Suppression forum ID : ${deleteForumId.value}`);
  }
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
    <div class="flex items-center justify-between mx-56 mt-12 rounded border-2 border-gray-600 p-4">
      <div class="flex items-center">
        <img src="/public/utilisateur.png" alt="User Avatar" class="w-20 h-20 rounded-full mr-4" />
        <h1 class="text-2xl text-white font-bold relative">
          {{ userStore.currentUser.username }}
          <v-chip class="absolute top-0 right-16 transform translate-x-full -translate-y-1/2">
            {{ userStore.currentUser.role }}
          </v-chip>
        </h1>
      </div>
      <button @click="logout" class="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700">Se
        déconnecter</button>
    </div>
    <!--Partie admin-->
    <div v-if="userStore.currentUser.role === 'admin'">
      <div class="mx-56 mt-8 p-6 p-4 border-2 border-solid border-gray-600 rounded-lg text-white space-y-8">
        <h2 class="text-xl font-bold">Espace Administrateur</h2>
        <!-- Message temporaire -->
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-8">
          {{ errorMessage }}
        </div>
        <!-- Message de statut temporaire-->
        <div v-if="statusMessage" :class="[
          'mt-3 p-3 rounded-md text-sm',
          statusType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        ]">
          {{ statusMessage }}
        </div>

        <!-- Créer un nouvel administrateur -->
        <div class="flex flex-col space-y-4 p-4 border-2 border-solid border-gray-600 rounded-lg bg-gray-800">
          <h3 class="font-semibold">Créer un nouveau compte admin</h3>
          <input v-model="newAdmin.username" placeholder="Nom d'utilisateur"
            class="bg-gray-500 resize-none focus:outline-none focus:ring-transparent px-4 py-2 rounded text-white w-full" />
          <input v-model="newAdmin.password" type="password" placeholder="Mot de passe"
            class="bg-gray-500 resize-none focus:outline-none focus:ring-transparent px-4 py-2 rounded text-gray-800 w-full" />
          <button @click="createAdmin" class="self-end bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Créer</button>
        </div>

        <div class="flex space-x-4">
          <!-- Créer un forum -->
          <div class="flex flex-col space-y-4 p-4 border-2 border-solid border-gray-600 rounded-lg w-full bg-gray-800">
            <h3 class="font-semibold">Créer un forum</h3>
            <input v-model="newForum.name" placeholder="Nom du forum"
              class="bg-gray-500 resize-none focus:outline-none focus:ring-transparent px-4 py-2 rounded text-white w-full" />
            <textarea v-model="newForum.description" placeholder="Description du forum"
              class="bg-gray-500 resize-none focus:outline-none focus:ring-transparent px-4 py-2 rounded text-white w-full"></textarea>
            <button @click="createForum" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded self-end">Créer
              Forum</button>
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
            <button @click="renameForum"
              class="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded self-end">Renommer</button>
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
            <button @click="deleteForum"
              class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded self-end">Supprimer</button>
          </div>

        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center min-h-screen bg-[#1a1a1b] w-full flex items-center justify-center">
    <p class="text-red-500">Pour accéder à cette page, veuillez vous connecter.</p>
  </div>
</template>
