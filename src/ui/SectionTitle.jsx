import React from 'react';

export const SectionTitle = ({ title, subtitle }) => (
  <div className="max-w-3xl">
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
      {title}
    </h2>
    <div className="mt-3 h-1.5 w-20 rounded-full bg-red-600" />
    <p className="mt-8 text-lg leading-relaxed text-gray-400">{subtitle}</p>
  </div>
);

export default SectionTitle;