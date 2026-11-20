import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { SectionTitle } from '../ui/SectionTitle';
import { CtaButton } from '../ui/CtaButton';
import { CheckCircleIcon } from '../ui/Icons';
import { fetchEloPrices, validateCoupon } from '../data/eloData';

const IndividualCoach = ({ forceUpdateKey, onOpenCheckout }) => {
  const [pricePerClass, setPricePerClass] = useState(62.50);
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [loadingPrice, setLoadingPrice] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoadingPrice(true);
      const prices = await fetchEloPrices();
      const price = prices.get('coach_aula') || 62.50;
      setPricePerClass(price);
      setLoadingPrice(false);
    };
    loadData();
  }, [forceUpdateKey]);

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

  const subtotal = pricePerClass * quantity;
  const discountValue = appliedCoupon ? (subtotal * (appliedCoupon.discount_percent / 100)) : 0;
  const total = subtotal - discountValue;

  const formatPrice = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleContract = () => {
    onOpenCheckout({
      serviceType: 'coach',
      serviceSummary: `Coach Individual (${quantity} aula${quantity > 1 ? 's' : ''})`,
      serviceDetails: { quantity },
      couponCode: appliedCoupon?.code || null,
      finalPrice: total,
    });
  };

  return (
    <section id="coach-individual" className="relative overflow-hidden bg-gray-950 pt-24 pb-24 md:pt-32 md:pb-32">
      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <SectionTitle 
          title="COACH INDIVIDUAL" 
          subtitle="Evolua sua gameplay com aulas particulares dedicadas" 
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              <img 
                src="/viego.png" 
                alt="Coach Gameplay" 
                className="w-full h-64 md:h-80 object-cover object-center opacity-70 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h3 className="text-2xl font-bold text-white mb-2">Masterize seu Campeão</h3>
                <p className="text-gray-400 text-sm">Aprenda os segredos da rota, controle de mapa e tomada de decisão com quem entende do assunto.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white">Análise de Replay</h4>
                  <p className="text-sm text-gray-400">Identificação pontual de erros.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white">Micro e Macro</h4>
                  <p className="text-sm text-gray-400">Conceitos avançados de jogo.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white">Mentalidade</h4>
                  <p className="text-sm text-gray-400">Postura para subir de elo.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white">80 Minutos</h4>
                  <p className="text-sm text-gray-400">Duração de cada sessão.</p>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Monte seu Pacote</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Quantidade de Aulas</label>
                <div className="flex items-center gap-4 bg-gray-950 p-2 rounded-lg border border-gray-800">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded bg-gray-800 text-white hover:bg-red-600 transition-colors font-bold text-xl"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-xl font-bold text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded bg-gray-800 text-white hover:bg-red-600 transition-colors font-bold text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Cupom de Desconto</label>
                <div className="flex flex-wrap gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    placeholder="CÓDIGO"
                    className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-red-600 outline-none uppercase"
                  />
                  {appliedCoupon ? (
                    <button 
                      onClick={removeCoupon}
                      className="px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/50 rounded-lg hover:bg-red-900/40 transition-colors text-xs font-bold uppercase"
                    >
                      Remover
                    </button>
                  ) : (
                    <button 
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors text-xs font-bold uppercase"
                    >
                      Aplicar
                    </button>
                  )}
                </div>
                {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                {appliedCoupon && <p className="text-green-500 text-xs mt-2 font-bold">Cupom aplicado: {appliedCoupon.discount_percent}% OFF</p>}
              </div>
            </div>

            <hr className="border-gray-800 my-6" />
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Preço unitário</span>
                <span>{formatPrice(pricePerClass)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-500 text-sm font-medium">
                  <span>Desconto</span>
                  <span>- {formatPrice(discountValue)}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-2">
                <span className="text-white font-bold text-lg">Total</span>
                {loadingPrice ? (
                  <span className="text-gray-500 animate-pulse">...</span>
                ) : (
                  <span className="text-4xl font-bold text-red-600">{formatPrice(total)}</span>
                )}
              </div>
            </div>

            <CtaButton
              onClick={handleContract}
              variant="primary"
              className="w-full"
              disabled={loadingPrice || total <= 0}
            >
              CONTRATAR AULAS
            </CtaButton>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default IndividualCoach;