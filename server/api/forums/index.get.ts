export default defineWrappedResponseHandler(async (event) => {
  try {
    const db = event.context.mysql;

    const [rows] = await db.execute(`
      SELECT 
        f.id,
        f.name,
        f.description,
        s.id AS sujet_id,
        s.title AS sujet_title,
        s.user_id,
        s.created_at
      FROM forums f
      LEFT JOIN sujets s ON s.forum_id = f.id
      ORDER BY f.id, s.created_at DESC;
    `);

    const forumsMap = new Map<number, any>();

    for (const row of rows) {
      const forumId = row.id;
    
      if (!forumsMap.has(forumId)) {
        forumsMap.set(forumId, {
          id: forumId,
          name: row.name,
          description: row.description,
          sujets: [],
          sujetsCount: 0, 
        });
      }
    
      if (row.sujet_id) {
        forumsMap.get(forumId).sujets.push({
          id: row.sujet_id,
          title: row.sujet_title,
          user_id: row.user_id,
          created_at: row.created_at,
        });
        forumsMap.get(forumId).sujetsCount++; 
      }
    }
    

    const forums = Array.from(forumsMap.values());

    return {
      forums,
    };

  } catch (error) {
    return {
      status: 500,
      message: "Erreur serveur lors de la récupération des forums:",
      error: error.message,
    };
  }
});
