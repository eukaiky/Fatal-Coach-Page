import React, { useState } from 'react';

const Footer = ({ onOpenAdmin }) => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleAdminClick = () => {
    const currentTime = new Date().getTime();
    
    // Resetar o contador se o intervalo for maior que 400ms (tempo para um clique duplo/triplo)
    if (currentTime - lastClickTime > 400) {
      setClickCount(1);
    } else {
      const newCount = clickCount + 1;
      setClickCount(newCount);

      // Se 3 cliques rápidos forem detectados, abra o Admin
      if (newCount >= 3) {
        onOpenAdmin();
        setClickCount(0); // Resetar após abrir
      }
    }
    
    setLastClickTime(currentTime);
  };

  return (
    <footer
      id="footer"
      className="border-t border-white/5 bg-gray-950 pt-20 pb-10"
    >
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <a href="#top" className="block">
              <img
                src="/fatal-logo.png"
                alt="Fatal Logo"
                className="h-8 w-auto opacity-80 transition-opacity hover:opacity-100"
              />
            </a>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-gray-500">
              "Tô melado de bosta" <br/>- Fatal 26/11/2025
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">
              Navegação
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#como-funciona"
                  className="text-sm text-gray-500 transition-colors hover:text-red-500"
                >
                  Método
                </a>
              </li>
              <li>
                <a
                  href="#coach-individual"
                  className="text-sm text-gray-500 transition-colors hover:text-red-500"
                >
                  Individual
                </a>
              </li>
              <li>
                <a
                  href="#calculadora"
                  className="text-sm text-gray-500 transition-colors hover:text-red-500"
                >
                  Acompanhamento
                </a>
              </li>
              <li>
                <a
                  href="#planos"
                  className="text-sm text-gray-500 transition-colors hover:text-red-500"
                >
                  Planos
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between border-t border-white/5 pt-8 sm:flex-row text-center sm:text-left">
          <p 
            className="text-xs text-gray-600 cursor-pointer select-none"
            onClick={handleAdminClick}
          >
            © {new Date().getFullYear()} Fatal. Todos os direitos reservados.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 sm:mt-0">
            <span>Desenvolvido por</span>
            <a
              href="https://www.instagram.com/kaikyrg"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <img
                src="/K.png"
                alt="K"
                className="h-5 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;