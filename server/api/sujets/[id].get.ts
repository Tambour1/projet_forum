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
        sujets.id,
        sujets.content,
        sujets.title,
        users.username AS author, 
        forums.name AS forum_name,
        sujets.created_at
      FROM sujets 
      LEFT JOIN users ON sujets.user_id = users.id
      LEFT JOIN forums ON sujets.forum_id = forums.id
      WHERE sujets.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return {
        status: 404,
        message: "Sujet non trouvé.",
      };
    }

    return {
      status:200,
      sujet: rows[0]
    } 
  } catch (error) {
    return {
      status: 500,
      message: "Erreur serveur lors de la récupération du sujet.",
    };
  }
});
