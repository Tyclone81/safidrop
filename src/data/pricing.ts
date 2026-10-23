import { ServicePricing } from '@/types';

export const SERVICES_CATALOG: ServicePricing[] = [
  {
    id: 'standard_bag',
    name: 'Standard Wash & Fold Bag',
    category: 'Wash & Fold',
    description: 'Everyday clothes, T-shirts, trousers, shorts, socks & intimates. Washed, dried, and neatly packed.',
    capacityOrUnit: 'Holds ~7 kg (approx. 30-35 items)',
    priceKES: 900,
    wholesaleEstKES: 525,
    popular: true,
  },
  {
    id: 'family_bag',
    name: 'Family Wash & Fold Bag',
    category: 'Wash & Fold',
    description: 'Ideal for multi-person households, bulky week loads, bedsheets, and bathroom towels.',
    capacityOrUnit: 'Holds ~12 kg (approx. 55-65 items)',
    priceKES: 1500,
    wholesaleEstKES: 875,
  },
  {
    id: 'wash_iron',
    name: 'Executive Wash & Crisp Press',
    category: 'Wash & Iron',
    description: 'Crisp pressed office shirts, trousers, suits & formal dresses on hangers or folded.',
    capacityOrUnit: 'Per item',
    priceKES: 250,
    wholesaleEstKES: 150,
  },
  {
    id: 'duvet',
    name: 'Heavy Duvet / Blanket Wash',
    category: 'Specialty',
    description: 'Deep sanitary machine wash & high-temp spin drying for thick king/queen duvets and fleece blankets.',
    capacityOrUnit: 'Per piece',
    priceKES: 800,
    wholesaleEstKES: 480,
  },
  {
    id: 'suit',
    name: '2-Piece Suit (Dry Clean / Steam)',
    category: 'Specialty',
    description: 'Delicate stain removal, gentle fabric treatment, and precision steam press.',
    capacityOrUnit: 'Per 2-piece set',
    priceKES: 800,
    wholesaleEstKES: 500,
  },
  {
    id: 'curtains',
    name: 'Curtains & Drapes Care',
    category: 'Specialty',
    description: 'Dust extraction, gentle wash, and anti-crease drying for home or office drapery.',
    capacityOrUnit: 'Per large panel',
    priceKES: 300,
    wholesaleEstKES: 180,
  },
];

export const KISUMU_ESTATES = [
  'Milimani',
  'CBD / Town',
  'Tom Mboya',
  'Poly / Ondiek Estate',
  'Riat Hills',
  'Mamboleo',
  'Migosi',
  'Kondele',
  'Kibos',
  'Nyalenda',
  'Manyatta',
  'Kanyakwar',
];

export const TIME_SLOTS = [
  'Morning Window (08:00 AM - 11:00 AM)',
  'Midday Window (11:30 AM - 02:30 PM)',
  'Evening Window (03:30 PM - 06:30 PM)',
  'Next Day Morning (08:00 AM - 11:00 AM)',
];

export const MPESA_DETAILS = {
  businessNumber: '522522', // Example Paybill or Till
  accountPrefix: 'SAFI',
  tillNumber: '894210',
  recipientName: 'SafiDrop Laundry Logistics',
  supportWhatsApp: '+254700000000', // Configurable
  supportDisplayPhone: '+254 700 000 000',
};
