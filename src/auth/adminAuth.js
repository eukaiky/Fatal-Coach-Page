import { supabase } from '../supabaseClient';

/* =========================================================
   LOGIN ADMIN
========================================================= */

export async function authenticateAdmin(
  email,
  password
) {
  try {
    const normalizedEmail =
      String(email || '')
        .trim()
        .toLowerCase();

    if (
      !normalizedEmail ||
      !password
    ) {
      return {
        success: false,
        error: 'credentials',
      };
    }

    /*
      A senha agora vai para o Supabase Auth.

      Ela não existe mais no código
      do seu site.
    */
    const {
      data,
      error,
    } = await supabase.auth
      .signInWithPassword({
        email: normalizedEmail,
        password,
      });

    if (
      error ||
      !data?.user
    ) {
      return {
        success: false,
        error: 'credentials',
      };
    }

    /*
      Login válido não significa
      automaticamente "admin".

      Agora verificamos a tabela
      public.admins.

      O RLS só deixa o usuário
      enxergar a própria entrada.
    */
    const {
      data: admin,
      error: adminError,
    } = await supabase
      .from('admins')
      .select('user_id')
      .eq(
        'user_id',
        data.user.id
      )
      .maybeSingle();

    if (
      adminError ||
      !admin
    ) {
      /*
        Conta existe, mas não
        pertence à equipe admin.
      */
      await supabase.auth.signOut({
        scope: 'local',
      });

      return {
        success: false,
        error: 'unauthorized',
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    console.error(
      'Erro na autenticação administrativa:',
      error
    );

    return {
      success: false,
      error: 'generic',
    };
  }
}

/* =========================================================
   VERIFICAR SESSÃO
========================================================= */

export async function getAdminSession() {
  try {
    /*
      getUser() consulta o servidor
      do Supabase Auth.

      Isso é melhor para nossa
      verificação administrativa
      do que confiar em um boolean
      no sessionStorage.
    */
    const {
      data: { user },
      error,
    } =
      await supabase.auth.getUser();

    if (
      error ||
      !user
    ) {
      return null;
    }

    const {
      data: admin,
      error: adminError,
    } = await supabase
      .from('admins')
      .select('user_id')
      .eq(
        'user_id',
        user.id
      )
      .maybeSingle();

    if (
      adminError ||
      !admin
    ) {
      return null;
    }

    return {
      user,
    };
  } catch (error) {
    console.error(
      'Erro ao verificar sessão administrativa:',
      error
    );

    return null;
  }
}

/* =========================================================
   LOGOUT
========================================================= */

export async function logoutAdmin() {
  try {
    /*
      local = encerra apenas
      esta sessão neste navegador.
    */
    const { error } =
      await supabase.auth.signOut({
        scope: 'local',
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(
      'Erro ao sair do painel:',
      error
    );

    return false;
  }
}
