export default defineWrappedResponseHandler(async (event) => {
  const sujetId = event.context.params?.id;
  const user = event.context.session?.user;
  const body = await readBody(event);

  if (!user) {
    return {
      status: 401,
      message: "Utilisateur non authentifié.",
    };
  }

  const { content } = body;

  if (!content || content.trim() === "") {
    return {
      status: 400,
      message: "Le contenu du message est requis.",
    };
  }

  try {
    const db = event.context.mysql;

    const [result] = await db.execute(
      `INSERT INTO messages (sujet_id, user_id, content, created_at)
             VALUES (?, ?, ?, NOW())`,
      [sujetId, user.id, content]
    );

    return {
      status: 200,
      message: "Message ajouté avec succès.",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Erreur serveur lors de la récupération des messages.",
    };
  }
});
