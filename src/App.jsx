import React, { useEffect, useState } from 'react';
import { Analytics } from "@vercel/analytics/react";
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import IndividualCoach from './components/IndividualCoach';
import EloCalculator from './components/EloCalculator';
import Elojob from './components/Elojob';
import Duojob from './components/Duojob';
import Plans from './components/Plans';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import CheckoutModal from './components/CheckoutModal';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);
  const [checkoutOrder, setCheckoutOrder] = useState(null);

  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const link = e.target.closest('a');
      if (!link || !link.href) return;
      
      const url = new URL(link.href);
      if (url.pathname === window.location.pathname && url.hash) {
        e.preventDefault();
        const id = url.hash;
        const targetElement = document.querySelector(id);
        if (targetElement) {
          const headerOffset = 0; 
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };
    document.addEventListener('click', handleSmoothScroll);
    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  const handleOpenAdmin = () => setShowAdmin(true);
  const handleCloseAdmin = () => setShowAdmin(false);

  return (
    <div
      id="top"
      className="min-h-screen bg-black font-sans text-gray-300 antialiased selection:bg-red-600 selection:text-white"
    >
      <Header onOpenAdmin={handleOpenAdmin} />
      
      {showAdmin && (
        <AdminPanel 
          onClose={handleCloseAdmin} 
          onPricesUpdate={() => setUpdateKey(k => k + 1)} 
        />
      )}

      <CheckoutModal
        isOpen={!!checkoutOrder}
        onClose={() => setCheckoutOrder(null)}
        orderPayload={checkoutOrder}
      />

      <Hero />
      <main>
        <HowItWorks />
        <EloCalculator forceUpdateKey={updateKey} onOpenCheckout={setCheckoutOrder} />
        <Elojob forceUpdateKey={updateKey} onOpenCheckout={setCheckoutOrder} />
        <Duojob forceUpdateKey={updateKey} onOpenCheckout={setCheckoutOrder} />
        <IndividualCoach forceUpdateKey={updateKey} onOpenCheckout={setCheckoutOrder} />
        <Plans />
      </main>
      <Footer onOpenAdmin={handleOpenAdmin} />
      <Analytics />
    </div>
  );
}