import React, { useState } from 'react';
import { Customer, WhatsAppOrder, CreditCheckResult } from '../types';
import { ShieldAlert, CheckCircle2, XCircle, Smartphone, Copy, Check } from 'lucide-react';

interface CreditControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: WhatsAppOrder;
  customer?: Customer;
  onApproveOverride: (orderId: string, reason: string) => void;
  onMpesaSimulatedPayment: (orderId: string, amount: number) => void;
}

export const CreditControlModal: React.FC<CreditControlModalProps> = ({
  isOpen,
  onClose,
  order,
  customer,
  onApproveOverride,
  onMpesaSimulatedPayment
}) => {
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [showOverrideInput, setShowOverrideInput] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isSendingStk, setIsSendingStk] = useState<boolean>(false);
  const [stkSentSuccess, setStkSentSuccess] = useState<boolean>(false);

  if (!isOpen || !customer) return null;

  const creditCheck: CreditCheckResult = order.creditCheckResult || {
    allowed: customer.creditLimit >= (customer.currentBalance + order.grandTotal),
    decision: customer.creditLimit < (customer.currentBalance + order.grandTotal) ? 'WARN' : 'APPROVED',
    customerBalance: customer.currentBalance,
    orderAmount: order.grandTotal,
    projectedBalance: customer.currentBalance + order.grandTotal,
    creditLimit: customer.creditLimit,
    overdueAmount: customer.aging.overdue30 + customer.aging.overdue60 + customer.aging.overdue90,
    oldestInvoiceDays: customer.aging.overdue60 > 0 ? 65 : customer.aging.overdue30 > 0 ? 38 : 12,
    recommendedAction: 'Automated credit evaluation pending',
    requiredDownpayment: Math.max(0, (customer.currentBalance + order.grandTotal) - customer.creditLimit),
    reasons: []
  };

  const utilizationPercent = Math.min(100, Math.round((creditCheck.projectedBalance / creditCheck.creditLimit) * 100));

  const handleCopyPaymentNotice = () => {
    const text = `Habari ${customer.name}, Kifaru Distributors has received order ${order.orderNumber} for KES ${order.grandTotal.toLocaleString()}.
Your current outstanding balance is KES ${customer.currentBalance.toLocaleString()} (Facility limit: KES ${customer.creditLimit.toLocaleString()}).
To ensure immediate loading on the ${order.route} canter, kindly clear KES ${creditCheck.requiredDownpayment.toLocaleString()} via M-Pesa:
Paybill: 522522
Account: KIFARU-${customer.phone.slice(-4)}
Asante kwa biashara!`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleTriggerStkPush = () => {
    setIsSendingStk(true);
    setTimeout(() => {
      setIsSendingStk(false);
      setStkSentSuccess(true);
      setTimeout(() => setStkSentSuccess(false), 4000);
    }, 1200);
  };

  const handleSimulatePaymentClearance = () => {
    const paymentAmount = creditCheck.requiredDownpayment > 0 ? creditCheck.requiredDownpayment : 45000;
    onMpesaSimulatedPayment(order.id, paymentAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 my-8 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${creditCheck.decision === 'BLOCKED' ? 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800/50' : creditCheck.decision === 'WARN' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800/50' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span>Credit Control Gatekeeper</span>
                <span aria-hidden="true">·</span>
                <span>{customer.businessName}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Dispatch Credit Check: {order.orderNumber}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${creditCheck.decision === 'BLOCKED' ? 'bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700' : creditCheck.decision === 'WARN' ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700' : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'}`}>
                  {creditCheck.decision}
                </span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Customer Ledger Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Authorized Credit Limit</span>
            <span className="text-base font-bold text-slate-900 dark:text-white font-mono">KES {creditCheck.creditLimit.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">{customer.paymentTermsDays}-day trade terms</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Current Ledger Debt</span>
            <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">KES {creditCheck.customerBalance.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Last paid: {customer.lastPaymentDate}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">New Order Value</span>
            <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono">KES {order.grandTotal.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">{order.items.length} line items</span>
          </div>
        </div>

        {/* Credit Exposure Bar */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-lg border border-slate-200 dark:border-slate-800 mb-5">
          <div className="flex justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-600 dark:text-slate-400">Projected Total Exposure (Old + New):</span>
            <span className={`font-bold ${creditCheck.projectedBalance > creditCheck.creditLimit ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
              KES {creditCheck.projectedBalance.toLocaleString()} ({utilizationPercent}% of Limit)
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 ${creditCheck.projectedBalance > creditCheck.creditLimit ? 'bg-red-500' : utilizationPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, utilizationPercent)}%` }}
            ></div>
          </div>
          {creditCheck.projectedBalance > creditCheck.creditLimit && (
            <div className="text-[11px] text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1 font-mono">
              <XCircle className="w-3.5 h-3.5" />
              <span>Breaches ceiling by KES {(creditCheck.projectedBalance - creditCheck.creditLimit).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Debt Aging Analysis */}
        <div className="mb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Invoice Aging Breakdown
          </span>
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded border border-slate-200 dark:border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">0–30 Days</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">KES {customer.aging.current.toLocaleString()}</span>
            </div>
            <div className={`p-2.5 rounded border ${customer.aging.overdue30 > 0 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50' : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80'}`}>
              <span className="text-slate-500 block text-[10px]">31–60 Days</span>
              <span className={`font-semibold ${customer.aging.overdue30 > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                KES {customer.aging.overdue30.toLocaleString()}
              </span>
            </div>
            <div className={`p-2.5 rounded border ${customer.aging.overdue60 > 0 ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50' : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80'}`}>
              <span className="text-slate-500 block text-[10px]">61–90 Days</span>
              <span className={`font-semibold ${customer.aging.overdue60 > 0 ? 'text-red-700 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                KES {customer.aging.overdue60.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded border border-slate-200 dark:border-slate-800/80">
              <span className="text-slate-500 block text-[10px]">90+ Days</span>
              <span className="font-semibold text-slate-600 dark:text-slate-400">KES {customer.aging.overdue90.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Recommended Action / Rule Reason */}
        <div className={`p-3.5 rounded-lg border text-xs mb-5 ${creditCheck.decision === 'BLOCKED' ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200' : creditCheck.decision === 'WARN' ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-200' : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200'}`}>
          <div className="font-semibold flex items-center gap-1.5 mb-1">
            {creditCheck.decision === 'APPROVED' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            <span>Credit Committee Recommendation:</span>
          </div>
          <p className="leading-relaxed">{creditCheck.recommendedAction}</p>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleTriggerStkPush}
              disabled={isSendingStk}
              className="w-full sm:w-auto flex-1 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isSendingStk ? 'Sending M-Pesa STK...' : stkSentSuccess ? '✓ STK Prompt Sent to Phone' : `Trigger M-Pesa STK Push (KES ${creditCheck.requiredDownpayment > 0 ? creditCheck.requiredDownpayment.toLocaleString() : order.grandTotal.toLocaleString()})`}</span>
            </button>

            <button
              onClick={handleCopyPaymentNotice}
              className="w-full sm:w-auto px-3.5 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied to Clipboard' : 'Copy WhatsApp Notice'}</span>
            </button>
          </div>

          {/* Quick Simulation of M-Pesa Real-Time Settlement */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">Simulate M-Pesa Paybill Deposit</span>
              <span className="text-slate-500 text-[11px]">Instant clearance matches Safaricom Paybill: 522522</span>
            </div>
            <button
              onClick={handleSimulatePaymentClearance}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded transition-colors cursor-pointer"
            >
              Simulate KES {(creditCheck.requiredDownpayment > 0 ? creditCheck.requiredDownpayment : 45000).toLocaleString()} Payment
            </button>
          </div>

          {/* Manager Override Section */}
          <div className="pt-2">
            {!showOverrideInput ? (
              <button
                onClick={() => setShowOverrideInput(true)}
                className="text-[11px] text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors underline cursor-pointer"
              >
                Need to dispatch urgently? Sales Director emergency credit override
              </button>
            ) : (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs space-y-2">
                <span className="font-semibold text-amber-800 dark:text-amber-300 block">Sales Director Override Authorization</span>
                <input
                  type="text"
                  placeholder="Enter audit reason (e.g. Cheque received, customer paying on canter arrival)"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowOverrideInput(false)}
                    className="px-2.5 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!overrideReason.trim()) {
                        alert('Please enter an override reason for credit audit logs.');
                        return;
                      }
                      onApproveOverride(order.id, overrideReason);
                      onClose();
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded cursor-pointer"
                  >
                    Authorize Dispatch Override
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
