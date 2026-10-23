'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SafiStore, buildCustomerStatusWhatsAppLink } from '@/lib/store';
import { Order, OrderStatus } from '@/types';
import { 
  Search, CheckCircle2, 
  MessageCircle, ArrowLeft, AlertCircle, Sparkles 
} from 'lucide-react';

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'pending_pickup', label: 'Pickup Scheduled', desc: 'Bodaboda rider assigned for doorstep collection' },
  { key: 'at_facility', label: 'At Partner Facility', desc: 'Clothes tagged, weighed & inspected' },
  { key: 'washing', label: 'Washing & Pressing', desc: 'Commercial wash, hygiene spin & crisp steam fold' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Packed fresh & en route to your doorstep' },
  { key: 'completed', label: 'Delivered', desc: 'Handed over at your door' },
];

function TrackContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('id') || searchParams.get('order') || '';
  
  const [query, setQuery] = useState(initialCode);
  const [order, setOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = (codeToSearch: string) => {
    const q = codeToSearch.trim();
    if (!q) return;
    setHasSearched(true);

    const foundById = SafiStore.getOrderById(q);
    if (foundById) {
      setOrder(foundById);
      return;
    }

    const foundByPhone = SafiStore.getOrdersByPhone(q);
    if (foundByPhone.length > 0) {
      setOrder(foundByPhone[0]);
      return;
    }

    setOrder(null);
  };

  useEffect(() => {
    if (initialCode) {
      performSearch(initialCode);
    }
  }, [initialCode]);

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus);
    const stepIndex = STATUS_STEPS.findIndex((s) => s.key === stepKey);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              Safi<span className="text-sky-600">Drop</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Track Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 sm:py-12 space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Track Your Laundry Live
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Enter your Order Tracking ID (e.g. SD-101) or WhatsApp Phone Number.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-md flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="e.g. SD-101 or 0711..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch(query)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none text-slate-800"
            />
          </div>
          <button
            onClick={() => performSearch(query)}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            Track
          </button>
        </div>

        {/* Sample IDs */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>Try quick samples:</span>
          {['SD-101', 'SD-102', 'SD-103'].map((code) => (
            <button
              key={code}
              onClick={() => {
                setQuery(code);
                performSearch(code);
              }}
              className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 font-mono text-sky-700 cursor-pointer"
            >
              {code}
            </button>
          ))}
        </div>

        {/* Result Card */}
        {order ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Order Tracking ID
                </span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {order.orderNumber}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Customer: <strong>{order.customerName}</strong> ({order.customerEstate})
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block">Total Payable</span>
                <span className="text-xl font-black text-slate-900">
                  KES {order.totalAmount.toLocaleString()}
                </span>
                <span className={`text-[11px] font-bold block ${
                  order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {order.paymentStatus === 'paid' ? 'Paid via M-Pesa' : 'Payment on Delivery'}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4 py-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Fulfillment Milestones
              </h3>

              <div className="space-y-4">
                {STATUS_STEPS.map((step, idx) => {
                  const state = getStepStatus(step.key, order.status);

                  return (
                    <div key={step.key} className="flex items-start gap-3.5 relative">
                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 w-0.5 h-8 -ml-px ${
                            state === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      )}

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          state === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : state === 'current'
                            ? 'bg-sky-600 text-white ring-4 ring-sky-100 animate-pulse'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {state === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-bold ${
                              state === 'current'
                                ? 'text-sky-700'
                                : state === 'completed'
                                ? 'text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {state === 'current' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold uppercase">
                              Active Now
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bag Details */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-700 block">Laundry Bag Contents:</span>
              {order.items.map((i) => (
                <div key={i.id} className="flex justify-between text-slate-600">
                  <span>{i.quantity}x {i.name}</span>
                  <span className="font-semibold text-slate-900">KES {i.totalPrice.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-500">
                <span>Pickup Time Window:</span>
                <strong className="text-slate-800">{order.pickupSlot}</strong>
              </div>
            </div>

            {/* WhatsApp Contact */}
            <a
              href={buildCustomerStatusWhatsAppLink(order)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Contact Dispatcher on WhatsApp</span>
            </a>

          </div>
        ) : hasSearched ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">No Orders Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find an order matching "{query}". Try one of the sample buttons above.
            </p>
          </div>
        ) : null}

      </main>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
