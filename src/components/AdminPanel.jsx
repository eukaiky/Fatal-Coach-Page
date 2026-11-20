import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { FormInput } from '../ui/FormInput';
import { CtaButton } from '../ui/CtaButton';
import { authenticateAdmin, getAdminSession, logoutAdmin } from '../auth/adminAuth';
import {
  fetchEloPrices,
  saveEloPrices,
  fetchCoupons,
  createCoupon,
  deleteCoupon,
  fetchOrders,
} from '../data/eloData';
import { XIcon, CheckCircleIcon } from '../ui/Icons';

export default function AdminPanel({ onClose, onPricesUpdate }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [prices, setPrices] = useState(new Map());
  const [coupons, setCoupons] = useState([]);
  const [orders, setOrders] = useState([]);

  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const loadData = useCallback(async () => {
    const [priceData, couponData, orderData] = await Promise.all([
      fetchEloPrices(),
      fetchCoupons(),
      fetchOrders(),
    ]);
    setPrices(priceData);
    setCoupons(couponData);
    setOrders(orderData);
    setHasChanges(false);
  }, []);

  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      try {
        const session = await getAdminSession();
        if (!active) return;
        if (session) {
          setIsLoggedIn(true);
          await loadData();
        }
      } catch (err) {
        console.error('Erro ao verificar sessão administrativa:', err);
      } finally {
        if (active) setCheckingSession(false);
      }
    };
    checkSession();
    return () => { active = false; };
  }, [loadData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading || checkingSession) return;
    setLoading(true);
    setError('');

    try {
      const result = await authenticateAdmin(login, senha);
      if (result.success) {
        setIsLoggedIn(true);
        setSenha('');
        await loadData();
      } else if (result.error === 'unauthorized') {
        setError('Esta conta não possui acesso administrativo.');
      } else if (result.error === 'credentials') {
        setError('Email ou senha incorretos.');
      } else {
        setError('Não foi possível acessar o painel.');
      }
    } catch (err) {
      setError('Não foi possível acessar o painel.');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (key, valor) => {
    setPrices((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, parseFloat(valor));
      return newMap;
    });
    setHasChanges(true);
  };

  const handleSavePrices = async () => {
    setSaving(true);
    const success = await saveEloPrices(prices);
    if (success) {
      setSuccessMsg('Salvo com sucesso!');
      setHasChanges(false);
      if (onPricesUpdate) onPricesUpdate();
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setSuccessMsg('Erro ao salvar.');
    }
    setSaving(false);
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;
    const success = await createCoupon(newCouponCode, newCouponDiscount);
    if (success) {
      setNewCouponCode('');
      setNewCouponDiscount('');
      setCoupons(await fetchCoupons());
    } else {
      alert('Erro ao criar cupom.');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Tem certeza?')) {
      await deleteCoupon(id);
      setCoupons(await fetchCoupons());
    }
  };

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const success = await logoutAdmin();
      if (!success) return;
      setIsLoggedIn(false);
      setLogin('');
      setSenha('');
    } finally {
      setLoading(false);
    }
  };

  const renderPriceInput = (key, label) => (
    <div key={key} className="bg-black/40 p-4 rounded-xl border border-gray-800/80 hover:border-red-900/30 transition-colors">
      <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">R$</span>
        <input
          type="number"
          step="0.01"
          className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-2.5 pl-9 pr-3 text-white font-mono text-sm focus:border-red-600/50 focus:bg-black outline-none transition-all placeholder-gray-700"
          value={prices.get(key) ?? ''}
          onChange={(e) => handlePriceChange(key, e.target.value)}
        />
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
        <div className="w-full max-w-md relative">
          <Card className="border-red-900/20 shadow-2xl shadow-black/50 relative bg-gray-950">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors p-2">
              <XIcon className="w-5 h-5" />
            </button>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Acesso Admin</h2>
              <p className="text-sm text-gray-500 mt-2">Área restrita da equipe Fatal.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <FormInput id="admin-email" label="Email administrativo" type="email" required value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Seu email de administrador" />
              <FormInput label="Senha" type="password" id="admin-password" required value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Chave de acesso" />
              {error && (
                <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg text-center">
                  <span className="text-red-400 text-sm font-bold">{error}</span>
                </div>
              )}
              <CtaButton type="submit" className="w-full py-4 text-base" disabled={loading || checkingSession}>
                {checkingSession ? 'Verificando sessão...' : loading ? 'Entrando...' : 'ACESSAR PAINEL'}
              </CtaButton>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-950 text-gray-100 overflow-y-auto">
      <div className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white tracking-tight uppercase">Painel de Controle</h1>
        <div className="flex items-center gap-4">
          <button onClick={loadData} className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider">Atualizar</button>
          <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-white uppercase tracking-wider">Voltar</button>
          <button onClick={handleLogout} disabled={loading} className="text-red-500 hover:text-red-400 text-sm font-bold uppercase tracking-wider">Sair</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 pb-32 pt-8">
        <div className="flex flex-wrap justify-start mb-10 border-b border-gray-800 gap-2">
          {[
            { id: 'orders', label: 'Pedidos' },
            { id: 'prices', label: 'Tabela de Preços' },
            { id: 'coupons', label: 'Gerenciar Cupons' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-bold text-xs uppercase tracking-widest transition-all border-b-2 relative top-[1px] ${
                activeTab === tab.id ? 'border-red-600 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ABA PEDIDOS */}
        {activeTab === 'orders' && (
          <div className="border border-gray-800 rounded-xl overflow-hidden bg-black/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-400">
                <thead className="bg-black/40 uppercase font-bold text-gray-500">
                  <tr>
                    <th className="px-4 py-4">Cliente</th>
                    <th className="px-4 py-4">Serviço</th>
                    <th className="px-4 py-4">Valor</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/5">
                      <td className="px-4 py-4">
                        <p className="font-bold text-white">{o.customer_name}</p>
                        <p className="text-gray-500">{o.customer_contact} • {o.customer_email}</p>
                      </td>
                      <td className="px-4 py-4 text-white font-medium">{o.service_summary}</td>
                      <td className="px-4 py-4 font-mono font-bold text-white">
                        {Number(o.final_amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded font-bold uppercase text-[10px] ${
                          o.status === 'paid' ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                        }`}>
                          {o.status === 'paid' ? 'PAGO' : 'PENDENTE'}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono text-gray-400">
                        {o.created_at ? new Date(o.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-600 uppercase">Nenhum pedido ainda</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA PREÇOS */}
        {activeTab === 'prices' && (
          <div className="space-y-14">
            <section>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-6 pl-2 border-l-4 border-red-600">Coach Individual</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderPriceInput('coach_aula', 'Preço da Aula (80min)')}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-6 pl-2 border-l-4 border-gray-500">Acompanhamento</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
                {renderPriceInput('ferro', 'Ferro (por div)')}
                {renderPriceInput('bronze', 'Bronze (por div)')}
                {renderPriceInput('prata', 'Prata (por div)')}
                {renderPriceInput('ouro', 'Ouro (por div)')}
                {renderPriceInput('platina', 'Platina (por div)')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {renderPriceInput('esmeralda_4_3', 'Esmeralda IV → III')}
                {renderPriceInput('esmeralda_3_2', 'Esmeralda III → II')}
                {renderPriceInput('esmeralda_2_1', 'Esmeralda II → I')}
                {renderPriceInput('esmeralda_1_d4', 'Esmeralda I → Diam')}
                {renderPriceInput('diamante_4_3', 'Diamante IV → III')}
                {renderPriceInput('diamante_3_2', 'Diamante III → II')}
                {renderPriceInput('diamante_2_1', 'Diamante II → I')}
                {renderPriceInput('diamante_1_mestre', 'Diamante I → Mestre')}
                {renderPriceInput('mestre_graomestre', 'Mestre → GM (Fixo)')}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-6 pl-2 border-l-4 border-red-600">Elojob</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
                {renderPriceInput('elojob_ferro', 'Ferro (por div)')}
                {renderPriceInput('elojob_bronze', 'Bronze (por div)')}
                {renderPriceInput('elojob_prata', 'Prata (por div)')}
                {renderPriceInput('elojob_ouro', 'Ouro (por div)')}
                {renderPriceInput('elojob_platina', 'Platina (por div)')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {renderPriceInput('elojob_esmeralda_4_3', 'Esmeralda IV → III')}
                {renderPriceInput('elojob_esmeralda_3_2', 'Esmeralda III → II')}
                {renderPriceInput('elojob_esmeralda_2_1', 'Esmeralda II → I')}
                {renderPriceInput('elojob_esmeralda_1_d4', 'Esmeralda I → Diam')}
                {renderPriceInput('elojob_diamante_4_3', 'Diamante IV → III')}
                {renderPriceInput('elojob_diamante_3_2', 'Diamante III → II')}
                {renderPriceInput('elojob_diamante_2_1', 'Diamante II → I')}
                {renderPriceInput('elojob_diamante_1_mestre', 'Diamante I → Mestre')}
                {renderPriceInput('elojob_mestre_graomestre', 'Mestre → GM (Fixo)')}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-6 pl-2 border-l-4 border-amber-500">Duojob</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
                {renderPriceInput('duojob_ferro', 'Ferro (por div)')}
                {renderPriceInput('duojob_bronze', 'Bronze (por div)')}
                {renderPriceInput('duojob_prata', 'Prata (por div)')}
                {renderPriceInput('duojob_ouro', 'Ouro (por div)')}
                {renderPriceInput('duojob_platina', 'Platina (por div)')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {renderPriceInput('duojob_esmeralda_4_3', 'Esmeralda IV → III')}
                {renderPriceInput('duojob_esmeralda_3_2', 'Esmeralda III → II')}
                {renderPriceInput('duojob_esmeralda_2_1', 'Esmeralda II → I')}
                {renderPriceInput('duojob_esmeralda_1_d4', 'Esmeralda I → Diam')}
                {renderPriceInput('duojob_diamante_4_3', 'Diamante IV → III')}
                {renderPriceInput('duojob_diamante_3_2', 'Diamante III → II')}
                {renderPriceInput('duojob_diamante_2_1', 'Diamante II → I')}
                {renderPriceInput('duojob_diamante_1_mestre', 'Diamante I → Mestre')}
                {renderPriceInput('duojob_mestre_graomestre', 'Mestre → GM (Fixo)')}
              </div>
            </section>

            {(hasChanges || successMsg) && (
              <div className="fixed bottom-0 left-0 w-full bg-gray-950/90 backdrop-blur-md border-t border-gray-800 p-4 z-50 flex justify-center">
                <div className="flex items-center gap-6">
                  <span className="text-gray-400 text-xs font-bold uppercase">
                    {successMsg ? <span className="text-green-500 flex items-center gap-2"><CheckCircleIcon className="w-4 h-4"/> {successMsg}</span> : 'Há alterações não salvas'}
                  </span>
                  <CtaButton onClick={handleSavePrices} disabled={saving} className="!py-3 !px-10 !text-sm">
                    {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                  </CtaButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABA CUPONS */}
        {activeTab === 'coupons' && (
          <div className="max-w-4xl">
            <Card className="mb-10 border-gray-800 bg-gray-900/20">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-8">Novo Cupom</h3>
              <form onSubmit={handleCreateCoupon} className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full">
                  <FormInput label="Código" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())} placeholder="EX: FATAL2026" required />
                </div>
                <div className="w-full md:w-40">
                  <FormInput label="Desconto (%)" type="number" value={newCouponDiscount} onChange={(e) => setNewCouponDiscount(e.target.value)} placeholder="10" required />
                </div>
                <div className="w-full md:w-auto">
                  <CtaButton type="submit" className="w-full md:w-auto !py-4 !px-10">CRIAR CUPOM</CtaButton>
                </div>
              </form>
            </Card>

            <div className="border border-gray-800 rounded-xl overflow-hidden bg-black/20">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-black/20 text-[10px] uppercase font-bold text-gray-500">
                    <tr>
                      <th className="px-6 py-5">Código</th>
                      <th className="px-6 py-5">Desconto</th>
                      <th className="px-6 py-5">Criado em</th>
                      <th className="px-6 py-5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-white/5">
                        <td className="px-6 py-5 font-mono font-bold text-white tracking-widest">{c.code}</td>
                        <td className="px-6 py-5"><span className="text-green-400 font-bold">{c.discount_percent}% OFF</span></td>
                        <td className="px-6 py-5 text-xs font-mono text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-5 text-right">
                          <button onClick={() => handleDeleteCoupon(c.id)} className="text-red-500 hover:text-red-400 text-[10px] font-bold uppercase">EXCLUIR</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}