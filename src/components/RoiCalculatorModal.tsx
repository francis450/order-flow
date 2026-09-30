import React, { useState } from 'react';
import { DollarSign, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

interface RoiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({ isOpen, onClose }) => {
  // Inputs
  const [adminStaffCount, setAdminStaffCount] = useState<number>(2);
  const [monthlySalaryKes, setMonthlySalaryKes] = useState<number>(65000);
  const [weeklyTypingHours, setWeeklyTypingHours] = useState<number>(45);
  const [monthlyTurnoverKes, setMonthlyTurnoverKes] = useState<number>(18000000); // KES 18M
  const [errorRatePercent, setErrorRatePercent] = useState<number>(3.5);
  const [currentDsoDays, setCurrentDsoDays] = useState<number>(24);

  if (!isOpen) return null;

  // Computations
  const statutoryMultiplier = 1.15; // 15% NSSF, SHIF, Housing Levy, desk overhead
  const totalMonthlyPayrollCost = Math.round(adminStaffCount * monthlySalaryKes * statutoryMultiplier);
  const annualPayrollSaved = totalMonthlyPayrollCost * 12;

  // Order errors cost (wrong SKU dispatched, returned canter fuel, disputes): ~35% of disputed orders write-off/delay
  const monthlyDisputeLoss = Math.round(monthlyTurnoverKes * (errorRatePercent / 100) * 0.25);

  // DSO Cash Flow Liquidity improvement: 14 days faster cash collection
  const targetedDsoDays = 8;
  const dsoReductionDays = Math.max(0, currentDsoDays - targetedDsoDays);
  const dailyTurnover = monthlyTurnoverKes / 30;
  const liquidityUnlockedKes = Math.round(dsoReductionDays * dailyTurnover);

  const estimatedOrderFlowCostKes = 35000; // Estimated SaaS subscription KES 35,000/mo
  const netMonthlyCashBenefit = (totalMonthlyPayrollCost + monthlyDisputeLoss) - estimatedOrderFlowCostKes;
  const paybackPeriodDays = Math.max(1, Math.round((estimatedOrderFlowCostKes / ((totalMonthlyPayrollCost + monthlyDisputeLoss) / 30))));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 lg:p-8 my-8 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <span>The "Cash Flow Wedge" Economic Model</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 dark:text-slate-400">Industrial Area Nairobi Distributors</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Admin Replacement & Cash Flow ROI Calculator
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              "How many people do you have just copying WhatsApp messages into your ERP? What is it worth to eliminate that role?"
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-6 space-y-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <span>1. Your Current Operational Overhead</span>
            </h3>

            {/* Admin Staff Count */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800/80">
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-700 dark:text-slate-300 font-medium">Order-Entry Admin Staff</label>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{adminStaffCount} Person{adminStaffCount > 1 ? 's' : ''}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={adminStaffCount}
                onChange={(e) => setAdminStaffCount(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>1 clerk</span>
                <span>3 clerks</span>
                <span>5 clerks</span>
              </div>
            </div>

            {/* Monthly Salary per Clerk */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800/80">
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-700 dark:text-slate-300 font-medium">Clerk Monthly Gross Salary</label>
                <span className="font-mono font-bold text-slate-900 dark:text-white">KES {monthlySalaryKes.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="40000"
                max="100000"
                step="5000"
                value={monthlySalaryKes}
                onChange={(e) => setMonthlySalaryKes(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>KES 40,000</span>
                <span>KES 70,000</span>
                <span>KES 100,000</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                * Includes 15% statutory burden (NSSF, SHIF, Housing Levy, workspace).
              </p>
            </div>

            {/* Weekly Typing Hours */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800/80">
              <div className="flex justify-between text-sm mb-2">
                <label className="text-slate-700 dark:text-slate-300 font-medium">Hours/Week Copying WhatsApp</label>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{weeklyTypingHours} Hours / wk</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                step="5"
                value={weeklyTypingHours}
                onChange={(e) => setWeeklyTypingHours(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Typical Nairobi distributor spends 40–60 hours/wk re-typing duka messages into Excel or SAP.
              </p>
            </div>

            {/* Monthly Turnover & Error Rate */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80">
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Monthly Turnover (KES)</label>
                <select
                  value={monthlyTurnoverKes}
                  onChange={(e) => setMonthlyTurnoverKes(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded p-1.5 text-xs font-mono"
                >
                  <option value={8000000}>KES 8,000,000</option>
                  <option value={18000000}>KES 18,000,000</option>
                  <option value={35000000}>KES 35,000,000</option>
                  <option value={60000000}>KES 60,000,000</option>
                </select>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80">
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Current DSO (Credit Days)</label>
                <select
                  value={currentDsoDays}
                  onChange={(e) => setCurrentDsoDays(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded p-1.5 text-xs font-mono"
                >
                  <option value={18}>18 Days (Strict)</option>
                  <option value={24}>24 Days (Standard)</option>
                  <option value={35}>35 Days (Delayed)</option>
                  <option value={45}>45+ Days (Critical)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Financial Proof & Impact */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-5 bg-slate-50 dark:bg-slate-950/70 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">
                <TrendingUp className="w-4 h-4" />
                <span>2. Quantified Financial Returns</span>
              </div>

              {/* Big Highlight: Net Monthly Savings */}
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 mb-5">
                <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium block">Net Monthly Cash Flow Advantage</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                  KES {netMonthlyCashBenefit.toLocaleString()}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/ month</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 mt-2 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Payback Period: Only {paybackPeriodDays} days on software cost</span>
                </div>
              </div>

              {/* Line item breakdowns */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800/80">
                  <div className="text-slate-700 dark:text-slate-300">
                    <span className="font-medium text-slate-900 dark:text-white block">Direct Admin Payroll Replaced</span>
                    <span className="text-slate-500 text-[11px]">{adminStaffCount} clerks × KES {monthlySalaryKes.toLocaleString()} + statutories</span>
                  </div>
                  <div className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 text-sm">
                    +KES {totalMonthlyPayrollCost.toLocaleString()} / mo
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800/80">
                  <div className="text-slate-700 dark:text-slate-300">
                    <span className="font-medium text-slate-900 dark:text-white block">Typing Errors & Dispute Write-offs Prevented</span>
                    <span className="text-slate-500 text-[11px]">Mistyped cartons, wrong packs, return transport</span>
                  </div>
                  <div className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 text-sm">
                    +KES {monthlyDisputeLoss.toLocaleString()} / mo
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800/80">
                  <div className="text-slate-700 dark:text-slate-300">
                    <span className="font-medium text-slate-900 dark:text-white block">Accelerated Working Capital (DSO Drop)</span>
                    <span className="text-slate-500 text-[11px]">Order-to-cash cycle reduced from {currentDsoDays} to {targetedDsoDays} days</span>
                  </div>
                  <div className="font-mono font-semibold text-slate-900 dark:text-white text-sm">
                    KES {liquidityUnlockedKes.toLocaleString()} unlocked
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-500 dark:text-slate-400">
                    <span>OrderFlow Enterprise Subscription</span>
                  </div>
                  <div className="font-mono text-slate-500 dark:text-slate-400">
                    -KES {estimatedOrderFlowCostKes.toLocaleString()} / mo
                  </div>
                </div>
              </div>
            </div>

            {/* Validation pitch box */}
            <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>The Validation Signal for Sales Directors:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 italic">
                "We eliminate 100% of order-entry keystrokes. Within 3 minutes of an order landing on WhatsApp, it is credit-checked, pushed to ERP, and placed in the warehouse loading bay."
              </p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <span>Annualized Direct Savings:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">KES {((totalMonthlyPayrollCost + monthlyDisputeLoss) * 12).toLocaleString()} / year</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Engineered for Industrial Area FMCG & Pharmaceutical wholesale distributors in Nairobi, Kenya.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Executive Business Case Ready:\n- Direct Payroll Saved: KES ${totalMonthlyPayrollCost.toLocaleString()}/mo\n- Liquidity Unlocked: KES ${liquidityUnlockedKes.toLocaleString()}\n- Payback Period: ${paybackPeriodDays} days\n\nReady to pitch to Sales Director.`);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Download Sales Director Brief</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
