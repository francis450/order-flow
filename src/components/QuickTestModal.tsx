import React, { useState } from 'react';
import { Customer, CatalogType } from '../types';
import { SAMPLE_PROMPTS } from '../data/mockData';
import { Sparkles, Send, Mic, FileText } from 'lucide-react';

interface QuickTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onParseNewOrder: (
    message: string,
    customerId: string,
    catalogType: CatalogType,
    messageType: 'text' | 'voice_note' | 'chit_image'
  ) => void;
  isParsing: boolean;
}

export const QuickTestModal: React.FC<QuickTestModalProps> = ({
  isOpen,
  onClose,
  customers,
  onParseNewOrder,
  isParsing
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || 'cust-1');
  const [catalogType, setCatalogType] = useState<CatalogType>('fmcg');
  const [customText, setCustomText] = useState<string>('');
  const [messageType, setMessageType] = useState<'text' | 'voice_note' | 'chit_image'>('text');

  if (!isOpen) return null;

  const handleSelectSample = (sample: typeof SAMPLE_PROMPTS[0]) => {
    setCustomText(sample.text);
    setCatalogType(sample.category);
    setSelectedCustomerId(sample.customerId);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onParseNewOrder(customText, selectedCustomerId, catalogType, messageType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 max-w-2xl w-full text-slate-900 dark:text-slate-100 shadow-2xl space-y-5 my-8 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Real WhatsApp Incoming Message</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Test Order Parser & Credit Gatekeeper
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
            ✕
          </button>
        </div>

        {/* 1-Click Preset Samples */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
            1-Click Preset Real Scenarios from Nairobi Wholesale Routes:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-left p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-xs space-y-1 cursor-pointer"
              >
                <div className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>{sample.title}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {sample.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                  "{sample.text}"
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Form to customize or paste */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Select Customer Duka / Chemist:</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.businessName} ({c.location.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Catalog Mode:</label>
              <div className="flex bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setCatalogType('fmcg')}
                  className={`flex-1 py-1.5 rounded font-medium cursor-pointer transition-colors ${
                    catalogType === 'fmcg' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  FMCG Staples
                </button>
                <button
                  type="button"
                  onClick={() => setCatalogType('pharma')}
                  className={`flex-1 py-1.5 rounded font-medium cursor-pointer transition-colors ${
                    catalogType === 'pharma' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Pharmaceuticals
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">WhatsApp Message Content (Sheng, Swahili, English):</label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setMessageType('text')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    messageType === 'text' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold' : 'text-slate-500'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessageType('voice_note')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    messageType === 'voice_note' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold' : 'text-slate-500'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span>Voice Note</span>
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Niaje Kelvin, tupatie bales 10 za Jogoo 2kg, carton 4 za Golden Fry 1L, na carton 2 za Royco 5 bob cubes. Deliver kesho saa mbili asubuhi River Road..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isParsing || !customText.trim()}
              className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isParsing ? 'Parsing with Gemini...' : 'Parse & Check Credit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
