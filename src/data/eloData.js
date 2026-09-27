import { supabase } from '../supabaseClient';

/* =========================================================
   ELOS
========================================================= */

export const initialLeagueData = [
  {
    value: 'ferro',
    label: 'Ferro',
    rank: 0,
    img: 'Iron.webp',
    eloRank: 0,
  },
  {
    value: 'bronze',
    label: 'Bronze',
    rank: 4,
    img: 'Bronze.webp',
    eloRank: 1,
  },
  {
    value: 'prata',
    label: 'Prata',
    rank: 8,
    img: 'Prata.webp',
    eloRank: 2,
  },
  {
    value: 'ouro',
    label: 'Ouro',
    rank: 12,
    img: 'Gold.webp',
    eloRank: 3,
  },
  {
    value: 'platina',
    label: 'Platina',
    rank: 16,
    img: 'Platina.png',
    eloRank: 4,
  },
  {
    value: 'esmeralda',
    label: 'Esmeralda',
    rank: 20,
    img: 'Esmeralda.png',
    eloRank: 5,
  },
  {
    value: 'diamante',
    label: 'Diamante',
    rank: 24,
    img: 'Diamante.png',
    eloRank: 6,
  },
  {
    value: 'mestre',
    label: 'Mestre',
    rank: 28,
    img: 'Mestre.png',
    eloRank: 7,
  },
  {
    value: 'graomestre',
    label: 'Grão Mestre',
    rank: 29,
    img: 'Grande-Mestre.png',
    eloRank: 8,
  },
];

export const initialDivisionData = [
  {
    value: '4',
    label: 'IV',
    rank: 0,
  },
  {
    value: '3',
    label: 'III',
    rank: 1,
  },
  {
    value: '2',
    label: 'II',
    rank: 2,
  },
  {
    value: '1',
    label: 'I',
    rank: 3,
  },
];

/* =========================================================
   FALLBACK DE PREÇOS
========================================================= */

const DEFAULT_PRICES = [
  ['ferro', 12.5],
  ['bronze', 17.5],
  ['prata', 22.5],
  ['ouro', 25.0],
  ['platina', 32.5],

  ['esmeralda_4_3', 35.0],
  ['esmeralda_3_2', 38.0],
  ['esmeralda_2_1', 42.0],
  ['esmeralda_1_d4', 50.0],

  ['diamante_4_3', 55.0],
  ['diamante_3_2', 58.0],
  ['diamante_2_1', 60.0],
  ['diamante_1_mestre', 80.0],

  ['mestre_graomestre', 500.0],

  ['coach_aula', 62.5],
];

/* =========================================================
   PREÇOS
========================================================= */

export async function fetchEloPrices() {
  try {
    const { data, error } = await supabase
      .from('prices')
      .select('key, value');

    if (error) {
      throw error;
    }

    if (data?.length) {
      return new Map(
        data.map((item) => [
          item.key,
          Number(item.value),
        ])
      );
    }
  } catch (error) {
    console.error(
      'Erro ao carregar preços:',
      error
    );
  }

  /*
    Se Supabase ficar indisponível,
    o site continua exibindo os
    valores padrão.
  */
  return new Map(DEFAULT_PRICES);
}

/* =========================================================
   SALVAR PREÇOS

   Não usamos UPSERT.

   Agora o banco permite UPDATE para
   admins, mas não INSERT em prices.

   Isso é proposital.
========================================================= */

export async function saveEloPrices(pricesMap) {
  try {
    const entries = Array.from(
      pricesMap.entries()
    );

    if (entries.length === 0) {
      return true;
    }

    const results = await Promise.all(
      entries.map(async ([key, value]) => {
        const numericValue =
          Number(value);

        if (
          !Number.isFinite(numericValue) ||
          numericValue < 0
        ) {
          throw new Error(
            `Preço inválido para ${key}`
          );
        }

        const { error } = await supabase
          .from('prices')
          .update({
            value: numericValue,
          })
          .eq('key', key);

        if (error) {
          throw error;
        }

        return true;
      })
    );

    return results.every(Boolean);
  } catch (error) {
    console.error(
      'Erro ao salvar preços:',
      error
    );

    return false;
  }
}

/* =========================================================
   CUPONS — ADMIN

   RLS impede visitantes anônimos
   de executar estas operações.
========================================================= */

export async function fetchCoupons() {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select(
        'id, code, discount_percent, created_at'
      )
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(
      'Erro ao carregar cupons:',
      error
    );

    return [];
  }
}

/* =========================================================
   CRIAR CUPOM
========================================================= */

export async function createCoupon(
  code,
  discountPercent
) {
  try {
    const normalizedCode =
      String(code || '')
        .trim()
        .toUpperCase();

    const discount =
      Number(discountPercent);

    if (!normalizedCode) {
      return false;
    }

    if (
      !Number.isFinite(discount) ||
      discount <= 0 ||
      discount > 100
    ) {
      return false;
    }

    const { error } = await supabase
      .from('coupons')
      .insert({
        code: normalizedCode,
        discount_percent: discount,
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(
      'Erro ao criar cupom:',
      error
    );

    return false;
  }
}

/* =========================================================
   EXCLUIR CUPOM
========================================================= */

export async function deleteCoupon(id) {
  try {
    if (!id) {
      return false;
    }

    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(
      'Erro ao excluir cupom:',
      error
    );

    return false;
  }
}

/* =========================================================
   VALIDAR CUPOM — PÚBLICO

   IMPORTANTE:
   não consultamos mais a tabela
   coupons diretamente.

   Chamamos a RPC protegida que
   você acabou de criar no Supabase.
========================================================= */

export async function validateCoupon(code) {
  try {
    const normalizedCode =
      String(code || '')
        .trim()
        .toUpperCase();

    if (!normalizedCode) {
      return null;
    }

    const { data, error } =
      await supabase.rpc(
        'validate_coupon',
        {
          coupon_code: normalizedCode,
        }
      );

    if (error) {
      console.error(
        'Erro ao validar cupom:',
        error
      );

      return null;
    }

    if (
      !Array.isArray(data) ||
      data.length === 0
    ) {
      return null;
    }

    const coupon = data[0];

    return {
      code: coupon.code,
      discount_percent: Number(
        coupon.discount_percent
      ),
    };
  } catch (error) {
    console.error(
      'Erro inesperado ao validar cupom:',
      error
    );

    return null;
  }
}
