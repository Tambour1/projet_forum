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
            description: 'Discutez de JavaScript, HTML, CSS, Vue, React, etc.',
            sujets: [
              { id: 1, title: 'Comment débuter avec Vue 3 ?', author: 'devstarter', created_at: '2024-04-20 10:30:00' },
              { id: 2, title: 'Typescript ou JavaScript ?', author: 'jsfanboy', created_at: '2024-04-21 16:45:00' },
            ]
          },
          {
            id: 2,
            name: 'Développement Mobile',
            description: 'Android, iOS, Flutter, React Native... tout y passe !',
            sujets: [
              { id: 3, title: 'Quel framework choisir pour une app mobile ?', author: 'mobiledev', created_at: '2024-04-22 08:15:00' },
              { id: 4, title: 'Optimisation des performances sur Android', author: 'androidpro', created_at: '2024-04-23 12:00:00' },
            ]
          },
          {
            id: 3,
            name: 'Jeux Vidéo',
            description: 'Partagez vos jeux préférés ou discutez de dev de jeux.',
            sujets: [
              { id: 5, title: 'Meilleurs jeux indépendants de 2024', author: 'gamer123', created_at: '2024-04-24 14:30:00' },
              { id: 6, title: 'Développement de jeux en Unity', author: 'unitydev', created_at: '2024-04-25 09:45:00' },
            ]
          },
          {
            id: 4,
            name: 'Matériel et Build PC',
            description: 'Aide pour choisir des composants ou monter votre PC.',
            sujets: [
              { id: 7, title: 'Meilleur GPU pour le gaming en 2024', author: 'pcbuilder', created_at: '2024-04-26 11:00:00' },
              { id: 8, title: 'Compatibilité des composants PC', author: 'hardwareguru', created_at: '2024-04-27 13:15:00' },
            ]
          },
          {
            id: 5,
            name: 'Off-topic',
            description: 'Tout ce qui ne rentre pas ailleurs.',
            sujets: [
              { id: 9, title: 'Discussions générales', author: 'chatty', created_at: '2024-04-28 15:30:00' },
              { id: 10, title: 'Recommandations de films', author: 'movielover', created_at: '2024-04-29 17:45:00' },
            ]
          },
          {
            id: 6,
            name: 'Off-topic',
            description: 'Tout ce qui ne rentre pas ailleurs.',
            sujets: [
              { id: 11, title: 'Discussions générales', author: 'chatty', created_at: '2024-04-28 15:30:00' },
              { id: 12, title: 'Recommandations de films', author: 'movielover', created_at: '2024-04-29 17:45:00' },
            ]
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
