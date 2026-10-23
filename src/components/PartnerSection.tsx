'use client';

import React, { useState } from 'react';
import { SafiStore } from '@/lib/store';
import { Building2, CheckCircle2, ArrowRight, Check } from 'lucide-react';

export const PartnerSection: React.FC = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [machines, setMachines] = useState('4');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    SafiStore.addLaundromat({
      name: name.trim(),
      location: location.trim() || 'Kisumu',
      contactPerson: contactPerson.trim() || 'Owner',
      phone: phone.trim(),
      discountRate: 0.30, // 30% default wholesale discount
    });

    setSubmitted(true);
  };

  return (
    <section id="partners" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-2xl relative">
          
          {/* Background subtle light */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: The B2B Pitch */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider border border-sky-400/30">
                <Building2 className="w-3.5 h-3.5" />
                For Laundromat & Dry Cleaner Owners
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Turn your idle washing machines into guaranteed weekly revenue.
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                Do your commercial machines sit empty during weekday mornings? SafiDrop routes guaranteed bulk laundry batches directly to your facility. We handle all customer acquisition, packaging, and bodaboda logistics.
              </p>

              {/* Benefits list */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-sm">
                    <strong className="text-white">Zero Marketing or Delivery Costs:</strong> We bring the clothes to your counter and pick them up once washed and folded.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-sm">
                    <strong className="text-white">Predictable Wholesale Volume:</strong> Off-peak capacity turned into predictable weekly bulk payouts.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-sm">
                    <strong className="text-white">Prompt Weekly M-Pesa Disbursements:</strong> Immediate settlement for every batch completed according to our quality SLA.
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Partner Onboarding Form */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/10 text-white">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Partner Application Received!</h3>
                  <p className="text-xs text-slate-300">
                    We have registered <strong>{name}</strong> into the SafiDrop Partner Hub. Our team will contact you at <strong>{phone}</strong> to inspect facility capacity and finalize SLA rates.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-sky-400 underline font-semibold cursor-pointer"
                  >
                    Submit another facility
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-white">
                    Register Your Laundromat
                  </h3>
                  <p className="text-xs text-slate-300">
                    Join our verified fulfillment network in Kisumu.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Business / Laundromat Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sparkle Cleaners"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Physical Location / Street
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ondiek Highway, next to Poly"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Faith"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="07..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Available Washing Machines
                    </label>
                    <select
                      value={machines}
                      onChange={(e) => setMachines(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                    >
                      <option value="1-2">1 - 2 Commercial Machines</option>
                      <option value="3-5">3 - 5 Commercial Machines</option>
                      <option value="6+">6+ Heavy Duty Washers & Dryers</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Apply as Partner Facility</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
