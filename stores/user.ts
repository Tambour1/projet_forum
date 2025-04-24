import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const isAuthenticated = computed(() => !!currentUser.value)
  // const isAuthenticated = true;
  // const currentUser = {id: 1, username: 'user42', role: 'user'};

  function login(user: any) {
    currentUser.value = user
  }

  function logout() {
    currentUser.value = null
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
  }
})
