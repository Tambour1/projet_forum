export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const { title, content, forumId } = body;

  const user = event.context.session.user;

  if (!user) {
    return {
      status: 401,
      message: "Utilisateur non connecté",
    };
  }

  if (!title || !content || !forumId) {
    return {
      status: 400,
      message: "Tous les champs sont requis.",
    };
  }

  try {
    const db = event.context.mysql;

    await db.execute(
      `INSERT INTO sujets (content, forum_id, title, user_id, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
      [content, forumId, title, user.id]
    );

    return { message: "Sujet créé avec succès." };
  } catch (error) {
    return {
      status: 500,
      message: "Erreur serveur lors de la création du sujet.",
      error: error.message,
    };
  }
});
