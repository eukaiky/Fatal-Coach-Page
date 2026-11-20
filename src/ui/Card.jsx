import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div
    className={`group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 backdrop-blur-sm p-6 md:p-8 shadow-2xl shadow-black/30 transition-all duration-300 hover:border-red-500/60 hover:shadow-red-900/30 hover:shadow-lg hover:scale-[1.01] ${className}`}
  >
    <div className="absolute -top-1/2 -left-1/2 z-0 h-full w-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,rgba(220,38,38,0)_70%)] opacity-0 transition-all duration-700 group-hover:-left-1/4 group-hover:-top-1/4 group-hover:opacity-100"></div>

    <div className="relative z-10">{children}</div>
  </div>
);

export default Card;