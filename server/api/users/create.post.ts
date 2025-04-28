import bcrypt from 'bcryptjs';
export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  const user = event.context.session.user;

  if (!user) {
    return {
      status: 401,
      message: "Utilisateur non connecté",
    };
  }

  if (!username || !password) {
    return {
      status: 400,
      message: "username et password requis",
    };
  }

  try {
    const db = event.context.mysql;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, 'admin']
    );

    return {
      status: 201,
      message: "Admin créé avec succès.",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Erreur serveur lors de la création de l'admin.",
    };
  }
});
