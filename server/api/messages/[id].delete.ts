export default defineWrappedResponseHandler(async (event) => {
    const messageId = event.context.params?.id;
    const user = event.context.session.user;
  
    if (!user) {
      return {
        status: 401,
        message: "Utilisateur non connecté",
      };
    }
  
    if (!messageId) {
      return {
        status: 400,
        message: "L'ID du message est requis.",
      };
    }
  
    try {
      const db = event.context.mysql;

      await db.execute(`DELETE FROM messages WHERE id = ?`, [messageId]);
  
      return {
        status: 200,
        message: "Message supprimé avec succès.",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Erreur serveur lors de la suppression du message."
      };
    }
  });
  