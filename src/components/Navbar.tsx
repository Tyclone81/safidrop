'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, MessageCircle, Package, X } from 'lucide-react';
import { MPESA_DETAILS } from '@/data/pricing';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenBooking?: () => void;
  onOpenTracker?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="SafiDrop home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
          <a href="#services" className="transition-colors hover:text-sky-700">Pricing</a>
          <a href="#how-it-works" className="transition-colors hover:text-sky-700">How it works</a>
          <a href="#partners" className="transition-colors hover:text-sky-700">Partners</a>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`https://wa.me/${MPESA_DETAILS.supportWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Habari SafiDrop! I would like to inquire about laundry pickup.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp us
          </a>
          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-bold text-white transition-colors hover:bg-sky-700"
          >
            <Package className="h-4 w-4" />
            Book a pickup
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onOpenBooking}
            className="min-h-10 rounded-lg bg-sky-600 px-3.5 text-sm font-bold text-white transition-colors hover:bg-sky-700"
          >
            Book pickup
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-700"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            title={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-navigation" className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 text-sm font-semibold text-slate-700">
            <a href="#services" onClick={closeMenu} className="rounded-lg px-3 py-2.5 hover:bg-sky-50">Pricing &amp; bags</a>
            <a href="#how-it-works" onClick={closeMenu} className="rounded-lg px-3 py-2.5 hover:bg-sky-50">How it works</a>
            <a href="#partners" onClick={closeMenu} className="rounded-lg px-3 py-2.5 hover:bg-sky-50">For partners</a>
            <div className="mt-2 border-t border-slate-100 pt-3">
              <a
                href={`https://wa.me/${MPESA_DETAILS.supportWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Habari SafiDrop! I would like to inquire about laundry pickup.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-teal-700 hover:bg-teal-50"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
              <Link href="/dashboard" onClick={closeMenu} className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600">
                Staff
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
