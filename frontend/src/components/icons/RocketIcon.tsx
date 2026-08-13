import React from 'react';

export const RocketIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#8C3494" />
    <path d="M12 5L15 11H9L12 5Z" fill="white" />
  </svg>
);