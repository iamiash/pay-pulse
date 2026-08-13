import React from 'react';

export const NagadIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#F7921E" />
    <circle cx="12" cy="12" r="5" fill="white" />
  </svg>
);