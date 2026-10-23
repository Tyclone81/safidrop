'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { MPESA_DETAILS } from '@/data/pricing';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Safi<span className="text-sky-500">Drop</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              On-demand laundry logistics for Kisumu. We handle pickup, partner with certified laundromats, and deliver fresh clothes to your door in 24-48 hours.
            </p>

            <div className="pt-2 flex items-center gap-3 text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-xs">M-Pesa Till: {MPESA_DETAILS.tillNumber}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Services</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-white transition-colors">Standard Bag (~7kg)</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Family Bag (~12kg)</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Wash & Iron (Press)</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Duvets & Blankets</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">2-Piece Suits (Steam)</a></li>
            </ul>
          </div>

          {/* Coverage Areas */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Coverage Zones</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-sky-400 shrink-0" /> Milimani & Ring Road</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-sky-400 shrink-0" /> Kisumu CBD & Mega City</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-sky-400 shrink-0" /> Tom Mboya Estate</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-sky-400 shrink-0" /> Ondiek & Poly Area</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-sky-400 shrink-0" /> Riat Hills & Mamboleo</li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Founder & Operations</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`https://wa.me/${MPESA_DETAILS.supportWhatsApp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Direct Line
                </a>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="inline-block px-3 py-1.5 rounded-lg bg-sky-950 text-sky-400 border border-sky-800 hover:bg-sky-900 transition-colors font-medium mt-1"
                >
                  Ops Command Center →
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 SafiDrop Kenya. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for the Glovo for Laundry model in Kisumu.
          </p>
        </div>
      </div>
    </footer>
  );
};
