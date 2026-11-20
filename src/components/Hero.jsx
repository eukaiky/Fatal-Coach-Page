import React from 'react';
import { CtaButton } from '../ui/CtaButton';

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-black pt-32 pb-16 lg:pt-48 lg:pb-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-red-600/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-900/50 bg-red-950/30 text-red-400 text-xs font-bold uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              FATAL COACH
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase leading-tight tracking-tight text-white">
              Chegue ao <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 drop-shadow-[0_0_25px_rgba(220,38,38,0.5)]">
                Topo da Fila
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Analiso seu estilo de jogo e crio um plano de treino focado para você atingir seu verdadeiro potencial no League of Legends.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <CtaButton
                href="#coach-individual"
                variant="primary"
                className="w-full sm:w-auto shadow-red-900/30 shadow-lg hover:scale-110 transition-transform duration-200 py-4 text-base"
              >
                QUERO COACH
              </CtaButton>
              <CtaButton
                href="#elojob"
                variant="outline"
                className="w-full sm:w-auto !border-emerald-500 !bg-emerald-600/20 !text-emerald-300 hover:!bg-emerald-600 hover:!text-white shadow-emerald-900/30 shadow-lg hover:scale-110 transition-all duration-200 py-4 text-base"
              >
                QUERO ELOJOB
              </CtaButton>
              <CtaButton
                href="#calculadora"
                variant="outline"
                className="w-full sm:w-auto hover:bg-white/5 hover:scale-110 transition-transform duration-200 py-4 text-base"
              >
                QUERO ACOMPANHAMENTO
              </CtaButton>
            </div>

            <div className="hidden lg:flex pt-8 flex-wrap items-center justify-start gap-6 text-gray-500 text-sm font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Melhores Coaches</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative animate-in zoom-in fade-in duration-1000 delay-200">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/20 rounded-full blur-[80px] animate-pulse"></div>
            <img
              src="/Grande-Mestre.png"
              alt="Elo Grande Mestre"
              className="relative z-10 w-full max-w-md mx-auto drop-shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;