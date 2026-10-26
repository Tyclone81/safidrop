'use client';

import React from 'react';
import { Package, Bike, Sparkles, CheckCircle, Clock, ChevronRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenBooking: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenBooking }) => {
  // Icon colours move from blue (dirty, picked up) to teal (clean, delivered).
  const steps = [
    {
      num: '01',
      title: 'Fill Your Bag & Book',
      desc: 'Pack your dirty garments into any bag (or our reusable SafiBag). Pick your window online or WhatsApp. Flat-rate bag pricing means zero awkward doorstep weighing!',
      icon: Package,
      badge: 'Flat-Rate Bag',
      color: 'from-sky-700 to-sky-500',
    },
    {
      num: '02',
      title: 'Doorstep Bodaboda Pickup',
      desc: 'Our vetted rider arrives at your doorstep in Milimani, CBD, Tom Mboya, or Poly. Your bag is tagged with your unique Order ID (e.g. SD-102) for complete tracking.',
      icon: Bike,
      badge: 'Fast Dispatch',
      color: 'from-sky-600 to-sky-400',
    },
    {
      num: '03',
      title: 'Commercial Partner Wash',
      desc: 'Fulfilled by verified laundromat centers. Garments are fabric-sorted, treated with premium detergent, conditioned, dried, and crisply pressed or folded.',
      icon: Sparkles,
      badge: 'Fabric Safety SLA',
      color: 'from-sky-600 to-teal-500',
    },
    {
      num: '04',
      title: 'Delivered Fresh in 24-48h',
      desc: 'Delivered right back to your door smelling heavenly, crisp, and wardrobe-ready. Inspect your items and settle conveniently via M-Pesa Buy Goods.',
      icon: CheckCircle,
      badge: 'M-Pesa Verified',
      color: 'from-teal-600 to-teal-400',
    },
  ];

  return (
    // Background is sky-50 so the wave dividers above and below blend into it.
    // No top/bottom borders: they would draw straight lines across the curves.
    <section id="how-it-works" className="scroll-mt-16 bg-sky-50 py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            Simple 4-Step Logistics
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How SafiDrop Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Pickup, wash and delivery, all handled for you, so you never waste weekend hours washing or dragging bags to town again.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-slate-200 group-hover:text-sky-500/30 transition-colors font-mono">
                      {step.num}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-md shadow-sky-500/15 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 mb-2 inline-block">
                    {step.badge}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-sky-600 group-hover:text-sky-700">
                  <span>Seamless Experience</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl shadow-sky-900/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-extrabold text-slate-900">
              Ready to take laundry off your weekend to-do list?
            </h4>
            <p className="text-sm text-slate-600">
              Book a bag pickup in 60 seconds. Our rider will be at your door today.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenBooking}
            className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            Schedule a Pickup Now
          </button>
        </div>

      </div>
    </section>
  );
};
