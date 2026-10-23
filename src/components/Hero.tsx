'use client';

import React from 'react';
import { Package, ShieldCheck, Clock, CheckCircle2, MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import { MPESA_DETAILS } from '@/data/pricing';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenTracker: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenTracker }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-sky-50/60 via-white to-slate-50">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-80 h-80 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200/80 text-sky-800 text-xs font-semibold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-sky-600 animate-pulse" />
              <span>Kisumu's Premier On-Demand Laundry Service</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Dirty clothes out,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500">
                crisp & fresh laundry in.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              We pick up your laundry at your doorstep in Milimani, CBD, Tom Mboya & Poly, wash and fold it with verified commercial laundromats, and deliver it back in 24-48 hours.
            </p>

            {/* Standard Bag Highlight Pill */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-sm flex items-start gap-3 text-left max-w-xl mx-auto lg:mx-0">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-950">The Standard Bag Model:</strong> No weighing scales at your door! Just fill our bag—if you can pull the drawstring closed, that’s your flat rate (from KES 900).
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 shadow-lg shadow-sky-600/30 hover:shadow-sky-600/40 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-5 h-5" />
                Book Doorstep Pickup
              </button>

              <a
                href={`https://wa.me/${MPESA_DETAILS.supportWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi SafiDrop! I want to book a laundry pickup today.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2.5"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                Order on WhatsApp
              </a>
            </div>

            {/* Feature Guarantees Strip */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-600 border-t border-slate-200/60 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                <span>24 - 48h Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>M-Pesa Verified</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>SLA Fabric Safety</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              
              {/* Floating Badge 1: 24h Express */}
              <div className="absolute -top-4 -left-4 z-20 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Standard Delivery</p>
                  <p className="text-sm font-extrabold text-slate-900">24 - 48 Hours</p>
                </div>
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-900/10 border border-slate-100 space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Most Popular</span>
                    <h3 className="text-2xl font-extrabold text-slate-900">Standard Wash & Fold</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-medium">Flat Fee</span>
                    <p className="text-2xl font-black text-slate-900">KES 900</p>
                  </div>
                </div>

                {/* Bag representation visualization */}
                <div className="bg-gradient-to-br from-sky-50 to-blue-50/50 rounded-2xl p-5 border border-sky-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-sky-900">Drawstring Laundry Bag</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-200 text-sky-800">~7 Kilograms</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Fits ~30 - 35 everyday garments (Shirts, Trousers, Shorts, T-Shirts)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Commercial hypoallergenic detergent + fabric softener</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Machine spun dry & crisply folded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Bodaboda pickup & doorstep delivery included</span>
                    </div>
                  </div>
                </div>

                {/* Live Action button on card */}
                <button
                  onClick={onOpenBooking}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Select & Schedule Pickup</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-center">
                  <button
                    onClick={onOpenTracker}
                    className="text-xs text-sky-600 font-semibold hover:underline cursor-pointer"
                  >
                    Already have an active order? Track status here →
                  </button>
                </div>
              </div>

              {/* Floating Badge 2: B2B Wholesale */}
              <div className="absolute -bottom-4 -right-2 z-20 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5">
                <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
                <p className="text-xs font-bold text-slate-800">
                  Riders active in Milimani & CBD
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
