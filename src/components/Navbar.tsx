'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, Package, Search, Menu, X, ArrowRight } from 'lucide-react';
import { MPESA_DETAILS } from '@/data/pricing';

interface NavbarProps {
  onOpenBooking?: () => void;
  onOpenTracker?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenTracker }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Safi<span className="text-sky-600">Drop</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Kisumu
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-none">Doorstep Laundry Logistics</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#services" className="hover:text-sky-600 transition-colors">
              Pricing & Bags
            </a>
            <a href="#how-it-works" className="hover:text-sky-600 transition-colors">
              How It Works
            </a>
            <button
              onClick={onOpenTracker}
              className="flex items-center gap-1.5 hover:text-sky-600 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-sky-500" />
              Track Order
            </button>
            <a href="#partners" className="hover:text-sky-600 transition-colors">
              For Laundromats
            </a>
            <Link
              href="/dashboard"
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              Ops Command Center
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${MPESA_DETAILS.supportWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Habari SafiDrop! I would like to inquire about laundry pickup.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              WhatsApp Us
            </a>

            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 shadow-md shadow-sky-600/25 hover:shadow-sky-600/35 active:scale-95 transition-all cursor-pointer"
            >
              <Package className="w-4 h-4" />
              Book a Pickup
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600"
            >
              Book Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col gap-3 font-semibold text-slate-700">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Pricing & Bag Calculator
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              How It Works
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker?.();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-left cursor-pointer"
            >
              <Search className="w-4 h-4 text-sky-500" />
              Track My Order
            </button>
            <a
              href="#partners"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              For Partner Laundromats
            </a>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 text-slate-900"
            >
              <span>Ops Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-sky-600 shadow-md"
            >
              <Package className="w-4 h-4" />
              Schedule Doorstep Pickup
            </button>

            <a
              href={`https://wa.me/${MPESA_DETAILS.supportWhatsApp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
