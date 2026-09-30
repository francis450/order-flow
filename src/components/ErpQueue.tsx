import React, { useState } from 'react';
import { WhatsAppOrder, Customer } from '../types';
import { Truck, CheckCircle2, Download, Printer, ExternalLink, Calendar, MapPin } from 'lucide-react';

interface ErpQueueProps {
  orders: WhatsAppOrder[];
  customers: Customer[];
  onSelectOrder: (order: WhatsAppOrder) => void;
}

export const ErpQueue: React.FC<ErpQueueProps> = ({ orders, customers, onSelectOrder }) => {
  const [selectedBay, setSelectedBay] = useState<string>('all');
  const [showManifestModal, setShowManifestModal] = useState<boolean>(false);
  const [selectedManifestOrder, setSelectedManifestOrder] = useState<WhatsAppOrder | null>(null);

  const syncedOrders = orders.filter((o) => o.erpSyncDetails);

  const filteredOrders = syncedOrders.filter((o) => {
    if (selectedBay === 'all') return true;
    return o.erpSyncDetails?.warehouseBay.toLowerCase().includes(selectedBay.toLowerCase());
  });

  const handlePrintManifest = (order: WhatsAppOrder) => {
    setSelectedManifestOrder(order);
    setShowManifestModal(true);
  };

  const handleDownloadAllCsv = () => {
    const headers = 'Order Number,ERP Reference,Customer,Route,Warehouse Bay,Truck Reg,Items Count,Grand Total (KES),Synced At\n';
    const rows = syncedOrders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.erpSyncDetails?.erpReferenceNumber || ''}","${o.customerName}","${o.route}","${o.erpSyncDetails?.warehouseBay || ''}","${o.erpSyncDetails?.deliveryTruckId || ''}",${o.items.length},${o.grandTotal},"${o.erpSyncDetails?.syncedAt || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ERP_Dispatch_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Industrial Area Loading Bay Monitor */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <Truck className="w-4 h-4" />
              <span>Nairobi Industrial Area Depot · Loading Bays</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Active Route Dispatch & ERP Sync Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clean orders pushed automatically from WhatsApp into SAP Business One, QuickBooks & Odoo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAllCsv}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Batch CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Warehouse Loading Bays Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start text-xs mb-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Bay 01 · Thika Highway</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Active Canter
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Truck: KDD 412X (7-Ton)</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Githurai, Roysambu, Ruiru Route</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start text-xs mb-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Bay 02 · Eastlands Canter</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Loading
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Truck: KDD 684X (5-Ton)</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Eastleigh, Donholm, Umoja Route</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start text-xs mb-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Bay 03 · CBD Express</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Dispatched
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Truck: KDD 918P (3-Ton)</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">River Road, OTC, Downtown CBD</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start text-xs mb-1">
              <span className="font-bold text-slate-700 dark:text-slate-400">Bay 04 · Westlands & Dagoretti</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400">
                Staging
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Rider & Express Van</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Kawangware, Westlands, Kangemi</div>
          </div>
        </div>
      </div>

      {/* Synced Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Orders Synced to ERP ({syncedOrders.length} Completed)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Zero typing errors · 100% SKU match
          </span>
        </div>

        {syncedOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <Truck className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No orders pushed to ERP yet.</p>
            <p className="text-xs mt-1">Select an order in the Queue tab and click "1-Click Push to ERP".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium font-sans">
                  <th className="py-2.5 pr-3">ERP Ref # / Order #</th>
                  <th className="py-2.5 px-3">Customer & Route</th>
                  <th className="py-2.5 px-3">Bay / Vehicle</th>
                  <th className="py-2.5 px-3 text-right">Items / Amount</th>
                  <th className="py-2.5 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {syncedOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pr-3 font-sans">
                        <div className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                          {order.erpSyncDetails?.erpReferenceNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          WO: {order.orderNumber} · Synced at {order.erpSyncDetails?.syncedAt}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-sans">
                        <div className="font-semibold text-slate-900 dark:text-white">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{order.route}</div>
                      </td>

                      <td className="py-3 px-3 font-sans">
                        <div className="text-slate-800 dark:text-slate-300 font-medium">
                          {order.erpSyncDetails?.warehouseBay}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {order.erpSyncDetails?.deliveryTruckId}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          KES {order.grandTotal.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                          {order.items.length} SKUs
                        </span>
                      </td>

                      <td className="py-3 pl-3 text-right font-sans">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handlePrintManifest(order)}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-transparent rounded transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Delivery Note</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delivery Note / Warehouse Manifest Modal */}
      {showManifestModal && selectedManifestOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 max-w-xl w-full text-slate-900 dark:text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                  OFFICIAL DELIVERY NOTE & GATE PASS
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Kifaru Commercial Distributors Ltd
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enterprise Road, Industrial Area, Nairobi · PIN: P051892341Z
                </span>
              </div>
              <button
                onClick={() => setShowManifestModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 font-mono">
              <div>
                <span className="text-slate-500 block">Dispatch Reference:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedManifestOrder.erpSyncDetails?.erpReferenceNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Warehouse Bay:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {selectedManifestOrder.erpSyncDetails?.warehouseBay}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Consignee Retailer:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedManifestOrder.customerName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Delivery Vehicle:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedManifestOrder.erpSyncDetails?.deliveryTruckId}
                </span>
              </div>
            </div>

            {/* Line items list */}
            <div className="max-h-52 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-2">Item Description</th>
                    <th className="p-2 text-center">Unit</th>
                    <th className="p-2 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {selectedManifestOrder.items.map((i) => (
                    <tr key={i.id}>
                      <td className="p-2 font-sans text-slate-800 dark:text-slate-200">{i.itemName}</td>
                      <td className="p-2 text-center text-slate-500 dark:text-slate-400">{i.unit}</td>
                      <td className="p-2 text-right font-bold text-slate-900 dark:text-white">{i.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-xs pt-2">
              <span className="text-slate-500">Driver & Warehouse Lead Signatures verified</span>
              <button
                onClick={() => {
                  alert('Delivery Note generated and sent to warehouse thermal printer.');
                  setShowManifestModal(false);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
              >
                Print Gate Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
