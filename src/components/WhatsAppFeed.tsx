import React, { useState } from 'react';
import { WhatsAppOrder, Customer, CatalogType } from '../types';
import { SAMPLE_PROMPTS } from '../data/mockData';
import { Send, Mic, Play, Pause, FileText, CheckCheck, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';

interface WhatsAppFeedProps {
  orders: WhatsAppOrder[];
  activeOrder: WhatsAppOrder;
  onSelectOrder: (order: WhatsAppOrder) => void;
  customers: Customer[];
  onAddNewCustomMessage: (rawMessage: string, customerId: string, catalogType: CatalogType, messageType: 'text' | 'voice_note' | 'chit_image') => void;
  isParsingAi: boolean;
  catalogType: CatalogType;
}

export const WhatsAppFeed: React.FC<WhatsAppFeedProps> = ({
  orders,
  activeOrder,
  onSelectOrder,
  customers,
  onAddNewCustomMessage,
  isParsingAi,
  catalogType
}) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [voiceProgress, setVoiceProgress] = useState<number>(35);

  const activeCustomer = customers.find((c) => c.id === activeOrder.customerId);

  const handleSendCustomMessage = () => {
    if (!customInput.trim()) return;
    onAddNewCustomMessage(customInput, activeOrder.customerId, catalogType, 'text');
    setCustomInput('');
  };

  const handleLoadSample = (sample: typeof SAMPLE_PROMPTS[0]) => {
    onAddNewCustomMessage(sample.text, sample.customerId, sample.category, 'text');
  };

  const toggleVoicePlayback = () => {
    setIsPlayingVoice(!isPlayingVoice);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      {/* 1. Left List: WhatsApp Contacts & Active Incoming Conversations */}
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-[650px] shadow-sm dark:shadow-lg transition-colors">
        {/* Contact Header */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              WhatsApp Distributor Inbox
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/40 px-2 py-0.5 rounded">
            +254 700 800 900
          </span>
        </div>

        {/* Quick Sample Selector Pill Bar */}
        <div className="p-2 bg-slate-100/70 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Test Real Kenyan Retail Messages:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadSample(sample)}
                className="shrink-0 text-[11px] px-2.5 py-1 bg-white dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded border border-slate-300 dark:border-slate-700/60 transition-colors whitespace-nowrap active:scale-95 shadow-2xs"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
          {orders.map((order) => {
            const customer = customers.find((c) => c.id === order.customerId);
            const isSelected = order.id === activeOrder.id;
            const isBlocked = order.creditCheckResult?.decision === 'BLOCKED';
            const isWarn = order.creditCheckResult?.decision === 'WARN';

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                  isSelected
                    ? 'bg-emerald-50/80 dark:bg-slate-800/80 border-l-4 border-emerald-500'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Avatar Icon with Initials */}
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-white text-xs shrink-0 shadow-xs">
                  {order.customerName.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <span className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                      {order.customerName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
                      {order.receivedAt}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mb-1">
                    {order.messageType === 'voice_note' ? '🎤 Voice Note (0:22)' : order.rawMessage}
                  </p>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 truncate max-w-[120px]">
                      {customer?.location.split(',')[0]}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-300">
                        KES {order.grandTotal.toLocaleString()}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isBlocked
                            ? 'bg-red-500'
                            : isWarn
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        title={
                          isBlocked
                            ? 'Credit Blocked'
                            : isWarn
                            ? 'Credit Warning'
                            : 'Credit Clear'
                        }
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Right Pane: Active WhatsApp Conversation View */}
      <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-[650px] shadow-sm dark:shadow-lg relative transition-colors">
        {/* Chat Top Header */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800/80 flex items-center justify-center font-bold text-emerald-800 dark:text-emerald-300 text-xs">
              {activeOrder.customerName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{activeOrder.customerName}</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">{activeOrder.customerPhone}</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {activeCustomer?.businessName} · {activeCustomer?.route}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-mono">
              {activeOrder.catalogType.toUpperCase()}
            </span>
          </div>
        </div>

        {/* WhatsApp Background & Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-100/60 dark:bg-slate-950/80 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Day timestamp badge */}
          <div className="flex justify-center">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full shadow-2xs">
              Today · WhatsApp Business Verified
            </span>
          </div>

          {/* Incoming Customer Message Bubble */}
          <div className="flex items-start max-w-[85%] sm:max-w-[75%]">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl rounded-tl-sm p-4 shadow-sm space-y-2">
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-between gap-4">
                <span>{activeOrder.customerName}</span>
                <span className="text-[10px] text-slate-500 font-normal font-mono">{activeOrder.receivedAt}</span>
              </div>

              {/* If Voice Note */}
              {activeOrder.messageType === 'voice_note' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      onClick={toggleVoicePlayback}
                      className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
                    >
                      {isPlayingVoice ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <div className="flex-1 space-y-1">
                      {/* Audio waveform simulation */}
                      <div className="flex items-center gap-0.5 h-6">
                        {[40, 70, 90, 50, 30, 85, 100, 60, 45, 80, 95, 30, 65, 90, 55, 75, 40, 60].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all ${
                              i < (voiceProgress / 5) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>{isPlayingVoice ? '0:09' : '0:00'}</span>
                        <span>0:22</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Mic className="w-3 h-3" />
                      <span>Swahili / Sheng Speech-to-Text Transcription:</span>
                    </div>
                    <p className="italic">"{activeOrder.rawMessage}"</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {activeOrder.rawMessage}
                </p>
              )}

              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 pt-1">
                <span>Delivered</span>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          {/* AI Parser Bot Automatic Confirmation Bubble */}
          <div className="flex justify-end">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-slate-900 dark:text-slate-100 rounded-2xl rounded-tr-sm p-4 max-w-[85%] sm:max-w-[75%] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold gap-4">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OrderFlow Auto-Parse Confirmation</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Just now</span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-medium text-slate-900 dark:text-white">
                  ✓ Order parsed into {activeOrder.items.length} clean distributor SKUs:
                </p>
                <ul className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400 pl-2">
                  {activeOrder.items.map((i, idx) => (
                    <li key={idx} className="flex justify-between font-mono">
                      <span>• {i.quantity}x {i.itemName} ({i.unit})</span>
                      <span className="text-slate-800 dark:text-slate-300">KES {i.lineTotal.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Total Value:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  KES {activeOrder.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Input Area to simulate typing or pasting any retail order */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendCustomMessage();
              }}
              placeholder="Paste or type raw WhatsApp order (e.g. 'Niaje Kelvin, tupatie bales 10 za Jogoo 2kg...')"
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              onClick={handleSendCustomMessage}
              disabled={!customInput.trim() || isParsingAi}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Parse</span>
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
            <span>Powered by Gemini 3.8 Flash · Swahili / Sheng dialect understanding</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">1.2s extraction latency</span>
          </div>
        </div>
      </div>
    </div>
  );
};
