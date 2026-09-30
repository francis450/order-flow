import React, { useState } from 'react';
import { Customer, WhatsAppOrder, MpesaTransaction } from '../types';
import { MPESA_RECONCILIATION_FEED } from '../data/mockData';
import { ShieldAlert, CheckCircle2, Smartphone, Send, ArrowUpRight } from 'lucide-react';

interface CreditGatekeeperViewProps {
  customers: Customer[];
  orders: WhatsAppOrder[];
  onOpenCreditModalForOrder: (order: WhatsAppOrder) => void;
  onSimulateMpesaPayment: (orderId: string, amount: number) => void;
}

export const CreditGatekeeperView: React.FC<CreditGatekeeperViewProps> = ({
  customers,
  orders,
  onOpenCreditModalForOrder,
  onSimulateMpesaPayment
}) => {
  const [filter, setFilter] = useState<'all' | 'blocked' | 'warn' | 'clear'>('all');
  const [mpesaFeed, setMpesaFeed] = useState<MpesaTransaction[]>(MPESA_RECONCILIATION_FEED);
  const [notificationSentMap, setNotificationSentMap] = useState<Record<string, boolean>>({});

  const totalOutstanding = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalLimit = customers.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalOverdue = customers.reduce((sum, c) => sum + c.aging.overdue30 + c.aging.overdue60 + c.aging.overdue90, 0);
  const blockedCount = customers.filter((c) => c.creditStatus === 'BLOCKED').length;

  const filteredCustomers = customers.filter((c) => {
    if (filter === 'blocked') return c.creditStatus === 'BLOCKED';
    if (filter === 'warn') return c.creditStatus === 'WARN';
    if (filter === 'clear') return c.creditStatus === 'CLEAR';
    return true;
  });

  const handleSendReminder = (customerId: string, customerName: string, phone: string, balance: number) => {
    setNotificationSentMap((prev) => ({ ...prev, [customerId]: true }));
    setTimeout(() => {
      setNotificationSentMap((prev) => ({ ...prev, [customerId]: false }));
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Total Outstanding Debtor Ledger
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            KES {totalOutstanding.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            Across {customers.length} retail accounts in Nairobi
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            Overdue Past Trade Terms
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            KES {totalOverdue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Aging &gt; 30 days requiring payment clearance
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">
            Hard Dispatch Holds
          </div>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
            {blockedCount} Retailers Blocked
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Canter trucks halted until M-Pesa receipt
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            Total Trade Credit Facility
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            KES {totalLimit.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            Facility utilization: {Math.round((totalOutstanding / totalLimit) * 100)}%
          </div>
        </div>
      </div>

      {/* Main Grid: Debtor Table on Left, Live M-Pesa Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Debtor Management Table */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Retail Customer Credit Status</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time gatekeeper checks before order release</p>
            </div>

            {/* Segmented Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  filter === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
                }`}
              >
                All ({customers.length})
              </button>
              <button
                onClick={() => setFilter('blocked')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  filter === 'blocked' ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-semibold shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
                }`}
              >
                Blocked
              </button>
              <button
                onClick={() => setFilter('warn')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  filter === 'warn' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
                }`}
              >
                Warning
              </button>
              <button
                onClick={() => setFilter('clear')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  filter === 'clear' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200'
                }`}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                  <th className="py-2.5 pr-3">Customer / Location</th>
                  <th className="py-2.5 px-3 text-right">Credit Limit</th>
                  <th className="py-2.5 px-3 text-right">Ledger Debt</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {filteredCustomers.map((cust) => {
                  const utilization = Math.round((cust.currentBalance / cust.creditLimit) * 100);
                  const isBlocked = cust.creditStatus === 'BLOCKED';
                  const isWarn = cust.creditStatus === 'WARN';

                  // Check if there is an active order for this customer
                  const relatedOrder = orders.find((o) => o.customerId === cust.id);

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pr-3 font-sans">
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">{cust.businessName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{cust.name}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-emerald-700 dark:text-emerald-400">{cust.phone}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{cust.location}</div>
                      </td>

                      <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300">
                        KES {cust.creditLimit.toLocaleString()}
                        <span className="block text-[10px] text-slate-500 font-sans">
                          {cust.paymentTermsDays} days
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className={`font-bold ${isBlocked ? 'text-red-600 dark:text-red-400' : isWarn ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-200'}`}>
                          KES {cust.currentBalance.toLocaleString()}
                        </span>
                        <div className="w-20 ml-auto bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full ${isBlocked ? 'bg-red-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, utilization)}%` }}
                          />
                        </div>
                        <span className="block text-[10px] text-slate-500 font-sans mt-0.5">
                          {utilization}% used
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold font-mono ${
                            isBlocked
                              ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800/60'
                              : isWarn
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60'
                              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60'
                          }`}
                        >
                          {cust.creditStatus}
                        </span>
                      </td>

                      <td className="py-3 pl-3 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          {relatedOrder && (
                            <button
                              onClick={() => onOpenCreditModalForOrder(relatedOrder)}
                              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded transition-colors cursor-pointer border border-slate-200 dark:border-transparent"
                            >
                              Check Order
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleSendReminder(cust.id, cust.name, cust.phone, cust.currentBalance)
                            }
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 rounded transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>
                              {notificationSentMap[cust.id] ? 'Sent ✓' : 'M-Pesa STK'}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live M-Pesa Paybill / Till Reconciliation Feed */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live M-Pesa Settlement Feed</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800/50">
                Paybill: 522522
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Real-time Safaricom IPN webhook matches incoming payments to retail ledger balances, automatically releasing dispatch holds.
            </p>

            <div className="space-y-3">
              {mpesaFeed.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 text-xs font-mono space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{tx.mpesaReceiptNo}</span>
                    <span className="text-[10px] text-slate-500">{tx.timestamp}</span>
                  </div>
                  <div className="font-sans font-semibold text-slate-900 dark:text-white">{tx.customerName}</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">{tx.phone}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      KES {tx.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-sans">Reconciliation:</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Instant Release Triggered</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Simulation Trigger */}
          <div className="mt-5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 block mb-1">
              Simulate Live Inbound M-Pesa Payment:
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] mb-2.5">
              Simulate Mama Fatuma settling KES 45,000 to clear her credit block.
            </p>
            <button
              onClick={() => {
                onSimulateMpesaPayment('ord-101', 45000);
                const newTx: MpesaTransaction = {
                  id: `mp-${Date.now()}`,
                  mpesaReceiptNo: `QBI${Math.floor(1000 + Math.random() * 8999)}TX`,
                  customerName: 'Mama Fatuma Wholesale',
                  phone: '+254 722 418 902',
                  amount: 45000,
                  timestamp: 'Just now',
                  status: 'COMPLETED',
                  matchedOrderId: 'ord-101'
                };
                setMpesaFeed([newTx, ...mpesaFeed]);
              }}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <span>Simulate KES 45,000 M-Pesa Receipt</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
