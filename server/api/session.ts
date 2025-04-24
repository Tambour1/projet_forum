export default defineEventHandler((event) => {
  const session = event.context.session 
  if (session?.user) {
    return { user: session.user }
  } else {
    return { user: null }
  }
});
