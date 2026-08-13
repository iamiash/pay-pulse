import React from 'react';

export const CardIcons: React.FC<{ type: string; className?: string }> = ({ type, className = "w-7 h-7" }) => {
  switch (type.toLowerCase()) {
    case 'visa':
      return <span className={`text-blue-400 font-extrabold italic text-sm ${className}`}>VISA</span>;
    case 'mastercard':
      return <span className={`text-amber-500 font-extrabold text-sm ${className}`}>MC</span>;
    case 'amex':
      return <span className={`text-cyan-400 font-bold text-xs ${className}`}>AMEX</span>;
    default:
      return <span className={`text-indigo-400 font-bold text-xs ${className}`}>NEXUS</span>;
  }
};