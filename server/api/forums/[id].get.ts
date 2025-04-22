export default defineWrappedResponseHandler(async (event) => {
  const { id } = event.context.params;

  if (!id) {
    return {
      status: 400,
      message: "L'ID du forum est requis.",
    };
  }
  try {
    const db = event.context.mysql;

    const [rows] = await db.execute(
      `SELECT sujets.id, sujets.title, users.username as author,forums.name as forum_name, sujets.created_at
       FROM sujets
       LEFT JOIN users ON sujets.user_id = users.id
        LEFT JOIN forums ON sujets.forum_id = forums.id
       WHERE sujets.forum_id = ?`,
      [id]
    );

    return {
      forum_name: rows[0]?.forum_name || null,
      sujets: rows || [],
    };
  } catch (error) {
    return {
      status: 500,
      message: "Erreur serveur lors de la récupération des sujets:",
      error: error.message,
    };
  }
});
