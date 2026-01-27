import { supabase } from '../supabaseClient';

export const initialLeagueData = [
  { value: 'ferro', label: 'Ferro', rank: 0, img: 'Iron.webp', eloRank: 0 },
  { value: 'bronze', label: 'Bronze', rank: 4, img: 'Bronze.webp', eloRank: 1 },
  { value: 'prata', label: 'Prata', rank: 8, img: 'Prata.webp', eloRank: 2 },
  { value: 'ouro', label: 'Ouro', rank: 12, img: 'Gold.webp', eloRank: 3 },
  { value: 'platina', label: 'Platina', rank: 16, img: 'Platina.png', eloRank: 4 },
  { value: 'esmeralda', label: 'Esmeralda', rank: 20, img: 'Esmeralda.png', eloRank: 5 },
  { value: 'diamante', label: 'Diamante', rank: 24, img: 'Diamante.png', eloRank: 6 },
  { value: 'mestre', label: 'Mestre', rank: 28, img: 'Mestre.png', eloRank: 7 },
  { value: 'graomestre', label: 'Grão Mestre', rank: 29, img: 'Grande-Mestre.png', eloRank: 8 },
];

export const initialDivisionData = [
  { value: '4', label: 'IV', rank: 0 },
  { value: '3', label: 'III', rank: 1 },
  { value: '2', label: 'II', rank: 2 },
  { value: '1', label: 'I', rank: 3 },
];

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
  ['coach_aula', 62.50],
];

export async function fetchEloPrices() {
  try {
    const { data, error } = await supabase
      .from('prices')
      .select('key, value');

    if (error) throw error;

    if (data && data.length > 0) {
      const map = new Map();
      data.forEach(item => {
        map.set(item.key, Number(item.value));
      });
      return map;
    }
  } catch (error) {
    console.error(error);
  }
  return new Map(DEFAULT_PRICES);
}

export async function saveEloPrices(pricesMap) {
  try {
    const updates = Array.from(pricesMap.entries()).map(([key, value]) => ({
      key,
      value
    }));

    const { error } = await supabase
      .from('prices')
      .upsert(updates, { onConflict: 'key' });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function fetchCoupons() {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createCoupon(code, discountPercent) {
  try {
    const { error } = await supabase
      .from('coupons')
      .insert([{ code: code.toUpperCase(), discount_percent: discountPercent }]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteCoupon(id) {
  try {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function validateCoupon(code) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    return null;
  }
}