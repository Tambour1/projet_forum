import bcrypt from "bcryptjs";

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    return { error: "username et mot de passe sont requis" };
  }

  const db = event.context.mysql;
  const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
  await db.end();

  if (rows.length === 0) {
    return { error: "Utilisateur non trouvé" };
  }

  const user = rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Mot de passe incorrect" };
  }

  event.context.session.user = {
    id: user.id,
    username: user.username,
    role: user.role
  }  

  return { message: "Connexion réussie" };
});
