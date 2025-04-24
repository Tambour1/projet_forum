// plugins/init-user.ts
import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(async (nuxtApp) => {
  const userStore = useUserStore()

  const { user } = await $fetch('/api/session').catch(() => ({ user: null }))

  if (user) {
    userStore.login(user)
  }
})
