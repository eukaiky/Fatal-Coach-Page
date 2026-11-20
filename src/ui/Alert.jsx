import React from 'react';
import { AlertTriangleIcon } from './Icons';

export const Alert = ({ title, message }) => (
  <div
    className="group relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-950/50 p-6 flex items-start gap-4"
    role="alert"
  >
    <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-red-600/10 blur-xl transition-all duration-500 group-hover:bg-red-600/20"></div>
    <AlertTriangleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
    <div className="relative z-10">
      <h4 className="font-bold text-white">{title}</h4>
      <p className="text-sm text-gray-300">{message}</p>
    </div>
  </div>
);

export default Alert;