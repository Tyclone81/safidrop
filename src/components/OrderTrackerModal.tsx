'use client';

import React, { useState } from 'react';
import { SafiStore, buildCustomerStatusWhatsAppLink } from '@/lib/store';
import { Order, OrderStatus } from '@/types';
import { 
  X, Search, Package, CheckCircle2, AlertCircle, 
  MessageCircle 
} from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'pending_pickup', label: 'Pickup Scheduled', desc: 'Rider assigned for doorstep pickup' },
  { key: 'at_facility', label: 'At Partner Facility', desc: 'Clothes tagged & inspected' },
  { key: 'washing', label: 'Washing & Pressing', desc: 'Commercial wash & fabric conditioning' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Fresh & folded with delivery rider' },
  { key: 'completed', label: 'Delivered', desc: 'Handed over at your door' },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto search if initialQuery provided
  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  if (!isOpen) return null;

  const handleSearch = (searchTerm?: string) => {
    const q = (searchTerm !== undefined ? searchTerm : query).trim();
    if (!q) return;

    setHasSearched(true);

    // Try finding by order ID/Number first
    const byId = SafiStore.getOrderById(q);
    if (byId) {
      setFoundOrders([byId]);
      setSelectedOrder(byId);
      return;
    }

    // Try finding by phone number
    const byPhone = SafiStore.getOrdersByPhone(q);
    if (byPhone.length > 0) {
      setFoundOrders(byPhone);
      setSelectedOrder(byPhone[0]);
      return;
    }

    setFoundOrders([]);
    setSelectedOrder(null);
  };

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus);
    const stepIndex = STATUS_STEPS.findIndex((s) => s.key === stepKey);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl">Track Laundry Status</h3>
              <p className="text-xs text-slate-400">Live doorstep-to-doorstep updates in Kisumu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Order Number (e.g. SD-101) or Phone (e.g. 0711889900)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-sm text-slate-800"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Track
            </button>
          </div>

          {/* Quick sample chips */}
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span>Quick test:</span>
            {['SD-101', 'SD-102', 'SD-103'].map((code) => (
              <button
                key={code}
                onClick={() => {
                  setQuery(code);
                  handleSearch(code);
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-sky-700 font-mono font-medium cursor-pointer"
              >
                {code}
              </button>
            ))}
          </div>

          {/* If multiple orders found for this phone */}
          {foundOrders.length > 1 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-700 mb-2">Multiple orders found for this number:</p>
              <div className="flex gap-2 overflow-x-auto">
                {foundOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      selectedOrder?.id === ord.id
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ord.orderNumber} ({ord.status.replace(/_/g, ' ')})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Order Details Display */}
          {selectedOrder ? (
            <div className="space-y-6 pt-2">
              
              {/* Order Banner */}
              <div className="bg-gradient-to-r from-sky-50 to-blue-50/60 rounded-2xl p-4 sm:p-5 border border-sky-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-slate-900 font-mono">
                      {selectedOrder.orderNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-sky-200 text-sky-900">
                      {selectedOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Customer: <strong>{selectedOrder.customerName}</strong> ({selectedOrder.customerEstate})
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500 font-medium">Total Payable</span>
                  <p className="text-xl font-black text-slate-900">
                    KES {selectedOrder.totalAmount.toLocaleString()}
                  </p>
                  <span className={`text-[11px] font-bold ${
                    selectedOrder.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {selectedOrder.paymentStatus === 'paid' ? 'Paid via M-Pesa' : 'Payment Pending on Delivery'}
                  </span>
                </div>
              </div>

              {/* Progress Timeline Tracker */}
              <div className="py-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Live Fulfillment Milestones
                </h4>

                <div className="space-y-4">
                  {STATUS_STEPS.map((step, idx) => {
                    const state = getStepStatus(step.key, selectedOrder.status);

                    return (
                      <div key={step.key} className="flex items-start gap-3.5 relative">
                        {/* Connecting Line */}
                        {idx < STATUS_STEPS.length - 1 && (
                          <div
                            className={`absolute left-4 top-8 w-0.5 h-8 -ml-px ${
                              state === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          />
                        )}

                        {/* Step Icon Indicator */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
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

                        {/* Step Text */}
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <h5
                              className={`text-sm font-bold ${
                                state === 'current'
                                  ? 'text-sky-700'
                                  : state === 'completed'
                                  ? 'text-slate-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </h5>
                            {state === 'current' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold uppercase">
                                In Progress
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

              {/* Items Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-700 block">Bag Items & Details:</span>
                {selectedOrder.items.map((itm) => (
                  <div key={itm.id} className="flex justify-between text-slate-600">
                    <span>{itm.quantity}x {itm.name} ({itm.unitDescription})</span>
                    <span className="font-medium text-slate-900">KES {itm.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
                {selectedOrder.riderName && (
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-600">
                    <span>Assigned Dispatch Rider:</span>
                    <strong className="text-slate-900">{selectedOrder.riderName}</strong>
                  </div>
                )}
                {selectedOrder.laundromatName && (
                  <div className="flex justify-between text-slate-600">
                    <span>Fulfillment Center:</span>
                    <strong className="text-slate-900">{selectedOrder.laundromatName}</strong>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={buildCustomerStatusWhatsAppLink(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span>Ask Dispatch on WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="py-3 px-5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          ) : hasSearched ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Orders Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't locate an order with "{query}". Double check your tracking number (e.g., SD-101) or try the sample buttons above.
              </p>
            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
};
