export default defineWrappedResponseHandler(async (event) => {
    const forumId = event.context.params?.id;
    const user = event.context.session.user;
  
    if (!user) {
      return {
        status: 401,
        message: "Utilisateur non connecté",
      };
    }
  
    if (!forumId) {
      return {
        status: 400,
        message: "L'ID du forum est requis.",
      };
    }
  
    try {
      const db = event.context.mysql;

      await db.execute(`DELETE FROM forums WHERE id = ?`, [forumId]);
  
      return {
        status: 200,
        message: "Forum supprimé avec succès.",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Erreur serveur lors de la suppression du forum."
      };
    }
  });
  