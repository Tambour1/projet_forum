import bcrypt from 'bcryptjs';

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    return { error: 'username et mot de passe sont requis' };
  }

  const db = event.context.mysql

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.execute(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword]
  );

  await db.end();

  return { message: 'Utilisateur créé avec succès' };
});
