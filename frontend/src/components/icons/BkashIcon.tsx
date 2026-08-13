import React from 'react';

export const BkashIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#E2136E" />
    <path d="M6 8L12 18L18 8H14L12 12L10 8H6Z" fill="white" />
  </svg>
);