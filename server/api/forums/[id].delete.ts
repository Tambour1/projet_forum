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
  const db = event.context.mysql;
  try {    
    await db.beginTransaction();
    await db.execute(`DELETE FROM messages WHERE sujet_id IN (SELECT id FROM sujets WHERE forum_id = ?)`, [forumId]);
    await db.execute(`DELETE FROM sujets WHERE forum_id = ?`, [forumId]);
    await db.execute(`DELETE FROM forums WHERE id = ?`, [forumId]);
    await db.commit();

    return {
      status: 200,
      message: "Forum, sujets et messages associés ont été supprimés avec succès.",
    };
  } catch (error) {
    await db.rollback();
    
    return {
      status: 500,
      message: "Erreur serveur lors de la suppression du forum",
    };
  }
});
