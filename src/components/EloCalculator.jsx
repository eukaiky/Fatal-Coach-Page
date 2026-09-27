import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../ui/Card';
import { SectionTitle } from '../ui/SectionTitle';
import { CtaButton } from '../ui/CtaButton';
import { Alert } from '../ui/Alert';
import { WhatsAppIcon, CheckCircleIcon } from '../ui/Icons';
import { FormSelect } from '../ui/FormSelect';
import { initialLeagueData, initialDivisionData, fetchEloPrices, validateCoupon } from '../data/eloData';

const LIGAS = initialLeagueData;
const DIVISOES = initialDivisionData;
const LIGAS_OPTIONS = LIGAS.map((l) => ({ value: l.value, label: l.label }));
const DIVISOES_OPTIONS = DIVISOES.map((d) => ({ value: d.value, label: d.label }));
const MIN_DIVISION_ADVANCE = 8;
const MINIMUM_ORDER_MESSAGE = 'A contratação mínima é de 8 divisões (2 elos completos). Exemplo: Prata IV → Platina IV.';
const PLANOS_OPTIONS = [
  { value: 'basico', label: 'Básico' },
  { value: 'personalizado', label: 'Personalizado (+30%)' },
];

const getRankValue = (liga, divisao) => {
  const ligaData = LIGAS.find((l) => l.value === liga);
  if (!ligaData) return Number.NaN;
  if (['mestre', 'graomestre'].includes(liga)) return ligaData.rank;
  const divisaoData = DIVISOES.find((d) => d.value === divisao);
  if (!divisaoData) return Number.NaN;
  return ligaData.rank + divisaoData.rank;
};

const getLabel = (arr, value) => arr.find((item) => item.value === value)?.label || '';
const DESTINOS = LIGAS.flatMap((liga) => (
  ['mestre', 'graomestre'].includes(liga.value)
    ? [{ liga: liga.value, divisao: '4', rank: liga.rank }]
    : DIVISOES.map((divisao) => ({
      liga: liga.value,
      divisao: divisao.value,
      rank: liga.rank + divisao.rank,
    }))
));
const MAX_RANK = Math.max(...DESTINOS.map((destino) => destino.rank));
const getMinimumDestinationRank = (currentRank) => (
  currentRank + (MAX_RANK - currentRank < MIN_DIVISION_ADVANCE ? 1 : MIN_DIVISION_ADVANCE)
);

function EloCalculator({ forceUpdateKey }) {
  const [ligaAtual, setLigaAtual] = useState('prata');
  const [divisaoAtual, setDivisaoAtual] = useState('4');
  const [ligaDesejada, setLigaDesejada] = useState('platina');
  const [divisaoDesejada, setDivisaoDesejada] = useState('4');
  const [plano, setPlano] = useState('basico');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [priceMap, setPriceMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrices = async () => {
      setLoading(true);
      const prices = await fetchEloPrices();
      setPriceMap(prices);
      setLoading(false);
    };
    loadPrices();
  }, [forceUpdateKey]);

  const isDivisaoAtualDisabled = ['mestre', 'graomestre'].includes(ligaAtual);
  const isDivisaoDesejadaDisabled = ['mestre', 'graomestre'].includes(ligaDesejada);
  const valorAtual = getRankValue(ligaAtual, divisaoAtual);
  const valorDesejado = getRankValue(ligaDesejada, divisaoDesejada);
  const rankMinimo = getMinimumDestinationRank(valorAtual);
  const excecaoElosFinais = Number.isFinite(valorAtual)
    && valorAtual < MAX_RANK
    && MAX_RANK - valorAtual < MIN_DIVISION_ADVANCE;
  const temDestinoValido = DESTINOS.some((destino) => destino.rank >= rankMinimo);
  const eloRankAtual = LIGAS.find((liga) => liga.value === ligaAtual)?.eloRank || 0;
  const eloRankDesejado = LIGAS.find((liga) => liga.value === ligaDesejada)?.eloRank || 0;
  const planoForcado = eloRankDesejado - eloRankAtual > 2;
  const planoEfetivo = planoForcado ? 'personalizado' : plano;
  const erro = !Number.isFinite(valorAtual) || !Number.isFinite(valorDesejado)
    ? 'Selecione uma liga e uma divisão válidas.'
    : !temDestinoValido
    ? 'Não há um destino superior disponível para esta origem.'
    : valorDesejado <= valorAtual
    ? 'O destino deve estar acima da sua posição atual.'
    : valorDesejado < rankMinimo ? MINIMUM_ORDER_MESSAGE : '';

  const ajustarDestino = (novaLigaAtual, novaDivisaoAtual) => {
    const novoMinimo = getMinimumDestinationRank(getRankValue(novaLigaAtual, novaDivisaoAtual));
    if (valorDesejado >= novoMinimo) return;
    const primeiroDestino = DESTINOS.find((destino) => destino.rank >= novoMinimo);
    if (primeiroDestino) {
      setLigaDesejada(primeiroDestino.liga);
      setDivisaoDesejada(primeiroDestino.divisao);
    }
  };

  const handleLigaAtualChange = (event) => {
    const novaLiga = event.target.value;
    setLigaAtual(novaLiga);
    ajustarDestino(novaLiga, divisaoAtual);
  };

  const handleDivisaoAtualChange = (event) => {
    const novaDivisao = event.target.value;
    setDivisaoAtual(novaDivisao);
    ajustarDestino(ligaAtual, novaDivisao);
  };

  const handleLigaDesejadaChange = (event) => {
    const novaLiga = event.target.value;
    const primeiroDestino = DESTINOS.find((destino) => destino.liga === novaLiga && destino.rank >= rankMinimo);
    if (!primeiroDestino) return;
    setLigaDesejada(novaLiga);
    if (getRankValue(novaLiga, divisaoDesejada) < rankMinimo) {
      setDivisaoDesejada(primeiroDestino.divisao);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponError('');
    const coupon = await validateCoupon(couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode('');
    } else {
      setCouponError('Cupom inválido');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const { basePrice, finalPrice, whatsAppLink } = useMemo(() => {
    if (loading || priceMap.size === 0 || erro) {
      return { basePrice: 0, finalPrice: 0, whatsAppLink: undefined };
    }

    let calculatedBase = 0;
    for (let i = valorAtual; i < valorDesejado; i++) {
      const currentLigaRank = Math.floor(i / 4) * 4;
      const currentLiga = LIGAS.find((l) => l.rank === currentLigaRank)?.value;
      
      if (i === 28) calculatedBase += (priceMap.get('mestre_graomestre') || 0);
      else if (i === 27) calculatedBase += (priceMap.get('diamante_1_mestre') || 0);
      else if (i === 26) calculatedBase += (priceMap.get('diamante_2_1') || 0);
      else if (i === 25) calculatedBase += (priceMap.get('diamante_3_2') || 0);
      else if (i === 24) calculatedBase += (priceMap.get('diamante_4_3') || 0);
      else if (i === 23) calculatedBase += (priceMap.get('esmeralda_1_d4') || 0);
      else if (i === 22) calculatedBase += (priceMap.get('esmeralda_2_1') || 0);
      else if (i === 21) calculatedBase += (priceMap.get('esmeralda_3_2') || 0);
      else if (i === 20) calculatedBase += (priceMap.get('esmeralda_4_3') || 0);
      else if (currentLiga === 'platina') calculatedBase += (priceMap.get('platina') || 0);
      else if (currentLiga === 'ouro') calculatedBase += (priceMap.get('ouro') || 0);
      else if (currentLiga === 'prata') calculatedBase += (priceMap.get('prata') || 0);
      else if (currentLiga === 'bronze') calculatedBase += (priceMap.get('bronze') || 0);
      else if (currentLiga === 'ferro') calculatedBase += (priceMap.get('ferro') || 0);
    }

    const priceWithPlan = planoEfetivo === 'personalizado' ? calculatedBase * 1.3 : calculatedBase;

    const discount = appliedCoupon ? (priceWithPlan * (appliedCoupon.discount_percent / 100)) : 0;
    const total = priceWithPlan - discount;

    const formatPrice = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const ligaAtualLabel = getLabel(LIGAS, ligaAtual);
    const divisaoAtualLabel = isDivisaoAtualDisabled ? '' : getLabel(DIVISOES, divisaoAtual);
    const ligaDesejadaLabel = getLabel(LIGAS, ligaDesejada);
    const divisaoDesejadaLabel = isDivisaoDesejadaDisabled ? '' : getLabel(DIVISOES, divisaoDesejada);
    const planoLabel = planoEfetivo === 'basico' ? 'Básico' : 'Personalizado';
    const cupomMsg = appliedCoupon ? `\n🎟️ Cupom: ${appliedCoupon.code} (${appliedCoupon.discount_percent}% OFF)` : '';
    
    const msg = `Olá! Gostaria de contratar o Acompanhamento:\n\n🏁 *De:* ${ligaAtualLabel} ${divisaoAtualLabel}\n🚀 *Para:* ${ligaDesejadaLabel} ${divisaoDesejadaLabel}\n💎 *Plano:* ${planoLabel}${cupomMsg}\n💰 *Valor:* ${formatPrice(total)}`;
    
    return {
      basePrice: priceWithPlan,
      finalPrice: total,
      whatsAppLink: `https://wa.me/5519986062412?text=${encodeURIComponent(msg)}`,
    };

  }, [ligaAtual, divisaoAtual, ligaDesejada, divisaoDesejada, valorAtual, valorDesejado, planoEfetivo, isDivisaoAtualDisabled, isDivisaoDesejadaDisabled, priceMap, loading, appliedCoupon, erro]);

  const formatPrice = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const imgAtualSrc = `/${LIGAS.find((l) => l.value === ligaAtual)?.img}`;
  const imgDesejadaSrc = `/${LIGAS.find((l) => l.value === ligaDesejada)?.img}`;

  return (
    <section id="calculadora" className="relative overflow-hidden bg-black pt-24 pb-24 md:pt-32 md:pb-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none opacity-30 mix-blend-screen" />
      
      <div className="container relative mx-auto max-w-7xl px-6">
        <SectionTitle title="ACOMPANHAMENTO" subtitle="Simule o valor para atingir o elo desejado e contrate agora." />
        <p className="mt-4 text-center text-sm text-gray-400">
          {excecaoElosFinais
            ? 'Elos finais: como restam menos de 8 divisões até Grão-Mestre, você pode contratar qualquer avanço acima da sua posição atual.'
            : 'Contratação mínima: 8 divisões (2 elos completos). Ex.: Prata IV → Platina IV.'}
        </p>
        
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-gray-800 bg-black/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-red-900/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Onde você está?</span>
                  <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                </div>
                <img src={imgAtualSrc} alt="Atual" className="w-24 h-24 mx-auto mb-6 object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
                <div className="space-y-3">
                  <FormSelect id="ligaAtual" label="Liga" value={ligaAtual} onChange={handleLigaAtualChange} options={LIGAS_OPTIONS.filter(l => l.value !== 'graomestre')} />
                  <FormSelect id="divisaoAtual" label="Divisão" value={isDivisaoAtualDisabled ? '' : divisaoAtual} onChange={handleDivisaoAtualChange} options={isDivisaoAtualDisabled ? [{ value: '', label: 'Sem divisões' }] : DIVISOES_OPTIONS} disabled={isDivisaoAtualDisabled} />
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-red-900/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Onde quer chegar?</span>
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                </div>
                <img src={imgDesejadaSrc} alt="Desejado" className="w-24 h-24 mx-auto mb-6 object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]" />
                <div className="space-y-3">
                  <FormSelect id="ligaDesejada" label="Liga" value={ligaDesejada} onChange={handleLigaDesejadaChange} options={LIGAS_OPTIONS.filter(l => l.value !== 'ferro').map(l => ({ ...l, disabled: !DESTINOS.some(destino => destino.liga === l.value && destino.rank >= rankMinimo) }))} disabled={!temDestinoValido} />
                  <FormSelect id="divisaoDesejada" label="Divisão" value={isDivisaoDesejadaDisabled ? '' : divisaoDesejada} onChange={(e) => setDivisaoDesejada(e.target.value)} options={isDivisaoDesejadaDisabled ? [{ value: '', label: 'Sem divisões' }] : DIVISOES_OPTIONS.map(d => ({ ...d, disabled: getRankValue(ligaDesejada, d.value) < rankMinimo }))} disabled={isDivisaoDesejadaDisabled || !temDestinoValido} />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full max-w-sm">
                <FormSelect id="plano" label="Tipo de Serviço" value={planoEfetivo} onChange={(e) => setPlano(e.target.value)} options={PLANOS_OPTIONS.map(p => ({ ...p, disabled: p.value === 'basico' && planoForcado }))} />
              </div>
              <img src="/fatal-logo.png" alt="Logo" className="h-8 opacity-20 grayscale" />
            </div>
          </Card>
          
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-red-900/20 bg-gray-900/90 backdrop-blur-md shadow-2xl shadow-black/50">
                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                  Resumo do Pedido
                </h3>

                {erro ? (
                  <div className="text-center p-6 bg-red-950/20 border border-red-900/50 rounded-xl">
                    <p className="text-red-400 text-sm font-bold">{erro}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between bg-black/40 rounded-xl p-4 mb-6 border border-gray-800">
                      <div className="text-center">
                        <img src={imgAtualSrc} className="w-10 h-10 mx-auto mb-1" />
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{getLabel(LIGAS, ligaAtual)}</span>
                      </div>
                      <div className="flex-1 px-4 flex items-center">
                         <div className="h-[2px] w-full bg-gray-800 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
                         </div>
                      </div>
                      <div className="text-center">
                        <img src={imgDesejadaSrc} className="w-10 h-10 mx-auto mb-1" />
                        <span className="text-[10px] text-red-500 font-bold uppercase">{getLabel(LIGAS, ligaDesejada)}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Cupom de Desconto</label>
                       <div className="flex flex-wrap gap-2">
                           <input 
                               type="text" 
                               placeholder="CÓDIGO" 
                               className="flex-1 bg-black border border-gray-800 rounded-lg px-3 text-sm text-white uppercase focus:border-red-600 outline-none h-10"
                               value={couponCode}
                               onChange={(e) => setCouponCode(e.target.value)}
                               disabled={!!appliedCoupon}
                           />
                           {appliedCoupon ? (
                               <button onClick={removeCoupon} className="h-10 px-4 bg-red-900/20 text-red-500 border border-red-900/50 rounded-lg font-bold hover:bg-red-900/40 transition-colors">✕</button>
                           ) : (
                               <button onClick={handleApplyCoupon} className="h-10 px-4 bg-gray-800 text-white border border-gray-700 rounded-lg font-bold text-xs hover:bg-gray-700 transition-colors">APLICAR</button>
                           )}
                       </div>
                       {couponError && <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>}
                       {appliedCoupon && <p className="text-green-500 text-xs mt-2 flex items-center gap-1 font-bold"><CheckCircleIcon className="w-3 h-3"/> Desconto de {appliedCoupon.discount_percent}% aplicado!</p>}
                    </div>

                    <div className="border-t border-dashed border-gray-800 my-6"></div>
                    
                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between text-sm text-gray-500">
                           <span>Valor base</span>
                           <span>{formatPrice(basePrice)}</span>
                        </div>
                        {appliedCoupon && (
                            <div className="flex justify-between text-sm text-green-500 font-bold">
                                <span>Desconto</span>
                                <span>- {formatPrice(basePrice - finalPrice)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-white font-bold text-lg">Total</span>
                            {loading ? (
                                <span className="text-gray-500 text-sm animate-pulse">...</span>
                            ) : (
                                <span className="text-4xl font-bold text-white tracking-tighter">{formatPrice(finalPrice)}</span>
                            )}
                        </div>
                    </div>

                    <CtaButton href={whatsAppLink} variant="primary" className="w-full py-4 shadow-lg shadow-red-900/20 text-base" icon={<WhatsAppIcon />} disabled={!whatsAppLink}>
                        CONTRATAR AGORA
                    </CtaButton>
                    <p className="text-center text-[10px] text-gray-600 mt-3 uppercase tracking-wide">Pagamento Seguro via WhatsApp</p>
                  </>
                )}
              </Card>
            </div>

            {planoForcado && (
              <Alert title="Plano Personalizado Ativo" message="Devido à grande diferença de elos, o plano personalizado foi selecionado automaticamente para garantir seu resultado." />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EloCalculator;
