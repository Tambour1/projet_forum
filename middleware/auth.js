export default defineNuxtRouteMiddleware(async (to, from) => {
    const { session } = await useSession();
    if (!session.value || !session.value.user) {
      return navigateTo('/login');
    }
  });
  