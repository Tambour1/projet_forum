export default defineWrappedResponseHandler(async (event) => {
    const messageId = event.context.params;
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
  
      // Vérifie si l'utilisateur est autorisé à supprimer ce message
      const [rows] = await db.execute(
        `SELECT * FROM messages WHERE id = ? AND user_id = ?`,
        [messageId, user.id]
      );
  
      if (rows.length === 0) {
        return {
          status: 403,
          message: "Vous n'êtes pas autorisé à supprimer ce message.",
        };
      }
  
      // Supprimer le message
      await db.execute(`DELETE FROM messages WHERE id = ?`, [messageId]);
  
      return {
        status: 200,
        message: "Message supprimé avec succès.",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Erreur serveur lors de la suppression du message.",
      };
    }
  });
  