import React from 'react';
import { Landmark } from 'lucide-react';

export const BankIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-indigo-400" }) => (
  <Landmark className={className} />
);