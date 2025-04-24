export default defineWrappedResponseHandler(async (event) => {
    const body = await readBody(event);
    const { content } = body;
    const messageId = event.context.params
  
    const user = event.context.session.user;
  
    if (!user) {
      return {
        status: 401,
        message: "Utilisateur non connecté",
      };
    }
  
    if (!messageId || !content) {
      return {
        status: 400,
        message: "L'ID du message et le contenu sont requis.",
      };
    }
  
    try {
      const db = event.context.mysql;
  
      // Vérifiez si l'utilisateur est autorisé à modifier ce message
      const [rows] = await db.execute(
        `SELECT * FROM messages WHERE id = ? AND user_id = ?`,
        [messageId, user.id]
      );
  
      if (rows.length === 0) {
        return {
          status: 403,
          message: "Vous n'êtes pas autorisé à modifier ce message.",
        };
      }
  
      // Mettez à jour le contenu du message
      await db.execute(
        `UPDATE messages SET content = ? WHERE id = ?`,
        [content, messageId]
      );
  
      return {
        status: 200,
        message: "Message mis à jour avec succès.",
      };
    } catch (error) {
      return {
        status: 500,
        message: "Erreur serveur lors de la mise à jour du message.",
      };
    }
  });
  