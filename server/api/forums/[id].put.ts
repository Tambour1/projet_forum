export default defineWrappedResponseHandler(async (event) => {
    const body = await readBody(event);
    const { name } = body;
    const forumId = event.context.params?.id
  
    const user = event.context.session.user;
  
    if (!user) {
      return {
        status: 401,
        message: "Utilisateur non connecté",
      };
    }
  
    if (!forumId || !name) {
      return {
        status: 400,
        message: "L'ID du forum et le nom sont requis.",
      };
    }
  
    try {
      const db = event.context.mysql;
  
      await db.execute(
        `UPDATE forums SET name = ? WHERE id = ?`,
        [name, forumId]
      );
  
      return {
        status: 200,
        message: "Forum mis à jour avec succès.",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Erreur serveur lors de la mise à jour du forum.",
      };
    }
  });
  