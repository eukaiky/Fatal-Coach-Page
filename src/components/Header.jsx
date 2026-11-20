import React, { useState, useEffect } from 'react';
import { CtaButton } from '../ui/CtaButton';

export const Header = ({ onOpenAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { name: 'MÉTODO', href: '#como-funciona' },
    { name: 'ACOMPANHAMENTO', href: '#calculadora' },
    { name: 'ELOJOB', href: '#elojob' },
    { name: 'DUOJOB', href: '#duojob' },
    { name: 'INDIVIDUAL', href: '#coach-individual' },
    { name: 'PLANOS', href: '#planos' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[999] w-full transition-all duration-500 ${
          isMenuOpen
            ? 'bg-transparent border-transparent'
            : scrolled
            ? 'border-b border-white/5 bg-black/80 backdrop-blur-md py-3'
            : 'border-b border-transparent bg-transparent py-5'
        }`}
      >
        <nav className="container mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex shrink-0 justify-start">
            <a
              href="#top"
              onClick={() => setIsMenuOpen(false)}
              className="relative z-[999] flex items-center gap-2 transition-transform hover:scale-105"
            >
              <img
                src="/fatal-logo.png"
                alt="Fatal Logo"
                className="h-8 w-auto"
              />
            </a>
          </div>

          <ul className="hidden items-center justify-center gap-4 lg:gap-7 md:flex">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-xs font-bold text-gray-400 transition-colors duration-300 hover:text-white uppercase tracking-wider lg:tracking-widest whitespace-nowrap"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 justify-end gap-4 items-center">
            <div className="hidden md:block">
              <CtaButton
                href="#calculadora"
                variant="outline"
                className="!px-5 !py-2 !text-xs whitespace-nowrap"
              >
                SIMULAR ELO
              </CtaButton>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative z-[999] flex h-12 w-12 flex-col items-center justify-center gap-1.5 p-2 text-white md:hidden focus:outline-none"
              aria-label="Alternar menu"
            >
              <span
                className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'translate-y-2 rotate-45 bg-red-500' : 'bg-white'
                }`}
              ></span>
              <span
                className={`block h-0.5 w-4 rounded-full bg-current transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'opacity-0' : 'bg-white'
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                  isMenuOpen
                    ? '-translate-y-2 -rotate-45 bg-red-500'
                    : 'bg-white'
                }`}
              ></span>
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed top-0 left-0 right-0 z-[990] overflow-hidden border-b border-white/10 bg-black/95 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="container mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 pt-28 pb-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-black uppercase tracking-widest text-white transition-colors duration-300 hover:text-red-600"
            >
              {link.name}
            </a>
          ))}

          <hr className="w-20 border-t border-white/10 my-2" />

          <CtaButton
            href="#calculadora"
            variant="outline"
            className="!px-10 !py-4 !text-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            SIMULAR ELO
          </CtaButton>
        </nav>
      </div>
    </>
  );
};

export default Header;