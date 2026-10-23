'use client';

import React, { useState } from 'react';
import { OrderItem, Order } from '@/types';
import { SafiStore, buildWhatsAppOrderLink } from '@/lib/store';
import { KISUMU_ESTATES, TIME_SLOTS, MPESA_DETAILS } from '@/data/pricing';
import { 
  X, CheckCircle, MessageCircle, Copy, Check, ArrowRight, 
  MapPin, Clock, Phone, User, FileText, Sparkles 
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItems: OrderItem[];
  onOrderCreated?: (order: Order) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialItems,
  onOrderCreated,
}) => {
  const [items, setItems] = useState<OrderItem[]>(initialItems);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [estate, setEstate] = useState(KISUMU_ESTATES[0]);
  const [customEstate, setCustomEstate] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pickupSlot, setPickupSlot] = useState(TIME_SLOTS[0]);
  const [notes, setNotes] = useState('');

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if initialItems changes
  React.useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
    }
  }, [initialItems]);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, itm) => sum + itm.totalPrice, 0);

  // Wholesale estimate (~35% off retail) + rider cost 150
  const estimatedLaundromatCost = Math.round(totalAmount * 0.65);
  const riderCost = 150;
  const netProfit = totalAmount - estimatedLaundromatCost - riderCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please enter your Name and WhatsApp Phone Number.');
      return;
    }

    setIsSubmitting(true);

    const finalEstate = estate === 'Other Area' && customEstate ? customEstate : estate;

    const newOrder = SafiStore.createOrder({
      customerId: `cst-${Date.now()}`,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEstate: finalEstate,
      customerLandmark: landmark.trim() || undefined,
      items: items.length > 0 ? items : initialItems,
      totalAmount,
      laundromatCost: estimatedLaundromatCost,
      riderCost,
      netProfit,
      status: 'pending_pickup',
      paymentStatus: 'pending',
      paymentMethod: 'mpesa',
      pickupSlot,
      notes: notes.trim() || undefined,
    });

    setCreatedOrder(newOrder);
    setIsSubmitting(false);
    onOrderCreated?.(newOrder);
  };

  const handleCopyOrderNumber = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.orderNumber);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl">
                {createdOrder ? 'Order Confirmed!' : 'Book Doorstep Laundry Pickup'}
              </h3>
              <p className="text-xs text-sky-100">
                {createdOrder ? 'Your pickup is registered' : 'Zero weigh-ins, flat bag pricing in Kisumu'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {createdOrder ? (
            /* Order Success State */
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Order Tracking Number
                </span>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="text-3xl font-black text-slate-900 tracking-wider">
                    {createdOrder.orderNumber}
                  </span>
                  <button
                    onClick={handleCopyOrderNumber}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    title="Copy Tracking ID"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Keep this number to track your laundry live.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200/80 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between font-medium">
                  <span>Customer:</span>
                  <span className="font-bold text-slate-900">{createdOrder.customerName}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Phone:</span>
                  <span className="font-bold text-slate-900">{createdOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Location:</span>
                  <span className="font-bold text-slate-900">{createdOrder.customerEstate}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Window:</span>
                  <span className="font-bold text-sky-700">{createdOrder.pickupSlot}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">Total Payable:</span>
                  <span className="font-extrabold text-slate-900 text-base">
                    KES {createdOrder.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* M-Pesa Instructions Pill */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-left text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800 text-sm">
                  <span>M-Pesa Payment on Delivery / Pickup:</span>
                </p>
                <p>• Buy Goods Till: <strong>{MPESA_DETAILS.tillNumber}</strong></p>
                <p>• Name: <strong>{MPESA_DETAILS.recipientName}</strong></p>
                <p>• Amount: <strong>KES {createdOrder.totalAmount.toLocaleString()}</strong></p>
              </div>

              {/* WhatsApp Dispatch Button */}
              <div className="pt-2 space-y-2.5">
                <a
                  href={buildWhatsAppOrderLink(createdOrder, MPESA_DETAILS.supportWhatsApp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Send Ticket on WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close & View Storefront
                </button>
              </div>

            </div>
          ) : (
            /* Booking Form State */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Selected Items summary banner */}
              <div className="bg-sky-50 rounded-2xl p-3.5 border border-sky-100 flex items-center justify-between text-xs text-sky-900">
                <div>
                  <span className="font-bold">
                    {items.length} {items.length === 1 ? 'service item' : 'service items'} selected
                  </span>
                  <p className="text-[11px] text-sky-700">Doorstep pickup & delivery included</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-sky-600 uppercase font-semibold">Total</span>
                  <p className="text-base font-extrabold text-slate-900">
                    KES {totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victor Ogero"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-sm text-slate-800 transition-all"
                />
              </div>

              {/* WhatsApp Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  WhatsApp Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0712345678 or +254..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-sm text-slate-800 transition-all"
                />
                <p className="text-[11px] text-slate-400">
                  Used for pickup coordination & order progress updates.
                </p>
              </div>

              {/* Estate / Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    Estate / Zone in Kisumu <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={estate}
                    onChange={(e) => setEstate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-sm text-slate-800 bg-white transition-all"
                  >
                    {KISUMU_ESTATES.map((est) => (
                      <option key={est} value={est}>
                        {est}
                      </option>
                    ))}
                    <option value="Other Area">Other Area...</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Pickup Window <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-sm text-slate-800 bg-white transition-all"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {estate === 'Other Area' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Specify Area Name</label>
                  <input
                    type="text"
                    placeholder="Enter your area or neighborhood"
                    value={customEstate}
                    onChange={(e) => setCustomEstate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              )}

              {/* Landmark / Gate Details */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Landmark / House No. / Gate Directions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Mega City, Blue Gate, Apt 3B"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 text-sm text-slate-800"
                />
              </div>

              {/* Special Instructions */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Special Fabric / Washing Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Wash white collared shirts separately, mild scent..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-sky-500 text-sm text-slate-800 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || totalAmount === 0}
                  className="w-full py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 disabled:opacity-50 shadow-lg shadow-sky-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Confirm Pickup (Pay KES {totalAmount.toLocaleString()} on Delivery)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
