'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { SectionDivider, FooterWave } from '@/components/SectionDivider';
import { BagCalculator } from '@/components/BagCalculator';
import { HowItWorks } from '@/components/HowItWorks';
import { PartnerSection } from '@/components/PartnerSection';
import { Footer } from '@/components/Footer';
import { BookingModal } from '@/components/BookingModal';
import { OrderTrackerModal } from '@/components/OrderTrackerModal';
import { OrderItem, Order } from '@/types';
import { SERVICES_CATALOG } from '@/data/pricing';

export default function HomePage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [trackerInitialQuery, setTrackerInitialQuery] = useState('');
  
  // Default booking items to 1 standard bag
  const defaultItem: OrderItem = {
    id: `item-${SERVICES_CATALOG[0].id}`,
    serviceType: SERVICES_CATALOG[0].id,
    name: SERVICES_CATALOG[0].name,
    quantity: 1,
    unitPrice: SERVICES_CATALOG[0].priceKES,
    totalPrice: SERVICES_CATALOG[0].priceKES,
    unitDescription: SERVICES_CATALOG[0].capacityOrUnit,
  };
  const [selectedBookingItems, setSelectedBookingItems] = useState<OrderItem[]>([defaultItem]);

  const handleOpenBooking = () => {
    setBookingModalOpen(true);
  };

  const handleSelectItemsFromCalculator = (items: OrderItem[]) => {
    setSelectedBookingItems(items);
    setBookingModalOpen(true);
  };

  const handleOpenTracker = (query?: string) => {
    if (query) setTrackerInitialQuery(query);
    setTrackerModalOpen(true);
  };

  const handleOrderCreated = (order: Order) => {
    // Keep booking modal open on confirmation state or pass tracking query
    setTrackerInitialQuery(order.orderNumber);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        onOpenBooking={handleOpenBooking}
        onOpenTracker={() => handleOpenTracker()}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          onOpenBooking={handleOpenBooking}
          onOpenTracker={() => handleOpenTracker()}
        />

        {/* Hero -> body: blue (end of hero gradient) into white, with rising suds */}
        <SectionDivider variant="suds" bgClass="bg-sky-600" fillClass="fill-white" />

        {/* Interactive Bag Calculator */}
        <BagCalculator
          onSelectItemsForBooking={handleSelectItemsFromCalculator}
        />

        {/* Quiet wave: white into the soft sky tint of How It Works */}
        <SectionDivider variant="wave" compact bgClass="bg-white" fillClass="fill-sky-50" />

        {/* 4-Step Operational Flow (section background: bg-sky-50) */}
        <HowItWorks
          onOpenBooking={handleOpenBooking}
        />

        {/* Mirrored wave: sky tint back to white */}
        <SectionDivider variant="wave" compact flip bgClass="bg-sky-50" fillClass="fill-white" />

        {/* B2B Partner Section for Laundromats */}
        <PartnerSection />
      </main>

      {/* Body -> footer: layered teal / white / dark transition */}
      <FooterWave />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialItems={selectedBookingItems}
        onOrderCreated={handleOrderCreated}
      />

      <OrderTrackerModal
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        initialQuery={trackerInitialQuery}
      />
    </div>
  );
}
