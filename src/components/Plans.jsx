import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle } from '../ui/SectionTitle';
import { CheckCircleIcon } from '../ui/Icons';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

const Plans = () => (
  <section
    id="planos"
    className="relative overflow-hidden bg-black pt-24 pb-24 md:pt-32 md:pb-32"
  >
    <div className="container relative z-10 mx-auto max-w-7xl px-6">
      <SectionTitle
        title="PLANOS — A DIFERENÇA"
        subtitle="Escolha o nível de acompanhamento ideal para sua jornada."
      />

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        <Card className="border-gray-800 bg-gray-900/30 hover:border-gray-700 transition-all flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white uppercase tracking-wide">Plano Básico</h3>
            <p className="text-gray-500 text-sm mt-2">Para quem quer resultado rápido e direto.</p>
          </div>
          <div className="flex-1 space-y-4 mb-8">
            <div className="flex gap-3 text-gray-300 text-sm">
              <CheckIcon />
              <span>Coach padrão focado em metas</span>
            </div>
            <div className="flex gap-3 text-gray-300 text-sm">
              <CheckIcon />
              <span>Meta de partidas diárias</span>
            </div>
            <div className="flex gap-3 text-gray-300 text-sm">
              <CheckIcon />
              <span>Suporte ilimitado via WhatsApp/Discord</span>
            </div>
            <div className="flex gap-3 text-gray-300 text-sm">
              <CheckIcon />
              <span>Acompanhamento de progresso</span>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center mb-2 uppercase tracking-widest">Incluso no Coach</p>
            <div className="w-full py-3 bg-gray-800 text-gray-400 rounded-lg text-center font-bold text-sm cursor-not-allowed opacity-75">
              PADRÃO
            </div>
          </div>
        </Card>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-b from-red-600 to-red-900 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <Card className="relative border-red-900/50 bg-gray-900 flex flex-col h-full transform group-hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Recomendado
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
                Plano Pro <span className="text-red-500 text-3xl">.</span>
              </h3>
              <p className="text-gray-400 text-sm mt-2">Especialize-se e domine o jogo.</p>
            </div>
            <div className="flex-1 space-y-4 mb-8">
              <div className="flex gap-3 text-white text-sm font-medium">
                <CheckIcon />
                <span>Tudo do plano básico</span>
              </div>
              <div className="flex gap-3 text-white text-sm font-medium">
                <CheckIcon />
                <span><strong className="text-red-400">Especialização</strong> em 1 campeão (Mono)</span>
              </div>
              <div className="flex gap-3 text-white text-sm font-medium">
                <CheckIcon />
                <span>Streams de partidas ao vivo</span>
              </div>
              <div className="flex gap-3 text-white text-sm font-medium">
                <CheckIcon />
                <span>Call durante os jogos (Live Coach)</span>
              </div>
              <div className="flex gap-3 text-white text-sm font-medium">
                <CheckIcon />
                <span>Análise de VOD a cada 15 jogos</span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-800">
               <p className="text-xs text-red-400 text-center mb-2 uppercase tracking-widest font-bold">Melhor Custo-Benefício</p>
               <div className="w-full py-3 bg-red-600 text-white rounded-lg text-center font-bold text-sm shadow-lg shadow-red-900/20">
                 +30% NO VALOR
               </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mx-auto mt-32 max-w-4xl">
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-900 via-red-600 to-red-900 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-gray-950 border border-gray-800 rounded-2xl p-8 md:p-12 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
                
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight uppercase italic">
                    Compromisso <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Fatal</span>
                </h3>
                
                <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                    Não descansamos até você ver o emblema do seu novo elo. <br className="hidden md:block"/>
                    <span className="text-white font-medium">O serviço só termina quando o objetivo é entregue.</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-bold text-gray-300 uppercase tracking-wide">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800 text-red-600">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span>Sem taxas extras</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800 text-red-600">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span>Sem enrolação</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800 text-red-600">
                           <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <span>Garantia total</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </section>
);

export default Plans;