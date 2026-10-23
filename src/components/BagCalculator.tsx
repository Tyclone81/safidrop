'use client';

import React, { useState } from 'react';
import { SERVICES_CATALOG } from '@/data/pricing';
import { ServiceType, OrderItem } from '@/types';
import { Plus, Minus, ShoppingBag, Sparkles, ArrowRight, Check, Info } from 'lucide-react';

interface BagCalculatorProps {
  onSelectItemsForBooking: (items: OrderItem[]) => void;
}

export const BagCalculator: React.FC<BagCalculatorProps> = ({ onSelectItemsForBooking }) => {
  // Quantities state
  const [quantities, setQuantities] = useState<Record<ServiceType, number>>({
    standard_bag: 1, // Default to 1 standard bag
    family_bag: 0,
    wash_iron: 0,
    duvet: 0,
    suit: 0,
    curtains: 0,
  });

  const handleIncrement = (id: ServiceType) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrement = (id: ServiceType) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };

  // Compute totals
  const selectedItems: OrderItem[] = SERVICES_CATALOG
    .filter((svc) => quantities[svc.id] > 0)
    .map((svc) => ({
      id: `item-${svc.id}`,
      serviceType: svc.id,
      name: svc.name,
      quantity: quantities[svc.id],
      unitPrice: svc.priceKES,
      totalPrice: quantities[svc.id] * svc.priceKES,
      unitDescription: svc.capacityOrUnit,
    }));

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleProceed = () => {
    if (selectedItems.length === 0) {
      // Default to 1 standard bag if user clicked without selecting anything
      const defaultSvc = SERVICES_CATALOG[0];
      onSelectItemsForBooking([
        {
          id: `item-${defaultSvc.id}`,
          serviceType: defaultSvc.id,
          name: defaultSvc.name,
          quantity: 1,
          unitPrice: defaultSvc.priceKES,
          totalPrice: defaultSvc.priceKES,
          unitDescription: defaultSvc.capacityOrUnit,
        },
      ]);
      return;
    }
    onSelectItemsForBooking(selectedItems);
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider border border-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose Your Bags & Build Your Order
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            No surprise weigh-ins or hidden door fees. Pick the laundry bags and items you need, see the exact total in KES, and we'll dispatch our rider.
          </p>
        </div>

        {/* Pricing & Selection Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Services List (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {SERVICES_CATALOG.map((service) => {
              const qty = quantities[service.id] || 0;
              const isSelected = qty > 0;

              return (
                <div
                  key={service.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/30 shadow-md shadow-sky-500/5 ring-1 ring-sky-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                        {service.popular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                            Most Popular
                          </span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {service.category}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-sky-700 font-semibold pt-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>{service.capacityOrUnit}</span>
                      </div>
                    </div>

                    {/* Price and Counter controls */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <div className="text-xl font-extrabold text-slate-900">
                          KES {service.priceKES.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400">per bag/unit</div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleDecrement(service.id)}
                          disabled={qty === 0}
                          className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-800 flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-slate-900">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrement(service.id)}
                          className="w-8 h-8 rounded-lg bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Order Summary Cart (Right 4 cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-sky-400" />
                  <h3 className="font-extrabold text-lg text-white">Your Order Summary</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800 font-semibold">
                  {selectedItems.length} {selectedItems.length === 1 ? 'service' : 'services'}
                </span>
              </div>

              {/* Items Breakdown */}
              {selectedItems.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm space-y-2">
                  <p>No items selected yet.</p>
                  <p className="text-xs text-slate-500">
                    Select a Standard Bag or specialty care item to see instant totals.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                      <div>
                        <p className="font-bold text-slate-200">
                          {item.quantity}x {item.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{item.unitDescription}</p>
                      </div>
                      <div className="font-bold text-white text-right">
                        KES {item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery and turnaround fees info */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Bodaboda Pickup & Delivery</span>
                  <span className="text-emerald-400 font-bold">INCLUDED</span>
                </div>
                <div className="flex justify-between">
                  <span>Turnaround Window</span>
                  <span className="text-slate-200 font-medium">24 - 48 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Reusable SafiBag Provided</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Payable</span>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    KES {totalAmount.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800 px-2 py-1 rounded-lg">
                  M-Pesa on Delivery
                </span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleProceed}
                disabled={totalAmount === 0}
                className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Schedule Pickup ({totalAmount > 0 ? `KES ${totalAmount.toLocaleString()}` : 'Select Items'})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero door scale disputes. What zips, goes!</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
