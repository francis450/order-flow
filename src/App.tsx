import React, { useState, useEffect } from 'react';
import { CatalogType, Customer, WhatsAppOrder, ErpSyncDetails } from './types';
import { INITIAL_ORDERS, CUSTOMERS } from './data/mockData';
import { Header } from './components/Header';
import { WhatsAppFeed } from './components/WhatsAppFeed';
import { OrderParserPanel } from './components/OrderParserPanel';
import { CreditControlModal } from './components/CreditControlModal';
import { CreditGatekeeperView } from './components/CreditGatekeeperView';
import { ErpQueue } from './components/ErpQueue';
import { CustomerLedgerView } from './components/CustomerLedgerView';
import { RoiCalculatorModal } from './components/RoiCalculatorModal';
import { QuickTestModal } from './components/QuickTestModal';
import { parseWhatsAppOrderApi, evaluateCreditApi, pushToErpApi } from './services/orderService';
import { ShieldAlert, CheckCircle2, TrendingUp, Sparkles, Building2, Truck, Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'queue' | 'credit' | 'erp' | 'debtors' | 'roi'>('queue');
  const [catalogType, setCatalogType] = useState<CatalogType>('fmcg');
  const [orders, setOrders] = useState<WhatsAppOrder[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [activeOrder, setActiveOrder] = useState<WhatsAppOrder>(INITIAL_ORDERS[0]);
  const [isRoiModalOpen, setIsRoiModalOpen] = useState<boolean>(false);
  const [isQuickTestOpen, setIsQuickTestOpen] = useState<boolean>(false);
  const [activeCreditModalOrder, setActiveCreditModalOrder] = useState<WhatsAppOrder | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme Management (Light and Dark Modes)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('orderflow_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('orderflow_theme', theme);
    } catch (e) {
      // Ignore localStorage quotas or restrictions
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const pendingOrders = orders.filter((o) => o.status === 'PARSED');
  const creditHolds = orders.filter((o) => o.creditCheckResult?.decision === 'BLOCKED');

  const activeCustomer = customers.find((c) => c.id === activeOrder.customerId);

  // Parsing a new WhatsApp order via Gemini / local hybrid engine
  const handleParseNewOrder = async (
    rawMessage: string,
    customerId: string,
    catType: CatalogType,
    messageType: 'text' | 'voice_note' | 'chit_image'
  ) => {
    setIsParsing(true);
    const targetCustomer = customers.find((c) => c.id === customerId) || customers[0];

    try {
      const parsedData = await parseWhatsAppOrderApi(
        rawMessage,
        catType,
        targetCustomer.name,
        targetCustomer.location
      );

      const creditCheck = await evaluateCreditApi(targetCustomer, parsedData.grandTotal);

      const newOrder: WhatsAppOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: targetCustomer.id,
        customerName: targetCustomer.name,
        customerPhone: targetCustomer.phone,
        customerLocation: targetCustomer.location,
        route: targetCustomer.route,
        rawMessage,
        messageType,
        receivedAt: 'Just now',
        status: creditCheck.decision === 'BLOCKED' ? 'CREDIT_HOLD' : 'PARSED',
        catalogType: catType,
        items: parsedData.items,
        subtotal: parsedData.subtotal,
        vatTotal: parsedData.vatTotal,
        grandTotal: parsedData.grandTotal,
        deliveryDatePreference: parsedData.deliveryDatePreference,
        deliveryNotes: parsedData.deliveryNotes,
        creditCheckResult: creditCheck
      };

      setOrders((prev) => [newOrder, ...prev]);
      setActiveOrder(newOrder);
      showToast(`Order ${newOrder.orderNumber} successfully parsed for ${targetCustomer.businessName}!`);
    } catch (err: any) {
      console.error('Failed to parse order:', err);
      showToast('Error parsing order. Please retry.');
    } finally {
      setIsParsing(false);
    }
  };

  // Push to ERP
  const handlePushToErp = async (orderId: string, erpType: ErpSyncDetails['erpType']) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    try {
      const syncResult = await pushToErpApi(targetOrder, erpType);

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status: 'PUSHED_TO_ERP',
              erpSyncDetails: syncResult
            };
          }
          return o;
        })
      );

      if (activeOrder.id === orderId) {
        setActiveOrder((prev) => ({
          ...prev,
          status: 'PUSHED_TO_ERP',
          erpSyncDetails: syncResult
        }));
      }

      showToast(`Order ${targetOrder.orderNumber} pushed to ${erpType.replace('_', ' ')} (${syncResult.erpReferenceNumber})!`);
    } catch (err) {
      showToast('ERP push simulation completed.');
    }
  };

  // Credit Override by Sales Director
  const handleApproveOverride = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'APPROVED',
            creditCheckResult: o.creditCheckResult
              ? {
                  ...o.creditCheckResult,
                  allowed: true,
                  decision: 'APPROVED',
                  recommendedAction: `Sales Director Override: "${reason}". Released for dispatch.`
                }
              : undefined
          };
        }
        return o;
      })
    );

    if (activeOrder.id === orderId) {
      setActiveOrder((prev) => ({
        ...prev,
        status: 'APPROVED',
        creditCheckResult: prev.creditCheckResult
          ? {
              ...prev.creditCheckResult,
              allowed: true,
              decision: 'APPROVED',
              recommendedAction: `Sales Director Override: "${reason}". Released for dispatch.`
            }
          : undefined
      }));
    }

    showToast(`Order ${orderId} dispatch approved under Sales Director override.`);
  };

  // M-Pesa Simulated Instant Payment
  const handleMpesaSimulatedPayment = (orderId: string, amount: number) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Reduce customer's balance
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === targetOrder.customerId) {
          const newBal = Math.max(0, c.currentBalance - amount);
          return {
            ...c,
            currentBalance: newBal,
            lastPaymentDate: 'Today (M-Pesa)',
            lastPaymentAmount: amount,
            creditStatus: newBal <= c.creditLimit ? 'CLEAR' : 'WARN'
          };
        }
        return c;
      })
    );

    // Update order status
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'APPROVED',
            creditCheckResult: o.creditCheckResult
              ? {
                  ...o.creditCheckResult,
                  allowed: true,
                  decision: 'APPROVED',
                  customerBalance: Math.max(0, o.creditCheckResult.customerBalance - amount),
                  projectedBalance: Math.max(0, o.creditCheckResult.customerBalance - amount) + o.grandTotal,
                  recommendedAction: `M-Pesa receipt verified for KES ${amount.toLocaleString()}. Dispatch hold cleared.`
                }
              : undefined
          };
        }
        return o;
      })
    );

    if (activeOrder.id === orderId) {
      setActiveOrder((prev) => ({
        ...prev,
        status: 'APPROVED',
        creditCheckResult: prev.creditCheckResult
          ? {
              ...prev.creditCheckResult,
              allowed: true,
              decision: 'APPROVED',
              customerBalance: Math.max(0, prev.creditCheckResult.customerBalance - amount),
              projectedBalance: Math.max(0, prev.creditCheckResult.customerBalance - amount) + prev.grandTotal,
              recommendedAction: `M-Pesa receipt verified for KES ${amount.toLocaleString()}. Dispatch hold cleared.`
            }
          : undefined
      }));
    }

    showToast(`M-Pesa payment of KES ${amount.toLocaleString()} received! Dispatch lock released.`);
  };

  // Update credit limit
  const handleUpdateCreditLimit = (customerId: string, newLimit: number) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, creditLimit: newLimit } : c))
    );
    showToast(`Credit limit updated to KES ${newLimit.toLocaleString()}`);
  };

  // Update line items edited manually
  const handleUpdateOrderItems = (orderId: string, updatedItems: WhatsAppOrder['items']) => {
    const subtotal = updatedItems.reduce((acc, i) => acc + i.lineTotal, 0);
    const vatTotal = catalogType === 'fmcg' ? Math.round(subtotal * 0.05) : 0;
    const grandTotal = subtotal;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            items: updatedItems,
            subtotal,
            vatTotal,
            grandTotal
          };
        }
        return o;
      })
    );

    if (activeOrder.id === orderId) {
      setActiveOrder((prev) => ({
        ...prev,
        items: updatedItems,
        subtotal,
        vatTotal,
        grandTotal
      }));
    }

    showToast('Order items and total recalculations saved.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-lg font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Bell className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'roi') {
            setIsRoiModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        catalogType={catalogType}
        setCatalogType={setCatalogType}
        pendingOrderCount={pendingOrders.length}
        creditHoldCount={creditHolds.length}
        onOpenQuickTest={() => setIsQuickTestOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Executive Authority Sub-Header Banner */}
      <div className="bg-slate-100/90 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 px-4 lg:px-8 py-2 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-slate-900 dark:text-white font-medium">Enterprise Road Depot · Industrial Area, Nairobi</span>
            <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
            <span className="hidden sm:inline">Wholesale FMCG & Pharmaceutical Distribution</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
              <span className="text-slate-700 dark:text-slate-300">0 Keystrokes Entry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
              <span className="text-slate-700 dark:text-slate-300">Auto M-Pesa Gatekeeper</span>
            </div>
            <button
              onClick={() => setIsRoiModalOpen(true)}
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-bold underline flex items-center gap-1 cursor-pointer"
            >
              <TrendingUp className="w-3 h-3" />
              <span>Saves KES 149k/mo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 space-y-6">
        {/* Tab 1: Live Order Queue (WhatsApp Split Interface) */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            {/* Top Row: WhatsApp Incoming Simulator */}
            <WhatsAppFeed
              orders={orders}
              activeOrder={activeOrder}
              onSelectOrder={setActiveOrder}
              customers={customers}
              onAddNewCustomMessage={handleParseNewOrder}
              isParsingAi={isParsing}
              catalogType={catalogType}
            />

            {/* Bottom Row: Real-Time Order Parser & SKU Mapping Panel */}
            <OrderParserPanel
              order={activeOrder}
              customer={activeCustomer}
              onOpenCreditModal={() => setActiveCreditModalOrder(activeOrder)}
              onPushToErp={handlePushToErp}
              onUpdateOrderItems={handleUpdateOrderItems}
            />
          </div>
        )}

        {/* Tab 2: Credit Gatekeeper & Live M-Pesa Reconciliation */}
        {activeTab === 'credit' && (
          <CreditGatekeeperView
            customers={customers}
            orders={orders}
            onOpenCreditModalForOrder={(order) => setActiveCreditModalOrder(order)}
            onSimulateMpesaPayment={handleMpesaSimulatedPayment}
          />
        )}

        {/* Tab 3: ERP & Dispatch Loading Bays */}
        {activeTab === 'erp' && (
          <ErpQueue
            orders={orders}
            customers={customers}
            onSelectOrder={(order) => {
              setActiveOrder(order);
              setActiveTab('queue');
            }}
          />
        )}

        {/* Tab 4: Customer Debtor Ledgers */}
        {activeTab === 'debtors' && (
          <CustomerLedgerView
            customers={customers}
            onUpdateCreditLimit={handleUpdateCreditLimit}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-4 px-4 text-center text-xs text-slate-500 dark:text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>OrderFlow Kenya · Enterprise WhatsApp Order Automation & Credit Control</span>
          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-600">
            Targeting FMCG & Pharma Distributors · Industrial Area, Nairobi
          </span>
        </div>
      </footer>

      {/* Credit Control Modal */}
      {activeCreditModalOrder && (
        <CreditControlModal
          isOpen={!!activeCreditModalOrder}
          onClose={() => setActiveCreditModalOrder(null)}
          order={activeCreditModalOrder}
          customer={customers.find((c) => c.id === activeCreditModalOrder.customerId)}
          onApproveOverride={handleApproveOverride}
          onMpesaSimulatedPayment={handleMpesaSimulatedPayment}
        />
      )}

      {/* ROI & Admin Savings Modal */}
      <RoiCalculatorModal
        isOpen={isRoiModalOpen}
        onClose={() => setIsRoiModalOpen(false)}
      />

      {/* Quick Test Modal */}
      <QuickTestModal
        isOpen={isQuickTestOpen}
        onClose={() => setIsQuickTestOpen(false)}
        customers={customers}
        onParseNewOrder={handleParseNewOrder}
        isParsing={isParsing}
      />
    </div>
  );
}
