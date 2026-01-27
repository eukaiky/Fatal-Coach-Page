import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle } from '../ui/SectionTitle';
import { PlayCircleIcon } from '../ui/Icons';

const HowItWorks = () => (
  <section
    id="como-funciona"
    className="relative overflow-hidden bg-gray-950 pt-24 pb-24 md:pt-32 md:pb-32"
  >
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

    <div className="container relative z-10 mx-auto max-w-7xl px-6">
      <SectionTitle
        title="COMO FUNCIONA"
        subtitle="Nosso processo direto ao ponto para alavancar seu elo."
      />

      <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="bg-black/40 border-gray-800 hover:border-red-500/30 transition-colors group h-full">
          <div className="absolute -top-6 -left-6 z-0 text-[120px] font-black text-red-900/10 select-none group-hover:text-red-900/20 transition-colors">
            01
          </div>
          <div className="relative z-10 pt-4">
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors">
              Contratação e Segurança
            </h3>
            <p className="leading-relaxed text-gray-400 text-sm">
              Pagamento único e seguro. Confirmou? Você já cai direto no WhatsApp do Fatal com tudo pronto (plano e valor) para começar. Sem burocracia, só resultado!
            </p>
          </div>
        </Card>

        <Card className="bg-black/40 border-gray-800 hover:border-red-500/30 transition-colors group h-full">
          <div className="absolute -top-6 -left-6 z-0 text-[120px] font-black text-red-900/10 select-none group-hover:text-red-900/20 transition-colors">
            02
          </div>
          <div className="relative z-10 pt-4">
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors">
              Análise Profunda (VOD)
            </h3>
            <p className="leading-relaxed text-gray-400 text-sm">
              Identificamos vícios de gameplay que te prendem no elo atual. Analisamos suas partidas para corrigir rota, visão e tomadas de decisão.
            </p>
          </div>
        </Card>

        <Card className="bg-black/40 border-gray-800 hover:border-red-500/30 transition-colors group h-full">
          <div className="absolute -top-6 -left-6 z-0 text-[120px] font-black text-red-900/10 select-none group-hover:text-red-900/20 transition-colors">
            03
          </div>
          <div className="relative z-10 pt-4">
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors">
              Evolução e Resultado
            </h3>
            <p className="leading-relaxed text-gray-400 text-sm">
              Sua rotina de treinos é personalizada e o acompanhamento é diário. Não paramos até você atingir o elo contratado e dominar sua lane.
            </p>
          </div>
        </Card>
      </div>
    </div>
  </section>
);

export default HowItWorks;