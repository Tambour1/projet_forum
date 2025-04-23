import { defineStore } from 'pinia'

export const useForumStore = defineStore('forums', {
  state: () => ({
    forums: [] as any[],
    error: null as string | null,
    loading: false,
  }),

  actions: {
    // async fetchForums() {
    //   this.loading = true
    //   this.error = null

    //   try {
    //     const { data, error } = await useAsyncData('forums', () => $fetch('/api/forums'))


    //     if (error.value) {
    //       this.error = "Erreur lors de la récupération des forums."
    //     } else if (!Array.isArray(data.value?.forums)) {
    //       this.error = "Format de réponse invalide."
    //     } else {
    //       this.forums = data.value.forums
    //     }
    //   } catch (err) {
    //     this.error = "Une erreur inattendue est survenue."
    //   } finally {
    //     this.loading = false
    //   }
    // },

    async fetchForums() {
      this.loading = true
      this.error = ''
      try {
        this.forums = [
          {
            id: 1,
            name: 'Programmation Web',
            description: 'Discutez de JavaScript, HTML, CSS, Vue, React, etc.'
          },
          {
            id: 2,
            name: 'Développement Mobile',
            description: 'Android, iOS, Flutter, React Native... tout y passe !'
          },
          {
            id: 3,
            name: 'Jeux Vidéo',
            description: 'Partagez vos jeux préférés ou discutez de dev de jeux.'
          },
          {
            id: 4,
            name: 'Matériel et Build PC',
            description: 'Aide pour choisir des composants ou monter votre PC.'
          },
          {
            id: 5,
            name: 'Off-topic',
            description: 'Tout ce qui ne rentre pas ailleurs.'
          }
        ]
      } catch (e) {
        this.error = "Impossible de charger les forums. Veuillez réessayer plus tard."
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    getForums: (state) => state.forums,
    hasError: (state) => !!state.error,
    isLoading: (state) => state.loading,
  },
})
