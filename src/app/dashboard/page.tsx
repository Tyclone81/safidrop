'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SafiStore, buildCustomerStatusWhatsAppLink, buildRiderDispatchWhatsAppLink } from '@/lib/store';
import { Order, OrderStatus, PaymentStatus, Laundromat, Rider } from '@/types';
import { SERVICES_CATALOG, KISUMU_ESTATES, TIME_SLOTS } from '@/data/pricing';
import { 
  Package, Bike, Building2, CheckCircle2, 
  Clock, MessageCircle, ArrowLeft, RefreshCw, 
  KeyRound, Search, Plus, ChevronRight, MapPin, 
  Calculator 
} from 'lucide-react';

export default function DashboardPage() {
  // Authentication Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Dashboard Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [laundromats, setLaundromats] = useState<Laundromat[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'partners' | 'riders' | 'economics'>('pipeline');
  
  // Pipeline Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals inside dashboard
  const [addLaundromatOpen, setAddLaundromatOpen] = useState(false);
  const [addRiderOpen, setAddRiderOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  // Simulator State
  const [simBagPrice, setSimBagPrice] = useState(900);
  const [simDiscountPercent, setSimDiscountPercent] = useState(30);
  const [simRiderFee, setSimRiderFee] = useState(150);
  const [simWeeklyBags, setSimWeeklyBags] = useState(100);

  // Load store data
  const loadData = () => {
    setOrders(SafiStore.getOrders());
    setLaundromats(SafiStore.getLaundromats());
    setRiders(SafiStore.getRiders());
  };

  useEffect(() => {
    // Check if session was authenticated
    const auth = sessionStorage.getItem('safidrop_ops_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    loadData();
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('safidrop_ops_auth', 'true');
      setPinError(false);
      loadData();
    } else {
      setPinError(true);
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('safidrop_ops_auth', 'true');
    loadData();
  };

  // Status advance helper
  const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
    pending_pickup: 'at_facility',
    at_facility: 'washing',
    washing: 'out_for_delivery',
    out_for_delivery: 'completed',
    completed: null,
    cancelled: null,
  };

  const handleAdvanceStatus = (order: Order) => {
    const next = nextStatusMap[order.status];
    if (next) {
      const updated = SafiStore.updateOrderStatus(
        order.id,
        next,
        `Status progressed to ${next.replace(/_/g, ' ').toUpperCase()} by founder`
      );
      if (updated) {
        loadData();
      }
    }
  };

  const handleTogglePayment = (order: Order) => {
    const newStatus: PaymentStatus = order.paymentStatus === 'paid' ? 'pending' : 'paid';
    const sampleReceipt = newStatus === 'paid' ? `MP${Date.now().toString().slice(-6)}` : undefined;
    const updated = SafiStore.updateOrderPayment(order.id, newStatus, sampleReceipt);
    if (updated) {
      loadData();
    }
  };

  const handleAssignLaundromat = (orderId: string, laundromatId: string) => {
    const updated = SafiStore.assignLaundromat(orderId, laundromatId);
    if (updated) {
      loadData();
    }
  };

  const handleAssignRider = (orderId: string, riderId: string) => {
    const updated = SafiStore.assignRider(orderId, riderId);
    if (updated) {
      loadData();
    }
  };

  // Metrics
  const metrics = SafiStore.getMetrics();

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.customerEstate.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Simulator Math
  const simRetailLaundryEquivalent = 750; // standard 6kg retail
  const simLaundromatCost = Math.round(simRetailLaundryEquivalent * (1 - simDiscountPercent / 100));
  const simGrossProfitPerBag = simBagPrice - simLaundromatCost - simRiderFee;
  const simWeeklyProfit = simGrossProfitPerBag * simWeeklyBags;
  const simMonthlyProfit = simWeeklyProfit * 4;

  // Render PIN Gate if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl p-8 text-white space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold">SafiDrop Command Center</h2>
            <p className="text-xs text-slate-400">
              Founder & Operations Access
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Security PIN (Default: 1234)
              </label>
              <input
                type="password"
                maxLength={8}
                placeholder="Enter 4-digit PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-center tracking-widest text-lg font-bold text-white focus:outline-none focus:border-sky-500"
              />
              {pinError && (
                <p className="text-xs text-rose-400 font-medium text-center pt-1">
                  Incorrect PIN. Please use 1234.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-500 text-white shadow-lg transition-all cursor-pointer"
            >
              Enter Dashboard
            </button>

            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Quick Demo Unlock (Skip PIN)
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-sky-400 hover:underline">
              ← Return to SafiDrop Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Return to Customer Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">
                  Safi<span className="text-sky-400">Drop</span> Ops
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Live Dispatch
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Kisumu Laundry Logistics Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                SafiStore.resetToDefault();
                loadData();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              title="Reset sample orders & partners"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>

            <button
              onClick={() => setCreateOrderOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Manual Booking
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        
        {/* KPI Financial Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          {/* Revenue */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Gross Revenue
            </span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              KES {metrics.grossRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{metrics.totalOrders} total orders</p>
          </div>

          {/* Laundromat Wholesale Cost */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Laundromat Payouts
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              KES {metrics.laundromatCosts.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">~35% B2B wholesale fee</p>
          </div>

          {/* Rider Logistics Cost */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Bodaboda Logistics
            </span>
            <div className="text-xl sm:text-2xl font-black text-sky-400 mt-1">
              KES {metrics.riderCosts.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">KES 150 per round-trip</p>
          </div>

          {/* Net Gross Profit */}
          <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl p-4 sm:p-5 col-span-2 sm:col-span-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Net Gross Profit
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              KES {metrics.netProfit.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-500/80 mt-0.5">
              {metrics.profitMargin}% gross margin
            </p>
          </div>

          {/* Active Orders Count */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 col-span-2 sm:col-span-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              In-Flight Pickups
            </span>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">
              {metrics.activeOrders} active
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{metrics.completedOrders} completed</p>
          </div>

        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'pipeline'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders Pipeline ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'partners'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Partner Laundromats ({laundromats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('riders')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'riders'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Bodaboda Riders ({riders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('economics')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'economics'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Unit Economics Simulator</span>
          </button>
        </div>

        {/* TAB 1: ORDERS PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
              
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search customer, phone, estate, or Order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'pending_pickup', label: 'Pending Pickup' },
                  { key: 'at_facility', label: 'At Facility' },
                  { key: 'washing', label: 'Washing' },
                  { key: 'out_for_delivery', label: 'Out for Delivery' },
                  { key: 'completed', label: 'Completed' },
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setStatusFilter(st.key)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === st.key
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Orders Table / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <Package className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">No Orders in this View</h3>
                <p className="text-xs text-slate-500">
                  Switch the status filter or click "Manual Booking" to register a pickup.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const isPaid = order.paymentStatus === 'paid';
                  const nextStatus = nextStatusMap[order.status];

                  return (
                    <div
                      key={order.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4"
                    >
                      {/* Top Row: IDs, Customer, Amount, Status */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
                        
                        <div className="flex items-start sm:items-center gap-3">
                          <span className="text-lg font-black font-mono text-sky-400">
                            {order.orderNumber}
                          </span>

                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                            order.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : order.status === 'washing'
                              ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                              : order.status === 'out_for_delivery'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-sky-950 text-sky-400 border border-sky-800'
                          }`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>

                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {order.pickupSlot}
                          </span>
                        </div>

                        {/* Customer & Pricing quick metrics */}
                        <div className="flex items-center gap-4 text-xs">
                          <div>
                            <span className="text-slate-500 block">Customer</span>
                            <strong className="text-white font-bold">{order.customerName}</strong>
                            <span className="text-slate-400 text-[11px] block">{order.customerEstate}</span>
                          </div>

                          <div className="text-right">
                            <span className="text-slate-500 block">Total Payable</span>
                            <span className="text-sm font-extrabold text-white">
                              KES {order.totalAmount.toLocaleString()}
                            </span>
                            <div className="text-[10px] text-emerald-400">
                              Profit: KES {order.netProfit.toLocaleString()}
                            </div>
                          </div>

                          <button
                            onClick={() => handleTogglePayment(order)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              isPaid
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                            title="Click to toggle M-Pesa payment status"
                          >
                            {isPaid ? `Paid (${order.mpesaReceipt || 'M-Pesa'})` : 'Payment Pending'}
                          </button>
                        </div>

                      </div>

                      {/* Middle Row: Items summary & assignments */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        
                        {/* Items */}
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Bags & Items
                          </span>
                          <div className="space-y-1 text-slate-300">
                            {order.items.map((i) => (
                              <div key={i.id} className="flex justify-between">
                                <span>{i.quantity}x {i.name}</span>
                                <span className="text-slate-400 font-mono">KES {i.totalPrice.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          {order.notes && (
                            <p className="text-[11px] text-amber-300/90 italic pt-1.5 border-t border-slate-800 mt-1.5">
                              Note: {order.notes}
                            </p>
                          )}
                        </div>

                        {/* Laundromat Partner */}
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Assigned Fulfillment Center
                          </span>
                          <select
                            value={order.laundromatId || ''}
                            onChange={(e) => handleAssignLaundromat(order.id, e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                          >
                            <option value="">Select Laundromat...</option>
                            {laundromats.map((lnd) => (
                              <option key={lnd.id} value={lnd.id}>
                                {lnd.name} ({(lnd.discountRate * 100).toFixed(0)}% wholesale off)
                              </option>
                            ))}
                          </select>
                          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                            <span>Laundromat Cost:</span>
                            <span className="font-mono text-amber-400">KES {order.laundromatCost.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Rider Dispatch */}
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Assigned Bodaboda Rider
                          </span>
                          <select
                            value={order.riderId || ''}
                            onChange={(e) => handleAssignRider(order.id, e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                          >
                            <option value="">Select Rider...</option>
                            {riders.map((rdr) => (
                              <option key={rdr.id} value={rdr.id}>
                                {rdr.name} - {rdr.zone} ({rdr.motorbikePlate})
                              </option>
                            ))}
                          </select>
                          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                            <span>Rider Trip Fee:</span>
                            <span className="font-mono text-sky-400">KES {order.riderCost.toLocaleString()}</span>
                          </div>
                        </div>

                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        
                        <div className="flex items-center gap-2">
                          {/* WhatsApp Customer Link */}
                          <a
                            href={buildCustomerStatusWhatsAppLink(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-800 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-emerald-400" />
                            <span>WhatsApp Customer</span>
                          </a>

                          {/* WhatsApp Rider Dispatch Link */}
                          {order.riderId && (
                            <a
                              href={buildRiderDispatchWhatsAppLink(
                                order,
                                riders.find((r) => r.id === order.riderId)?.phone || '254700000000'
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-400 bg-sky-950/60 hover:bg-sky-950 border border-sky-800 transition-colors"
                            >
                              <Bike className="w-3.5 h-3.5" />
                              <span>Dispatch Rider Ticket</span>
                            </a>
                          )}
                        </div>

                        {/* Advance Status Button */}
                        {nextStatus && (
                          <button
                            onClick={() => handleAdvanceStatus(order)}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 shadow-md shadow-sky-600/20 active:scale-95 transition-all cursor-pointer"
                          >
                            <span>Advance to {nextStatus.replace(/_/g, ' ').toUpperCase()}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {order.status === 'completed' && (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Order Successfully Fulfilled
                          </span>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: PARTNER LAUNDROMATS */}
        {activeTab === 'partners' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Partner Laundromats & Facilities</h3>
                <p className="text-xs text-slate-400">
                  Verified commercial fulfillment centers with wholesale rate contracts.
                </p>
              </div>
              <button
                onClick={() => setAddLaundromatOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Laundromat
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {laundromats.map((lnd) => (
                <div
                  key={lnd.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-white text-base">{lnd.name}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {lnd.location}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
                      {(lnd.discountRate * 100).toFixed(0)}% Off Wholesale
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contact Person:</span>
                      <strong className="text-white">{lnd.contactPerson}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <a href={`tel:${lnd.phone}`} className="text-sky-400 hover:underline">
                        {lnd.phone}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SLA Rating:</span>
                      <span className="text-amber-400 font-bold">★ {lnd.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RIDERS & LOGISTICS */}
        {activeTab === 'riders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Bodaboda Rider Fleet</h3>
                <p className="text-xs text-slate-400">
                  Dedicated local dispatch riders handling door-to-facility transit.
                </p>
              </div>
              <button
                onClick={() => setAddRiderOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Rider
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riders.map((rdr) => (
                <div
                  key={rdr.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-950 text-sky-400 flex items-center justify-center border border-sky-800">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-base">{rdr.name}</h4>
                        <p className="text-xs text-slate-400">Zone: {rdr.zone}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {rdr.motorbikePlate}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <a href={`tel:${rdr.phone}`} className="text-sky-400 hover:underline">
                        {rdr.phone}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payout per Trip:</span>
                      <strong className="text-white">KES {rdr.feePerTrip}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Completed Deliveries:</span>
                      <span className="text-emerald-400 font-bold">{rdr.completedTripsCount} trips</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: UNIT ECONOMICS SIMULATOR */}
        {activeTab === 'economics' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Asset-Light Business Model
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                SafiDrop Unit Economics Simulator
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Adjust pricing, wholesale discount margins, and customer bag targets to simulate monthly revenue and gross profits based on the validated math from your brainstorm.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sliders (Left 7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Standard Bag Price Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Customer Bag Price (Retail):</span>
                    <span className="text-sky-400 font-mono text-sm">KES {simBagPrice}</span>
                  </div>
                  <input
                    type="range"
                    min={700}
                    max={1500}
                    step={50}
                    value={simBagPrice}
                    onChange={(e) => setSimBagPrice(Number(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Recommended flat-rate for a ~7kg everyday wash & fold bag.
                  </p>
                </div>

                {/* Wholesale Discount % */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Negotiated Laundromat B2B Discount:</span>
                    <span className="text-amber-400 font-mono text-sm">{simDiscountPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={50}
                    step={5}
                    value={simDiscountPercent}
                    onChange={(e) => setSimDiscountPercent(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Wholesale concession from laundromat partner in exchange for guaranteed volume.
                  </p>
                </div>

                {/* Rider Fee */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Bodaboda Roundtrip Fee:</span>
                    <span className="text-sky-400 font-mono text-sm">KES {simRiderFee}</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={250}
                    step={25}
                    value={simRiderFee}
                    onChange={(e) => setSimRiderFee(Number(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Delivery logistics cost per bag round-trip (e.g. Milimani to CBD hub).
                  </p>
                </div>

                {/* Weekly Customers / Bags */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Weekly Bag Volume:</span>
                    <span className="text-emerald-400 font-mono text-sm">{simWeeklyBags} bags/wk</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={500}
                    step={10}
                    value={simWeeklyBags}
                    onChange={(e) => setSimWeeklyBags(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Number of laundry bags fulfilled per week (laundry is a recurring weekly habit).
                  </p>
                </div>

              </div>

              {/* Simulation Output Card (Right 5 cols) */}
              <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5">
                
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-800">
                  Per-Bag Economics Breakdown
                </h4>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between font-medium">
                    <span>Customer Pays:</span>
                    <strong className="text-white font-mono">KES {simBagPrice}</strong>
                  </div>
                  <div className="flex justify-between text-amber-400 font-medium">
                    <span>- Laundromat Wholesale Cost ({simDiscountPercent}% off KES 750):</span>
                    <strong className="font-mono">KES {simLaundromatCost}</strong>
                  </div>
                  <div className="flex justify-between text-sky-400 font-medium">
                    <span>- Bodaboda Roundtrip Fee:</span>
                    <strong className="font-mono">KES {simRiderFee}</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-emerald-400">
                    <span>Gross Profit per Bag:</span>
                    <strong className="font-mono">KES {simGrossProfitPerBag}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 space-y-3">
                  <div>
                    <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-bold block">
                      Estimated Monthly Gross Profit
                    </span>
                    <div className="text-3xl font-black text-white mt-1">
                      KES {simMonthlyProfit.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-emerald-400/80 mt-0.5">
                      at {simWeeklyBags} bags/week ({simWeeklyBags * 4} bags/month)
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    With zero equipment capital expenditure, zero electricity overhead, and zero full-time staff payroll!
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD LAUNDROMAT */}
      {addLaundromatOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-lg text-white">Add Partner Laundromat</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('lndName') as HTMLInputElement).value;
                const location = (form.elements.namedItem('lndLocation') as HTMLInputElement).value;
                const contact = (form.elements.namedItem('lndContact') as HTMLInputElement).value;
                const phone = (form.elements.namedItem('lndPhone') as HTMLInputElement).value;
                const discount = Number((form.elements.namedItem('lndDiscount') as HTMLInputElement).value) / 100;

                SafiStore.addLaundromat({
                  name,
                  location,
                  contactPerson: contact,
                  phone,
                  discountRate: discount || 0.30,
                });

                loadData();
                setAddLaundromatOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1">Facility Name</label>
                <input name="lndName" required placeholder="e.g. Kisumu Fresh Wash" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Location / Street</label>
                <input name="lndLocation" required placeholder="e.g. Ondiek / Near Poly" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Contact Person</label>
                  <input name="lndContact" required placeholder="Owner/Manager" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone</label>
                  <input name="lndPhone" required placeholder="+2547..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Agreed Wholesale Discount % (e.g. 35)</label>
                <input name="lndDiscount" type="number" defaultValue={30} min={10} max={60} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAddLaundromatOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-xl font-bold text-white">Save Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RIDER */}
      {addRiderOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-lg text-white">Add Bodaboda Rider</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('rdrName') as HTMLInputElement).value;
                const phone = (form.elements.namedItem('rdrPhone') as HTMLInputElement).value;
                const zone = (form.elements.namedItem('rdrZone') as HTMLInputElement).value;
                const plate = (form.elements.namedItem('rdrPlate') as HTMLInputElement).value;

                SafiStore.addRider({
                  name,
                  phone,
                  zone,
                  motorbikePlate: plate,
                  feePerTrip: 150,
                });

                loadData();
                setAddRiderOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1">Rider Name</label>
                <input name="rdrName" required placeholder="e.g. Kevin Otieno" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Phone Number</label>
                <input name="rdrPhone" required placeholder="+2547..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Operating Zone</label>
                  <input name="rdrZone" required placeholder="e.g. Milimani & CBD" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Motorbike Plate</label>
                  <input name="rdrPlate" required placeholder="KMDF 123A" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAddRiderOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-xl font-bold text-white">Save Rider</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL BOOKING */}
      {createOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4">
            <h3 className="font-bold text-lg text-white">Register Manual Phone/Walk-in Order</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('ordCustName') as HTMLInputElement).value;
                const phone = (form.elements.namedItem('ordCustPhone') as HTMLInputElement).value;
                const estate = (form.elements.namedItem('ordCustEstate') as HTMLSelectElement).value;
                const bagType = (form.elements.namedItem('ordBagType') as HTMLSelectElement).value;

                const svc = SERVICES_CATALOG.find((s) => s.id === bagType) || SERVICES_CATALOG[0];
                const total = svc.priceKES;
                const lndCost = svc.wholesaleEstKES;
                const rdrCost = 150;

                SafiStore.createOrder({
                  customerId: `cst-${Date.now()}`,
                  customerName: name,
                  customerPhone: phone,
                  customerEstate: estate,
                  items: [
                    {
                      id: `itm-${Date.now()}`,
                      serviceType: svc.id,
                      name: svc.name,
                      quantity: 1,
                      unitPrice: total,
                      totalPrice: total,
                      unitDescription: svc.capacityOrUnit,
                    },
                  ],
                  totalAmount: total,
                  laundromatCost: lndCost,
                  riderCost: rdrCost,
                  netProfit: total - lndCost - rdrCost,
                  status: 'pending_pickup',
                  paymentStatus: 'pending',
                  paymentMethod: 'mpesa',
                  pickupSlot: TIME_SLOTS[0],
                });

                loadData();
                setCreateOrderOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1">Customer Name</label>
                <input name="ordCustName" required placeholder="e.g. John Doe" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Customer Phone Number</label>
                <input name="ordCustPhone" required placeholder="07..." className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Estate</label>
                  <select name="ordCustEstate" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white">
                    {KISUMU_ESTATES.map((est) => (
                      <option key={est} value={est}>{est}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Package</label>
                  <select name="ordBagType" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white">
                    {SERVICES_CATALOG.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} (KES {s.priceKES})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCreateOrderOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-xl font-bold text-white">Register Pickup</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
