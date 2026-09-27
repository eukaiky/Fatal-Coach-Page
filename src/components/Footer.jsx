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
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3">
          <div className="md:col-span-2">
            <a href="#top" className="block">
              <img
                src="/fatal-logo.png"
                alt="Fatal Logo"
                className="h-8 w-auto opacity-80 transition-opacity hover:opacity-100"
              />
            </a>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-gray-500">
              Fatal fullclear CEO.
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
                  href="#calculadora"
                  className="text-sm text-gray-500 transition-colors hover:text-red-500"
                >
                  Acompanhamento
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
                  href="#planos"
                  className="text-sm text-gray-500 transition-colors hover:text-red-500"
                >
                  Planos
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 lg:flex-row text-center lg:text-left">
          <p 
            className="text-xs text-gray-600 cursor-pointer select-none"
            onClick={handleAdminClick}
          >
            © {new Date().getFullYear()} Fatal. Todos os direitos reservados.
          </p>

          <div className="flex flex-col items-center gap-3 text-xs lg:items-end">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 lg:justify-end">
              <span className="text-gray-500">Desenvolvido por</span>
              <a
                href="https://www.instagram.com/orodriguesgeraldo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Kaiky Rodrigues Geraldo"
                className="font-semibold text-gray-300 transition-colors hover:text-red-500"
              >
                Kaiky Rodrigues Geraldo <span aria-hidden="true">↗</span>
              </a>
            </div>
            <nav aria-label="Contato do desenvolvedor" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-end">
              <a
                href="mailto:orodriguesgeraldo@gmail.com"
                aria-label="Enviar email para Kaiky Rodrigues Geraldo"
                className="text-gray-400 transition-colors hover:text-red-500"
              >
                Email
              </a>
              <a
                href="https://wa.me/5535991985814"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de Kaiky Rodrigues Geraldo"
                className="text-gray-400 transition-colors hover:text-red-500"
              >
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/orodriguesgeraldo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Kaiky Rodrigues Geraldo"
                className="text-gray-400 transition-colors hover:text-red-500"
              >
                Instagram
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
