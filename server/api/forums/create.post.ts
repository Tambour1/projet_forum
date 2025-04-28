export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const { name, description } = body;

  const user = event.context.session.user;

  if (!user) {
    return {
      status: 401,
      message: "Utilisateur non connecté",
    };
  }

  if (!name || !description) {
    return {
      status: 400,
      message: "Nom et description du forum sont requis.",
    };
  }

  try {
    const db = event.context.mysql;

    await db.execute(
      `INSERT INTO forums (name, description) VALUES (?, ?)`,
      [name, description]
    );

    return {
      status: 201,
      message: "Forum créé avec succès.",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Erreur serveur lors de la création du forum.",
    };
  }
});
