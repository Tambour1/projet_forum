export default defineWrappedResponseHandler(async (event) => {
  const { id } = event.context.params;

  if (!id) {
    return {
      status: 400,
      message: "L'ID du sujet est requis.",
    };
  }

  try {
    const db = event.context.mysql;

    const [rows] = await db.execute(
      `SELECT 
        messages.id,
        messages.content,
        messages.created_at,
        users.username AS author
      FROM messages
      LEFT JOIN users ON messages.user_id = users.id
      WHERE messages.sujet_id = ?
      ORDER BY messages.created_at ASC`,
      [id]
    );

    return {
      status: 200,
      messages: rows,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Erreur serveur lors de la récupération des messages.",
    };
  }
});
