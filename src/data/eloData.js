import { supabase } from '../supabaseClient';

export const DEFAULT_PRICES = new Map([
  // Coach
  ['coach_aula', 62.5],

  // Acompanhamento
  ['ferro', 6],
  ['bronze', 8],
  ['prata', 10],
  ['ouro', 12],
  ['platina', 14],
  ['esmeralda_4_3', 28],
  ['esmeralda_3_2', 30],
  ['esmeralda_2_1', 33],
  ['esmeralda_1_d4', 37],
  ['diamante_4_3', 42],
  ['diamante_3_2', 52],
  ['diamante_2_1', 64],
  ['diamante_1_mestre', 78],
  ['mestre_graomestre', 360],

  // Elojob
  ['elojob_ferro', 8],
  ['elojob_bronze', 10],
  ['elojob_prata', 12],
  ['elojob_ouro', 14],
  ['elojob_platina', 18],
  ['elojob_esmeralda_4_3', 32],
  ['elojob_esmeralda_3_2', 36],
  ['elojob_esmeralda_2_1', 40],
  ['elojob_esmeralda_1_d4', 45],
  ['elojob_diamante_4_3', 50],
  ['elojob_diamante_3_2', 62],
  ['elojob_diamante_2_1', 75],
  ['elojob_diamante_1_mestre', 90],
  ['elojob_mestre_graomestre', 420],

  // Duojob
  ['duojob_ferro', 12],
  ['duojob_bronze', 15],
  ['duojob_prata', 18],
  ['duojob_ouro', 22],
  ['duojob_platina', 28],
  ['duojob_esmeralda_4_3', 45],
  ['duojob_esmeralda_3_2', 50],
  ['duojob_esmeralda_2_1', 55],
  ['duojob_esmeralda_1_d4', 65],
  ['duojob_diamante_4_3', 75],
  ['duojob_diamante_3_2', 90],
  ['duojob_diamante_2_1', 110],
  ['duojob_diamante_1_mestre', 135],
  ['duojob_mestre_graomestre', 550],
]);

export const initialLeagueData = [
  { value: 'ferro', label: 'Ferro', rank: 0, eloRank: 1, img: 'Iron.webp' },
  { value: 'bronze', label: 'Bronze', rank: 4, eloRank: 2, img: 'Bronze.webp' },
  { value: 'prata', label: 'Prata', rank: 8, eloRank: 3, img: 'Prata.webp' },
  { value: 'ouro', label: 'Ouro', rank: 12, eloRank: 4, img: 'Gold.webp' },
  { value: 'platina', label: 'Platina', rank: 16, eloRank: 5, img: 'Platina.png' },
  { value: 'esmeralda', label: 'Esmeralda', rank: 20, eloRank: 6, img: 'Esmeralda.png' },
  { value: 'diamante', label: 'Diamante', rank: 24, eloRank: 7, img: 'Diamante.png' },
  { value: 'mestre', label: 'Mestre', rank: 28, eloRank: 8, img: 'Mestre.png' },
  { value: 'graomestre', label: 'Grão-Mestre', rank: 29, eloRank: 9, img: 'Grande-Mestre.png' },
];

export const initialDivisionData = [
  { value: '4', label: 'IV', rank: 0 },
  { value: '3', label: 'III', rank: 1 },
  { value: '2', label: 'II', rank: 2 },
  { value: '1', label: 'I', rank: 3 },
];

export async function fetchEloPrices() {
  const { data, error } = await supabase.from('prices').select('key, value');
  const map = new Map(DEFAULT_PRICES);
  if (!error && Array.isArray(data)) {
    data.forEach((row) => {
      map.set(row.key, Number(row.value));
    });
  }
  return map;
}

export async function saveEloPrices(pricesMap) {
  const rows = Array.from(pricesMap.entries()).map(([key, value]) => ({
    key,
    value: Number(value) || 0,
  }));
  const { error } = await supabase.from('prices').upsert(rows, { onConflict: 'key' });
  return !error;
}

export async function fetchCoupons() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function createCoupon(code, discountPercent) {
  const { error } = await supabase.from('coupons').insert({
    code: String(code).trim().toUpperCase(),
    discount_percent: Number(discountPercent),
  });
  return !error;
}

export async function deleteCoupon(id) {
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  return !error;
}

export async function validateCoupon(code) {
  if (!code) return null;
  const { data, error } = await supabase.rpc('validate_coupon', {
    coupon_code: String(code).trim().toUpperCase(),
  });
  if (error || !Array.isArray(data) || data.length === 0) return null;
  return data[0];
}

export const validateCouponCode = validateCoupon;

/* =========================================================
   AGENDA E PEDIDOS
========================================================= */

export async function fetchAvailabilityRules() {
  const { data, error } = await supabase
    .from('availability_rules')
    .select('*')
    .order('day_of_week', { ascending: true });
  if (error) {
    console.error('Erro ao carregar regras de agenda:', error);
    return [];
  }
  return data || [];
}

export async function updateAvailabilityRule(rule) {
  const { error } = await supabase
    .from('availability_rules')
    .update({
      active: Boolean(rule.active),
      start_time: rule.start_time,
      end_time: rule.end_time,
      slot_duration_min: Number(rule.slot_duration_min),
    })
    .eq('day_of_week', rule.day_of_week);
  return !error;
}

export async function fetchBlockedDates() {
  const { data, error } = await supabase
    .from('blocked_dates')
    .select('*')
    .gte('end_datetime', new Date().toISOString())
    .order('start_datetime', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function createBlockedDate(startDatetime, endDatetime, reason) {
  const { error } = await supabase.from('blocked_dates').insert({
    start_datetime: startDatetime,
    end_datetime: endDatetime,
    reason: reason || 'Bloqueio administrativo',
  });
  return !error;
}

export async function deleteBlockedDate(id) {
  const { error } = await supabase.from('blocked_dates').delete().eq('id', id);
  return !error;
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    console.error('Erro ao carregar pedidos:', error);
    return [];
  }
  return data || [];
}