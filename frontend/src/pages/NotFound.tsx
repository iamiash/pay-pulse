import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-darkbg text-center">
    <h1 className="text-6xl font-extrabold text-indigo-500 mb-2">404</h1>
    <p className="text-lg text-gray-300 mb-6">Page Not Found</p>
    <Link to="/dashboard" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm">
      Return to Dashboard
    </Link>
  </div>
);