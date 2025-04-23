export default eventHandler((event) => {
    return { user: event.context.session.user || null }
  })
  