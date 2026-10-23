export type ServiceType = 
  | 'standard_bag' 
  | 'family_bag' 
  | 'wash_iron' 
  | 'duvet' 
  | 'suit' 
  | 'curtains';

export type OrderStatus = 
  | 'pending_pickup' 
  | 'at_facility' 
  | 'washing' 
  | 'out_for_delivery' 
  | 'completed' 
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid';
export type PaymentMethod = 'mpesa' | 'cash';

export interface OrderItem {
  id: string;
  serviceType: ServiceType;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitDescription?: string;
}

export interface StatusHistory {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "SD-1042"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEstate: string;
  customerLandmark?: string;
  items: OrderItem[];
  totalAmount: number;
  laundromatCost: number; // Wholesale fulfillment cost
  riderCost: number;      // Bodaboda round-trip delivery fee
  netProfit: number;      // totalAmount - laundromatCost - riderCost
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  mpesaReceipt?: string;
  laundromatId?: string;
  laundromatName?: string;
  riderId?: string;
  riderName?: string;
  pickupSlot: string;
  deliverySlot?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  history: StatusHistory[];
}

export interface Laundromat {
  id: string;
  name: string;
  location: string;
  contactPerson: string;
  phone: string;
  discountRate: number; // e.g., 0.30 for 30% wholesale discount
  activeOrdersCount: number;
  rating: number;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  zone: string;
  motorbikePlate: string;
  feePerTrip: number; // e.g., KES 150
  activeTripsCount: number;
  completedTripsCount: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  estate: string;
  landmark?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface ServicePricing {
  id: ServiceType;
  name: string;
  category: 'Wash & Fold' | 'Wash & Iron' | 'Specialty';
  description: string;
  capacityOrUnit: string;
  priceKES: number;
  wholesaleEstKES: number; // Partner cost estimate
  popular?: boolean;
}
