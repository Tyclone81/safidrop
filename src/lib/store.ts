'use client';

import { Order, OrderStatus, PaymentStatus, Laundromat, Rider } from '@/types';
import { INITIAL_ORDERS, INITIAL_LAUNDROMATS, INITIAL_RIDERS } from '@/data/mockData';

const STORAGE_KEYS = {
  ORDERS: 'safidrop_orders_v1',
  LAUNDROMATS: 'safidrop_laundromats_v1',
  RIDERS: 'safidrop_riders_v1',
  CUSTOMERS: 'safidrop_customers_v1',
};

// Safe localStorage helper
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export const SafiStore = {
  getOrders(): Order[] {
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  getOrderById(idOrNumber: string): Order | undefined {
    const orders = this.getOrders();
    const cleanQuery = idOrNumber.trim().toUpperCase();
    return orders.find(
      (o) => o.id === idOrNumber || o.orderNumber.toUpperCase() === cleanQuery
    );
  },

  getOrdersByPhone(phone: string): Order[] {
    const orders = this.getOrders();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return orders.filter((o) => {
      const orderPhone = o.customerPhone.replace(/[^0-9]/g, '');
      return orderPhone.includes(cleanPhone) || cleanPhone.includes(orderPhone);
    });
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'history'>): Order {
    const orders = this.getOrders();
    const newSeq = 100 + orders.length + 1;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `SD-${newSeq}`,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          status: orderData.status || 'pending_pickup',
          timestamp: now,
          note: 'Order submitted successfully via SafiDrop Storefront.',
        },
      ],
    };

    const updated = [newOrder, ...orders];
    setStored(STORAGE_KEYS.ORDERS, updated);
    return newOrder;
  },

  updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order | undefined {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) return undefined;

    const now = new Date().toISOString();
    const order = orders[index];
    const defaultNote = `Status changed to ${newStatus.replace(/_/g, ' ').toUpperCase()}`;

    const updatedOrder: Order = {
      ...order,
      status: newStatus,
      updatedAt: now,
      history: [
        ...order.history,
        {
          status: newStatus,
          timestamp: now,
          note: note || defaultNote,
        },
      ],
    };

    orders[index] = updatedOrder;
    setStored(STORAGE_KEYS.ORDERS, orders);
    return updatedOrder;
  },

  updateOrderPayment(orderId: string, paymentStatus: PaymentStatus, mpesaReceipt?: string): Order | undefined {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) return undefined;

    orders[index] = {
      ...orders[index],
      paymentStatus,
      mpesaReceipt: mpesaReceipt || orders[index].mpesaReceipt,
      updatedAt: new Date().toISOString(),
    };

    setStored(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },

  assignLaundromat(orderId: string, laundromatId: string): Order | undefined {
    const orders = this.getOrders();
    const laundromats = this.getLaundromats();
    const lnd = laundromats.find((l) => l.id === laundromatId);
    if (!lnd) return undefined;

    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return undefined;

    orders[index] = {
      ...orders[index],
      laundromatId: lnd.id,
      laundromatName: lnd.name,
      updatedAt: new Date().toISOString(),
    };

    setStored(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },

  assignRider(orderId: string, riderId: string): Order | undefined {
    const orders = this.getOrders();
    const riders = this.getRiders();
    const rider = riders.find((r) => r.id === riderId);
    if (!rider) return undefined;

    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return undefined;

    orders[index] = {
      ...orders[index],
      riderId: rider.id,
      riderName: rider.name,
      updatedAt: new Date().toISOString(),
    };

    setStored(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },

  getLaundromats(): Laundromat[] {
    return getStored<Laundromat[]>(STORAGE_KEYS.LAUNDROMATS, INITIAL_LAUNDROMATS);
  },

  addLaundromat(data: Omit<Laundromat, 'id' | 'activeOrdersCount' | 'rating'>): Laundromat {
    const list = this.getLaundromats();
    const newLnd: Laundromat = {
      ...data,
      id: `lnd-${Date.now()}`,
      activeOrdersCount: 0,
      rating: 5.0,
    };
    const updated = [...list, newLnd];
    setStored(STORAGE_KEYS.LAUNDROMATS, updated);
    return newLnd;
  },

  getRiders(): Rider[] {
    return getStored<Rider[]>(STORAGE_KEYS.RIDERS, INITIAL_RIDERS);
  },

  addRider(data: Omit<Rider, 'id' | 'activeTripsCount' | 'completedTripsCount'>): Rider {
    const list = this.getRiders();
    const newRider: Rider = {
      ...data,
      id: `rdr-${Date.now()}`,
      activeTripsCount: 0,
      completedTripsCount: 0,
    };
    const updated = [...list, newRider];
    setStored(STORAGE_KEYS.RIDERS, updated);
    return newRider;
  },

  getMetrics() {
    const orders = this.getOrders();
    const totalOrders = orders.length;
    const activeOrders = orders.filter(
      (o) => o.status !== 'completed' && o.status !== 'cancelled'
    ).length;
    const completedOrders = orders.filter((o) => o.status === 'completed').length;

    const grossRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const laundromatCosts = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.laundromatCost, 0);

    const riderCosts = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.riderCost, 0);

    const netProfit = grossRevenue - laundromatCosts - riderCosts;
    const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0';

    return {
      totalOrders,
      activeOrders,
      completedOrders,
      grossRevenue,
      laundromatCosts,
      riderCosts,
      netProfit,
      profitMargin,
    };
  },

  resetToDefault() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.LAUNDROMATS);
    localStorage.removeItem(STORAGE_KEYS.RIDERS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
  },
};

// WhatsApp message helper utilities
export function formatPhoneNumberForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (!cleaned.startsWith('254') && cleaned.length === 9) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

export function buildWhatsAppOrderLink(order: Order, businessNumber: string = '254700000000'): string {
  const targetNumber = formatPhoneNumberForWhatsApp(businessNumber);
  const itemsText = order.items
    .map((item) => `• ${item.quantity}x ${item.name} (KES ${item.totalPrice.toLocaleString()})`)
    .join('\n');

  const text = `🧺 *SAFIDROP LAUNDRY ORDER BOOKING*
*Tracking ID:* ${order.orderNumber}

*Customer Details:*
• Name: ${order.customerName}
• Phone: ${order.customerPhone}
• Estate / Area: ${order.customerEstate}${order.customerLandmark ? ` (${order.customerLandmark})` : ''}
• Pickup Window: ${order.pickupSlot}

*Items:*
${itemsText}

*Total Payable:* KES ${order.totalAmount.toLocaleString()}
*Payment Method:* M-Pesa (${order.paymentStatus.toUpperCase()})
${order.notes ? `*Special Notes:* ${order.notes}\n` : ''}
Please confirm my pickup!`;

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
}

export function buildCustomerStatusWhatsAppLink(order: Order): string {
  const targetNumber = formatPhoneNumberForWhatsApp(order.customerPhone);
  
  const statusMessages: Record<OrderStatus, string> = {
    pending_pickup: `Habari ${order.customerName}! Your SafiDrop laundry order *${order.orderNumber}* is received. Rider ${order.riderName || 'on duty'} is scheduled to pick up at ${order.customerEstate} during your selected window: ${order.pickupSlot}. 🧺`,
    at_facility: `Hello ${order.customerName}! Your laundry bag *${order.orderNumber}* has safely arrived at our partner facility (${order.laundromatName || 'Facility Center'}) and is being sorted for care. ✨`,
    washing: `Good news ${order.customerName}! Your clothes *${order.orderNumber}* are currently in the wash & conditioning cycle. We ensure top fabric care & hygiene standards! 🧼`,
    out_for_delivery: `Great news ${order.customerName}! Your laundry *${order.orderNumber}* is fresh, crisp-folded, and out for delivery with rider ${order.riderName || 'our rider'}. Please have your phone ready! 🛵💨`,
    completed: `Thank you for choosing SafiDrop ${order.customerName}! Your order *${order.orderNumber}* has been successfully delivered. We hope you enjoy fresh, effortless laundry. Reply with 5 if you loved our service! ⭐⭐⭐⭐⭐`,
    cancelled: `Hello ${order.customerName}, your SafiDrop order *${order.orderNumber}* has been cancelled. Please let us know if you need any assistance!`,
  };

  const message = statusMessages[order.status] || `Update regarding your SafiDrop order ${order.orderNumber}.`;
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

export function buildRiderDispatchWhatsAppLink(order: Order, riderPhone: string): string {
  const targetNumber = formatPhoneNumberForWhatsApp(riderPhone);
  const itemsSummary = order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ');

  const text = `🛵 *SAFIDROP BODABODA DISPATCH TICKET*
*Order:* ${order.orderNumber}

*Pickup Location:*
• Customer: ${order.customerName}
• Phone: ${order.customerPhone}
• Estate / Address: ${order.customerEstate}
• Landmark / Directions: ${order.customerLandmark || 'N/A'}
• Time Window: ${order.pickupSlot}

*Items:* ${itemsSummary}
*Drop-off Facility:* ${order.laundromatName || 'Nearest Partner Laundromat'}
*Rider Fee:* KES 150 (Round-trip)

Please contact the customer before arriving!`;

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
}
