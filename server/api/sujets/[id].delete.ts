export default defineWrappedResponseHandler(async (event) => {
  const id  = event.context.params?.id;

  if (!id) {
    return {
      status: 400,
      message: "L'ID du sujet est requis.",
    };
  }

  const db = event.context.mysql;
  try {
    await db.beginTransaction();
    await db.execute(`DELETE FROM messages WHERE sujet_id = ?`, [id]);
    await db.execute(`DELETE FROM sujets WHERE id = ?`, [id]);
    await db.commit();

    return {
      status: 200,
      message: "Sujet et messages supprimé avec succès.",
    };
  } catch (error) {
    await db.rollback();

    return {
      status: 500,
      message: "Erreur serveur lors de la suppression du sujet.",
    
    };
  }
});
