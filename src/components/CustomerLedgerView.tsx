import React, { useState } from 'react';
import { Customer } from '../types';
import { Users, DollarSign, Calendar, MessageSquare, Copy, Check, Edit2, CheckCircle2 } from 'lucide-react';

interface CustomerLedgerViewProps {
  customers: Customer[];
  onUpdateCreditLimit: (customerId: string, newLimit: number) => void;
}

export const CustomerLedgerView: React.FC<CustomerLedgerViewProps> = ({
  customers,
  onUpdateCreditLimit
}) => {
  const [editingLimitId, setEditingLimitId] = useState<string | null>(null);
  const [newLimitInput, setNewLimitInput] = useState<string>('');
  const [activeReminderCustomer, setActiveReminderCustomer] = useState<Customer | null>(null);
  const [copiedReminder, setCopiedReminder] = useState<boolean>(false);

  const totalDebt = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalCredit = customers.reduce((sum, c) => sum + c.creditLimit, 0);

  const handleOpenReminder = (customer: Customer) => {
    setActiveReminderCustomer(customer);
    setCopiedReminder(false);
  };

  const handleCopyReminderText = () => {
    if (!activeReminderCustomer) return;
    const text = `Habari ${activeReminderCustomer.name}, Kifaru Distributors account statement:
Current outstanding ledger: KES ${activeReminderCustomer.currentBalance.toLocaleString()}
Agreed credit terms: ${activeReminderCustomer.paymentTermsDays} days.
Kindly make settlement via M-Pesa to prevent dispatch interruptions:
Paybill: 522522
Account: KIFARU-${activeReminderCustomer.phone.slice(-4)}
Thank you for your valued partnership.`;

    navigator.clipboard.writeText(text);
    setCopiedReminder(true);
    setTimeout(() => setCopiedReminder(false), 2500);
  };

  const handleSaveLimit = (customerId: string) => {
    const val = parseInt(newLimitInput, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdateCreditLimit(customerId, val);
    }
    setEditingLimitId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <Users className="w-4 h-4" />
            <span>Retail Accounts & Debtor Control</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Nairobi Trade Credit Ledgers & Aging Buckets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control credit risk, track overdue days, and automate WhatsApp payment reminders to shorten DSO.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block text-[10px]">Total Debtor Exposure</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">KES {totalDebt.toLocaleString()}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 block text-[10px]">Total Facility Ceiling</span>
            <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">KES {totalCredit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Debtor Ledgers Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg overflow-x-auto transition-colors">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium font-sans">
              <th className="py-2.5 pr-3">Customer Business & Contact</th>
              <th className="py-2.5 px-3 text-right">Credit Limit</th>
              <th className="py-2.5 px-3 text-right">Current Balance</th>
              <th className="py-2.5 px-3 text-center">0–30d</th>
              <th className="py-2.5 px-3 text-center">31–60d</th>
              <th className="py-2.5 px-3 text-center">61–90d</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
            {customers.map((cust) => {
              const isEditing = editingLimitId === cust.id;
              const isBlocked = cust.creditStatus === 'BLOCKED';
              const isWarn = cust.creditStatus === 'WARN';

              return (
                <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pr-3 font-sans">
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{cust.businessName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{cust.name}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-mono">{cust.phone}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{cust.route}</div>
                  </td>

                  <td className="py-3 px-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          value={newLimitInput}
                          onChange={(e) => setNewLimitInput(e.target.value)}
                          className="w-24 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-xs text-slate-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleSaveLimit(cust.id)}
                          className="p-1 bg-emerald-600 rounded text-white hover:bg-emerald-500 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-slate-800 dark:text-slate-200">KES {cust.creditLimit.toLocaleString()}</span>
                        <button
                          onClick={() => {
                            setEditingLimitId(cust.id);
                            setNewLimitInput(cust.creditLimit.toString());
                          }}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <span className="text-[10px] text-slate-500 block font-sans">
                      {cust.paymentTermsDays} days terms
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-bold ${
                        isBlocked ? 'text-red-600 dark:text-red-400' : isWarn ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      KES {cust.currentBalance.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-sans">
                      Last: {cust.lastPaymentDate}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      {cust.aging.current > 0 ? `KES ${(cust.aging.current / 1000).toFixed(0)}k` : '—'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-medium ${
                        cust.aging.overdue30 > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {cust.aging.overdue30 > 0 ? `KES ${(cust.aging.overdue30 / 1000).toFixed(0)}k` : '—'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-medium ${
                        cust.aging.overdue60 > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {cust.aging.overdue60 > 0 ? `KES ${(cust.aging.overdue60 / 1000).toFixed(0)}k` : '—'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isBlocked
                          ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
                          : isWarn
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      }`}
                    >
                      {cust.creditStatus}
                    </span>
                  </td>

                  <td className="py-3 pl-3 text-right font-sans">
                    <button
                      onClick={() => handleOpenReminder(cust)}
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 rounded transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp Notice</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* WhatsApp Payment Reminder Generator Modal */}
      {activeReminderCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 max-w-lg w-full text-slate-900 dark:text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                  WHATSAPP PAYMENT REMINDER
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeReminderCustomer.businessName}
                </h3>
              </div>
              <button
                onClick={() => setActiveReminderCustomer(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {`Habari ${activeReminderCustomer.name}, Kifaru Distributors account statement:
Current outstanding ledger: KES ${activeReminderCustomer.currentBalance.toLocaleString()}
Agreed credit terms: ${activeReminderCustomer.paymentTermsDays} days.

Kindly make settlement via M-Pesa to prevent dispatch interruptions:
Paybill: 522522
Account: KIFARU-${activeReminderCustomer.phone.slice(-4)}

Thank you for your valued partnership.`}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveReminderCustomer(null)}
                className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCopyReminderText}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedReminder ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedReminder ? 'Copied to Clipboard' : 'Copy Message for WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
