import React from 'react';

export const FaqItem = ({ question, answer }) => (
  <details className="group border-b border-white/5 bg-transparent transition-all duration-500 open:border-red-500/50 open:bg-white/[0.02]">
    <summary className="flex w-full cursor-pointer list-none items-center justify-between py-6 pr-4 text-left outline-none">
      <span className="text-lg font-medium text-gray-300 transition-colors group-hover:text-white group-open:text-red-500">
        {question}
      </span>
      <div className="relative flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/10 transition-all duration-300 group-hover:border-red-500/50 group-open:border-red-500 group-open:bg-red-500/10">
        <span className="absolute h-4 w-0.5 bg-gray-400 transition-transform duration-300 group-open:rotate-90 group-open:bg-red-500"></span>
        <span className="absolute h-0.5 w-4 bg-gray-400 transition-transform duration-300 group-open:bg-red-500"></span>
      </div>
    </summary>
    <div className="pb-6 pr-12 text-base leading-relaxed text-gray-400">
      <p>{answer}</p>
    </div>
  </details>
);

export default FaqItem;