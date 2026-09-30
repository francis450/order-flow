import React, { useState } from 'react';
import { WhatsAppOrder, Customer, ErpSyncDetails } from '../types';
import { CheckCircle2, ShieldAlert, Truck, Download, Edit3, Save, RefreshCw } from 'lucide-react';

interface OrderParserPanelProps {
  order: WhatsAppOrder;
  customer?: Customer;
  onOpenCreditModal: () => void;
  onPushToErp: (orderId: string, erpType: ErpSyncDetails['erpType']) => void;
  onUpdateOrderItems: (orderId: string, updatedItems: WhatsAppOrder['items']) => void;
}

export const OrderParserPanel: React.FC<OrderParserPanelProps> = ({
  order,
  customer,
  onOpenCreditModal,
  onPushToErp,
  onUpdateOrderItems
}) => {
  const [selectedErp, setSelectedErp] = useState<ErpSyncDetails['erpType']>('SAP_BUSINESS_ONE');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedItems, setEditedItems] = useState(order.items);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync state if order changes
  React.useEffect(() => {
    setEditedItems(order.items);
    setIsEditing(false);
  }, [order.id]);

  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    const updated = editedItems.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQty,
          lineTotal: newQty * item.unitPrice
        };
      }
      return item;
    });
    setEditedItems(updated);
  };

  const handleSaveEdits = () => {
    onUpdateOrderItems(order.id, editedItems);
    setIsEditing(false);
  };

  const handleTriggerPush = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onPushToErp(order.id, selectedErp);
      setIsSyncing(false);
    }, 900);
  };

  const handleExportCsv = () => {
    const headers = 'SKU,Item Name,Packaging Unit,Quantity,Unit Price (KES),Line Total (KES)\n';
    const rows = order.items
      .map(
        (i) =>
          `"${i.matchedSku}","${i.itemName}","${i.unit}",${i.quantity},${i.unitPrice},${i.lineTotal}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Order_${order.orderNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isCreditBlocked = order.creditCheckResult?.decision === 'BLOCKED';
  const isCreditWarn = order.creditCheckResult?.decision === 'WARN';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 lg:p-6 shadow-sm dark:shadow-xl flex flex-col h-full transition-colors">
      {/* Top Banner: Order ID & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Automated Order Parser</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400">{order.orderNumber}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
            {order.customerName}
          </h2>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
            <span>{order.customerLocation}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">{order.route}</span>
          </div>
        </div>

        {/* Status / Credit Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCreditModal}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isCreditBlocked
                ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/80'
                : isCreditWarn
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/80'
                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900/80'
            }`}
          >
            {isCreditBlocked || isCreditWarn ? (
              <ShieldAlert className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>
              {isCreditBlocked
                ? 'Credit Stop: Lock'
                : isCreditWarn
                ? 'Credit Alert: Review'
                : 'Credit Approved'}
            </span>
          </button>

          {order.erpSyncDetails && (
            <span className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>{order.erpSyncDetails.erpReferenceNumber}</span>
            </span>
          )}
        </div>
      </div>

      {/* Credit Warning Callout if needed */}
      {isCreditBlocked && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-xs text-red-800 dark:text-red-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>
              <strong>Credit Ceiling Breached:</strong> Customer has overdue debt. Dispatch locked
              pending M-Pesa clearance.
            </span>
          </div>
          <button
            onClick={onOpenCreditModal}
            className="px-2.5 py-1 bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700 text-white rounded text-[11px] font-semibold whitespace-nowrap cursor-pointer"
          >
            Resolve Hold
          </button>
        </div>
      )}

      {/* Line Items Table */}
      <div className="flex-1 overflow-x-auto min-h-[220px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Parsed SKUs & Packaging Units ({order.items.length} items)
          </span>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSaveEdits}
                className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Quantities</span>
              </button>
            )}
          </div>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium font-sans">
              <th className="py-2 pr-3">Product Description / SKU</th>
              <th className="py-2 px-3 text-center">Unit</th>
              <th className="py-2 px-3 text-right">Qty</th>
              <th className="py-2 px-3 text-right">Unit Price</th>
              <th className="py-2 pl-3 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
            {(isEditing ? editedItems : order.items).map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 pr-3">
                  <div className="font-sans font-semibold text-slate-900 dark:text-white text-[13px]">{item.itemName}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{item.matchedSku}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500 font-sans italic truncate max-w-[200px]">
                      "{item.rawText}"
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center text-slate-700 dark:text-slate-300 font-sans">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                    {item.unit}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                  {isEditing ? (
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                      className="w-14 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-xs text-emerald-600 dark:text-emerald-400"
                    />
                  ) : (
                    <span>{item.quantity}</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300">
                  KES {item.unitPrice.toLocaleString()}
                </td>
                <td className="py-2.5 pl-3 text-right font-semibold text-emerald-700 dark:text-emerald-400">
                  KES {item.lineTotal.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary & Delivery Instructions */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 space-y-3">
        {order.deliveryNotes && (
          <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
            <span className="font-semibold text-slate-800 dark:text-slate-300">Dispatch Notes: </span>
            <span>{order.deliveryNotes}</span>
            {order.deliveryDatePreference && (
              <span className="text-emerald-700 dark:text-emerald-400 ml-2">
                (Time: {order.deliveryDatePreference})
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-end">
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div>
              <span>Customer PIN: </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {customer?.taxPin || 'P051892341Z'}
              </span>
            </div>
            {order.erpSyncDetails ? (
              <div className="text-blue-700 dark:text-blue-400 font-mono text-[11px]">
                Warehouse Bay: {order.erpSyncDetails.warehouseBay} | Vehicle: {order.erpSyncDetails.deliveryTruckId}
              </div>
            ) : (
              <div className="text-slate-500 text-[11px]">
                Ready for automated ERP injection into {selectedErp.replace('_', ' ')}
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">Subtotal: KES {order.subtotal.toLocaleString()}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">VAT (Standard items): KES {order.vatTotal.toLocaleString()}</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
              KES {order.grandTotal.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions: ERP Integration Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* ERP System Selector */}
          <select
            value={selectedErp}
            onChange={(e) => setSelectedErp(e.target.value as any)}
            disabled={!!order.erpSyncDetails}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-2 font-mono"
          >
            <option value="SAP_BUSINESS_ONE">SAP Business One</option>
            <option value="QUICKBOOKS">QuickBooks Online</option>
            <option value="ODOO">Odoo ERP</option>
            <option value="TALLY">Tally Prime</option>
            <option value="EXCEL_BATCH">Excel / CSV Batch</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download CSV for ERP"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>

        {/* Primary Action Button */}
        {order.erpSyncDetails ? (
          <div className="w-full sm:w-auto px-4 py-2 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Pushed to {order.erpSyncDetails.erpType.replace('_', ' ')} ({order.erpSyncDetails.erpReferenceNumber})</span>
          </div>
        ) : (
          <button
            onClick={handleTriggerPush}
            disabled={isSyncing}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
              isCreditBlocked
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Truck className="w-4 h-4" />
            )}
            <span>
              {isSyncing
                ? 'Injecting into ERP...'
                : isCreditBlocked
                ? 'Override Credit & Push to ERP'
                : `1-Click Push to ${selectedErp.replace('_', ' ')}`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
