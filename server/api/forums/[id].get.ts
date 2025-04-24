export default defineWrappedResponseHandler(async (event) => {
  const { id } = event.context.params || {};

  if (!id) {
    return {
      status: 400,
      message: "L'ID du forum est requis.",
    };
  }
  try {
    const db = event.context.mysql;
    
    await db.execute("SET time_zone = '+02:00'");

    const [rows] = await db.execute(
      `SELECT 
         s.id, 
         s.title,
         s.created_at, 
         u.username AS author,
         f.name AS forum_name,
         (
           SELECT MAX(m.created_at)
           FROM messages m
           WHERE m.sujet_id = s.id
         ) AS last_message_date
       FROM sujets s
       LEFT JOIN users u ON s.user_id = u.id
       LEFT JOIN forums f ON s.forum_id = f.id
       WHERE s.forum_id = ?
       ORDER BY last_message_date DESC`,
      [id]
    );
    

    return {
      status: 200,
      forum_name: rows[0]?.forum_name || null,
      sujets: rows || [],
    };
  } catch (error) {
    return {
      status: 500,
      message: "Erreur serveur lors de la récupération des sujets:"
    };
  }
});
