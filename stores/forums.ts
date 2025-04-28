import { defineStore } from 'pinia'

export const useForumStore = defineStore('forums', {
  state: () => ({
    forums: [] as any[],
    error: null as string | null,
    loading: false,
  }),

  actions: {
    async fetchForums() {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await useAsyncData('forums', () => $fetch('/api/forums'))


        if (error.value) {
          this.error = "Erreur lors de la récupération des forums."
        } else if (!Array.isArray(data.value?.forums)) {
          this.error = "Format de réponse invalide."
        } else {
          this.forums = data.value.forums
        }
      } catch (err) {
        this.error = "Une erreur inattendue est survenue."
      } finally {
        this.loading = false
      }
    },
    
  },

  getters: {
    getForums: (state) => state.forums,
    hasError: (state) => !!state.error,
    isLoading: (state) => state.loading,
  },
})
