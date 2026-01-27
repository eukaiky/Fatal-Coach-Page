import { sha256 } from '../utils/security';

const ADMIN_LOGIN = "fatal";
const ADMIN_SENHA_HASH = "273ab0f5d4721924162420312a511d044d2cff530fb9fc2a5a332490695a1c8e";

export async function authenticateAdmin(login, senha) {
  const loginLimpo = login.trim().toLowerCase();

  if (loginLimpo !== ADMIN_LOGIN) {
    return { success: false, error: 'login' };
  }

  try {
    const hashDigitado = await sha256(senha);
    if (hashDigitado === ADMIN_SENHA_HASH) {
      return { success: true };
    }
    return { success: false, error: 'password' };
  } catch (error) {
    return { success: false, error: 'generic' };
  }
}