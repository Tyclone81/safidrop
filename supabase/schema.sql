-- =========================================================================
-- SAFIDROP KENYA: DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- The "Glovo for Laundry" Marketplace Data Model
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL, -- Primary customer WhatsApp key
    full_name VARCHAR(150) NOT NULL,
    estate VARCHAR(100) NOT NULL,            -- e.g. "Milimani", "Tom Mboya", "Poly"
    landmark TEXT,                           -- Directions or apartment number
    total_orders INT DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for instant phone number lookups
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone_number);

-- 2. PARTNER LAUNDROMATS TABLE
CREATE TABLE IF NOT EXISTS public.laundromats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150),
    phone_number VARCHAR(20) NOT NULL,
    agreed_discount_rate NUMERIC(4, 2) DEFAULT 0.30 NOT NULL, -- e.g. 0.30 for 30% discount
    active_orders_count INT DEFAULT 0,
    sla_rating NUMERIC(3, 2) DEFAULT 5.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BODABODA RIDERS TABLE
CREATE TABLE IF NOT EXISTS public.riders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    zone VARCHAR(100) NOT NULL,              -- e.g. "Milimani & CBD", "Poly & Migosi"
    motorbike_plate VARCHAR(20) NOT NULL,
    fee_per_trip NUMERIC(8, 2) DEFAULT 150.00 NOT NULL, -- KES 150 per round-trip
    active_trips_count INT DEFAULT 0,
    completed_trips_count INT DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE
CREATE TYPE order_status_enum AS ENUM (
    'pending_pickup',
    'at_facility',
    'washing',
    'out_for_delivery',
    'completed',
    'cancelled'
);

CREATE TYPE payment_status_enum AS ENUM (
    'pending',
    'paid'
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL, -- e.g. "SD-101"
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_estate VARCHAR(100) NOT NULL,
    customer_landmark TEXT,
    
    -- Financials (KES)
    total_amount NUMERIC(10, 2) NOT NULL,       -- Total customer fee (e.g. KES 900)
    laundromat_cost NUMERIC(10, 2) NOT NULL,    -- Wholesale B2B rate (e.g. KES 525)
    rider_cost NUMERIC(10, 2) DEFAULT 150.00,   -- Bodaboda fee (KES 150)
    net_profit NUMERIC(10, 2) NOT NULL,         -- Gross margin (e.g. KES 225)
    
    -- Status & Payments
    status order_status_enum DEFAULT 'pending_pickup' NOT NULL,
    payment_status payment_status_enum DEFAULT 'pending' NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'mpesa',
    mpesa_receipt VARCHAR(50),
    
    -- Operational assignments
    laundromat_id UUID REFERENCES public.laundromats(id) ON DELETE SET NULL,
    rider_id UUID REFERENCES public.riders(id) ON DELETE SET NULL,
    pickup_slot VARCHAR(100) NOT NULL,
    delivery_slot VARCHAR(100),
    special_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);

-- 5. ORDER ITEMS TABLE (Bags & Garment breakdown)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL, -- 'standard_bag', 'family_bag', 'wash_iron', 'duvet', 'suit'
    item_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

-- 6. ORDER STATUS AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.order_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    status order_status_enum NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- SAMPLE SEED DATA
-- =========================================================================

INSERT INTO public.laundromats (business_name, location, contact_person, phone_number, agreed_discount_rate)
VALUES 
('Xpress Laundromat Milimani', 'Milimani / Ring Road, Kisumu', 'Faith Akoth', '+254712345678', 0.35),
('Lake Basin Eco Cleaners', 'Near Kisumu National Poly, Ondiek', 'David Omondi', '+254723456789', 0.30),
('CBD Sparkle Wash & Dry Cleaners', 'Oginga Odinga Street, CBD', 'Sarah Wanjiku', '+254734567890', 0.30)
ON CONFLICT DO NOTHING;

INSERT INTO public.riders (full_name, phone_number, zone, motorbike_plate, fee_per_trip)
VALUES 
('Otieno Juma', '+254790112233', 'Milimani & CBD', 'KMDF 342B', 150.00),
('Brian Ochieng', '+254798445566', 'Poly & Tom Mboya', 'KMCE 819A', 150.00)
ON CONFLICT DO NOTHING;
