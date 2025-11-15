
import React from 'react';
import { LogoIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/60 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <LogoIcon className="h-8 w-auto text-cyan-400" />
            <span className="ml-3 text-2xl font-bold text-slate-100">JobCraft AI</span>
          </div>
          <p className="hidden md:block text-slate-400 text-sm">Your Personal Career Engineering Co-Pilot</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
