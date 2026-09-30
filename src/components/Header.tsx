import React from 'react';
import { CatalogType } from '../types';
import { MessageSquare, Calculator, ShieldAlert, Truck, Users, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: 'queue' | 'credit' | 'erp' | 'debtors' | 'roi';
  setActiveTab: (tab: 'queue' | 'credit' | 'erp' | 'debtors' | 'roi') => void;
  catalogType: CatalogType;
  setCatalogType: (type: CatalogType) => void;
  pendingOrderCount: number;
  creditHoldCount: number;
  onOpenQuickTest: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  catalogType,
  setCatalogType,
  pendingOrderCount,
  creditHoldCount,
  onOpenQuickTest,
  theme,
  toggleTheme
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); setActiveTab('queue'); }}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 hover:opacity-95 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span>OrderFlow</span>
            <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800/50 px-1.5 py-0.5 rounded">Kenya</span>
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setActiveTab('queue')}
            className={`transition-colors flex items-center gap-1.5 py-1 ${activeTab === 'queue' ? 'text-slate-900 dark:text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Order Queue</span>
            {pendingOrderCount > 0 && (
              <span className="text-[11px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
                {pendingOrderCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('credit')}
            className={`transition-colors flex items-center gap-1.5 py-1 ${activeTab === 'credit' ? 'text-slate-900 dark:text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Credit Gatekeeper</span>
            {creditHoldCount > 0 && (
              <span className="text-[11px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
                {creditHoldCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('erp')}
            className={`transition-colors flex items-center gap-1.5 py-1 ${activeTab === 'erp' ? 'text-slate-900 dark:text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Truck className="w-4 h-4" />
            <span>ERP & Dispatch</span>
          </button>

          <button
            onClick={() => setActiveTab('debtors')}
            className={`transition-colors flex items-center gap-1.5 py-1 ${activeTab === 'debtors' ? 'text-slate-900 dark:text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Ledgers</span>
          </button>

          <button
            onClick={() => setActiveTab('roi')}
            className={`transition-colors flex items-center gap-1.5 py-1 ${activeTab === 'roi' ? 'text-slate-900 dark:text-white border-b-2 border-emerald-500 font-semibold' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-700 dark:text-emerald-300 font-medium">ROI Calculator</span>
          </button>
        </nav>

        {/* Zone 3: Actions + Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle dark/light theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Segmented Catalog Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => setCatalogType('fmcg')}
              className={`px-2.5 py-1 rounded transition-colors ${catalogType === 'fmcg' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              FMCG
            </button>
            <button
              onClick={() => setCatalogType('pharma')}
              className={`px-2.5 py-1 rounded transition-colors ${catalogType === 'pharma' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              Pharma
            </button>
          </div>

          <button
            onClick={onOpenQuickTest}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-lg flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 whitespace-nowrap active:scale-98"
          >
            <span>+ Test WhatsApp Order</span>
          </button>
        </div>
      </div>
    </header>
  );
};

