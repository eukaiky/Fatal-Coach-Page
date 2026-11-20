import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/Card';
import { FormInput } from '../ui/FormInput';
import { CtaButton } from '../ui/CtaButton';
import { XIcon, CheckCircleIcon } from '../ui/Icons';
import { supabase } from '../supabaseClient';

const WHATSAPP_NUMBER = '5519986062412';
const WHATSAPP_DISPLAY = '+55 19 98606-2412';

export default function CheckoutModal({ isOpen, onClose, orderPayload }) {
  // 1: Dados & Forma de Pagamento
  // 2: QR Code Pix / Fatura Asaas (Aguardando pagamento)
  // 3: Concluído (Aviso do Fatal + dúvidas + botão WhatsApp)
  const [step, setStep] = useState(1);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCpf, setCustomerCpf] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [billingType, setBillingType] = useState('PIX');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [checkoutData, setCheckoutData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    setStep(1);
    setError('');
    setCheckoutData(null);
    setCopied(false);

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const advanceAfterPayment = useCallback(() => {
    setStep(3);
  }, []);

  // Verifica a cada 4s se o webhook do Asaas confirmou o pagamento
  useEffect(() => {
    if (step !== 2 || !checkoutData?.orderId) return;

    const checkPaymentStatus = async () => {
      const { data, error: rpcError } = await supabase.rpc('get_order_status', {
        order_uuid: checkoutData.orderId,
      });

      if (rpcError) {
        console.error('Erro ao checar status do pedido:', rpcError);
        return;
      }

      if (Array.isArray(data) && data[0]?.status === 'paid') {
        advanceAfterPayment();
      }
    };

    checkPaymentStatus();
    const interval = setInterval(checkPaymentStatus, 4000);
    return () => clearInterval(interval);
  }, [step, checkoutData, advanceAfterPayment]);

  if (!isOpen || !orderPayload) return null;

  const parseInvokeError = async (fnError) => {
    let detailedMessage = fnError.message;
    const status = fnError.context?.status;
    try {
      if (fnError.context && typeof fnError.context.text === 'function') {
        const rawText = await fnError.context.text();
        if (rawText) {
          try {
            const parsed = JSON.parse(rawText);
            detailedMessage = parsed.error || parsed.message || rawText;
          } catch {
            detailedMessage = rawText;
          }
        }
      }
    } catch (_) {}
    return status ? `[Erro ${status}] ${detailedMessage}` : detailedMessage;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-asaas-checkout', {
        body: {
          customerName,
          customerEmail,
          customerCpf,
          customerContact,
          serviceType: orderPayload.serviceType,
          serviceSummary: orderPayload.serviceSummary,
          serviceDetails: orderPayload.serviceDetails,
          couponCode: orderPayload.couponCode || null,
          billingType,
        },
      });

      if (fnError) throw new Error(await parseInvokeError(fnError));
      if (data?.error) throw new Error(data.error);

      setCheckoutData(data);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Erro inesperado ao processar pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyPix = () => {
    if (!checkoutData?.pixCopyPaste) return;
    navigator.clipboard.writeText(checkoutData.pixCopyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const formatPrice = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Olá Fatal! Acabei de realizar o pagamento do pedido #${checkoutData?.orderId?.slice(0, 8) || ''} (${orderPayload.serviceSummary}) e gostaria de tirar uma dúvida.`
  )}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg my-auto">
        <Card className="border-red-900/30 bg-gray-950 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2"
            aria-label="Fechar checkout"
          >
            <XIcon className="w-5 h-5" />
          </button>

          <div className="mb-6 pr-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
              {step === 3 ? 'Pagamento Confirmado • Tudo Pronto' : 'Pagamento Automático • Asaas'}
            </span>
            <h3 className="text-lg font-bold text-white mt-1">{orderPayload.serviceSummary}</h3>
            <p className="text-3xl font-black text-white mt-1">{formatPrice(orderPayload.finalPrice)}</p>
          </div>

          {/* ETAPA 1: DADOS & PAGAMENTO */}
          {step === 1 && (
            <form onSubmit={handleCheckout} className="space-y-4">
              <FormInput
                id="checkout-name"
                label="Nome Completo"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Seu nome completo"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  id="checkout-cpf"
                  label="CPF (Obrigatório para Pix)"
                  required
                  value={customerCpf}
                  onChange={(e) => setCustomerCpf(e.target.value)}
                  placeholder="000.000.000-00"
                />
                <FormInput
                  id="checkout-contact"
                  label="WhatsApp ou Discord"
                  required
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <FormInput
                id="checkout-email"
                label="E-mail"
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="seu@email.com"
              />

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBillingType('PIX')}
                    className={`py-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                      billingType === 'PIX'
                        ? 'bg-red-600/20 border-red-600 text-white'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    PIX (Instantâneo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingType('CREDIT_CARD')}
                    className={`py-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                      billingType === 'CREDIT_CARD'
                        ? 'bg-red-600/20 border-red-600 text-white'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    Cartão de Crédito
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 bg-gray-900/70 border border-gray-800 rounded-lg p-3">
                Assim que o pagamento for aprovado, o Fatal entrará em contato com você para iniciar o serviço.
              </p>

              {error && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 text-xs font-bold break-words">
                  {error}
                </div>
              )}

              <CtaButton type="submit" disabled={submitting} className="w-full py-4 mt-2">
                {submitting ? 'GERANDO COBRANÇA...' : 'GERAR PAGAMENTO'}
              </CtaButton>
            </form>
          )}

          {/* ETAPA 2: QR CODE PIX / FATURA */}
          {step === 2 && checkoutData && (
            <div className="text-center space-y-5">
              {checkoutData.billingType === 'PIX' && (checkoutData.pixQrCode || checkoutData.pixCopyPaste) ? (
                <>
                  <p className="text-xs text-gray-400">
                    Escaneie o QR Code no app do seu banco ou copie o código Pix abaixo:
                  </p>
                  {checkoutData.pixQrCode && (
                    <div className="bg-white p-3 rounded-xl inline-block mx-auto">
                      <img
                        src={`data:image/png;base64,${checkoutData.pixQrCode}`}
                        alt="QR Code Pix"
                        className="w-48 h-48"
                      />
                    </div>
                  )}
                  {checkoutData.pixCopyPaste && (
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={checkoutData.pixCopyPaste}
                        className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 font-mono outline-none"
                      />
                      <button
                        type="button"
                        onClick={copyPix}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase transition-colors"
                      >
                        {copied ? 'COPIADO!' : 'COPIAR'}
                      </button>
                    </div>
                  )}
                  {checkoutData.invoiceUrl && (
                    <a
                      href={checkoutData.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-red-400 hover:text-red-300 underline font-semibold"
                    >
                      Abrir link da fatura no Asaas
                    </a>
                  )}
                  <p className="text-xs text-yellow-500 animate-pulse font-semibold">
                    Aguardando confirmação automática do pagamento...
                  </p>
                </>
              ) : (
                <div className="space-y-4 py-4">
                  <p className="text-sm text-gray-300">
                    Clique no botão abaixo para pagar no ambiente seguro do Asaas:
                  </p>
                  {checkoutData.invoiceUrl && (
                    <CtaButton href={checkoutData.invoiceUrl} className="w-full py-4">
                      ABRIR FATURA NO ASAAS
                    </CtaButton>
                  )}
                  <p className="text-xs text-yellow-500 animate-pulse font-semibold">
                    Esta tela avançará assim que o pagamento for aprovado.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ETAPA 3: PÓS-PAGAMENTO + AVISO DO FATAL + WHATSAPP */}
          {step === 3 && checkoutData && (
            <div className="text-center py-4 space-y-5">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h4 className="text-2xl font-bold text-white">Pagamento Confirmado!</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Pedido <span className="font-mono text-white">#{checkoutData.orderId.slice(0, 8)}</span> aprovado com sucesso.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 text-left space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Próximos passos
                </p>
                <p className="text-xs text-gray-200 leading-relaxed">
                  Seu pagamento já foi confirmado e registrado no sistema. O <strong className="text-white">Fatal</strong> entrará em contato com você em breve pelo contato informado (<strong className="text-white">{customerContact || 'WhatsApp/Discord'}</strong>) para alinhar os próximos passos e iniciar o atendimento.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Em caso de dúvidas, suporte ou qualquer solicitação sobre o seu pedido, é só chamar diretamente no WhatsApp abaixo.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-lg shadow-green-950/50"
              >
                DÚVIDAS? CHAMAR NO WHATSAPP ({WHATSAPP_DISPLAY})
              </a>

              <CtaButton onClick={onClose} variant="primary" className="w-full py-4">
                CONCLUIR
              </CtaButton>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}