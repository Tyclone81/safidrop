'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Package } from 'lucide-react';
import { MPESA_DETAILS } from '@/data/pricing';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenTracker: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const [showCleanLaundry, setShowCleanLaundry] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches) {
      setShowCleanLaundry(true);
      return;
    }

    const transitionTimer = window.setInterval(() => {
      setShowCleanLaundry((current) => !current);
    }, 4200);

    return () => window.clearInterval(transitionTimer);
  }, []);

  return (
    <section
      className="overflow-hidden bg-sky-700 text-white"
      style={{ backgroundImage: 'linear-gradient(to bottom, #0369A1, #0284C7)' }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-12 pb-6 sm:px-6 sm:pt-16 sm:pb-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:px-8 lg:pt-20 lg:pb-10">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
            Let us do your
            <span className="mt-1 block text-teal-200">dirty work.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-sky-100 lg:mx-0 sm:text-lg">
            Doorstep pickup and delivery within 24–48 hours. Dirty clothes out, crisp laundry in.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={`https://wa.me/${MPESA_DETAILS.supportWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi SafiDrop! I want to book a laundry pickup today.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-teal-800 transition-colors hover:bg-teal-50 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp us
            </a>
            <button
              type="button"
              onClick={onOpenBooking}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/60 px-5 py-3 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10 sm:w-auto"
            >
              <Package className="h-4 w-4" />
              Book a pickup
            </button>
          </div>

          <p className="mt-5 text-sm font-medium text-sky-100">
            From KES 900 <span className="mx-2 text-teal-200">·</span> Pickup across Kisumu
          </p>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <div className="relative aspect-[5/4] overflow-hidden bg-sky-900">
            <Image
              src="/laundry-before.jpg"
              alt="Laundry waiting to be washed"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={`object-cover transition-[opacity,transform,filter] duration-1000 ease-in-out motion-reduce:transition-none ${showCleanLaundry ? 'scale-105 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'}`}
            />
            <Image
              src="/laundry-after.jpg"
              alt="Freshly folded clean laundry"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={`object-cover transition-[opacity,transform,filter] duration-1000 ease-in-out motion-reduce:transition-none ${showCleanLaundry ? 'scale-100 opacity-100 blur-0' : 'scale-95 opacity-0 blur-sm'}`}
            />
            <span
              aria-live="polite"
              className="absolute bottom-4 left-4 z-10 bg-slate-950/75 px-3 py-1.5 text-xs font-bold text-white"
            >
              {showCleanLaundry ? 'Freshly folded' : 'Ready for pickup'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
