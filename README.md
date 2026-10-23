# 🧺 SafiDrop: On-Demand Laundry Logistics Marketplace
> **"Glovo for Laundry"** — Doorstep laundry pickup, commercial partner washing, and express return across Kisumu, Kenya.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 The Business Model (Asset-Light B2B2C)

1. **The Standard Bag Model**: No weighing scales at the customer's door. Customers pay a flat fee per bag (e.g. Standard Bag at KES 900 for ~7kg). If the drawstring closes, that is the price.
2. **Wholesale Partner Fulfillment**: Existing local commercial laundromats (e.g., in Milimani, CBD, Poly) process the clothes with a negotiated **30% - 40% wholesale discount** in exchange for guaranteed bulk volume.
3. **Bodaboda Logistics**: Local riders handle the round-trip pickup and delivery for a predictable flat fee (e.g. KES 150/trip).
4. **Unit Economics**:
   - Customer Pays: **KES 900**
   - Laundromat Cost: **KES 525** (~30% off KES 750 retail)
   - Bodaboda Rider: **KES 150**
   - **Net Gross Profit per Bag**: **KES 225**
   - At **100 bags/week** = **KES 90,000 / month** in net gross profit with zero machinery capex, zero rent overhead, and zero full-time staff!

---

## 🚀 Key Modules Implemented

### 1. Digital Storefront (`/`)
- **Hero & Trust Guarantees**: Turnaround window (24 - 48h), M-Pesa verified, SLA fabric safety guarantee.
- **Interactive Bag Calculator**: Add Standard Bags, Family Bags, Office Shirts (Crisp Press), Heavy Duvets, and Suits. Instant total tally in KES.
- **Doorstep Booking Modal**: Captures Customer Name, WhatsApp Phone, Estate (Milimani, CBD, Tom Mboya, Poly, Riat, etc.), Landmark, and Pickup Time Window.
- **Instant WhatsApp Order Ticket**: Generates a pre-filled WhatsApp message with the order spec directly to the founder's phone.
- **Live Order Tracker Modal**: Enter an Order Number (e.g. `SD-101`) or phone number to view live progress through 5 status milestones.
- **How It Works**: 4-step visual guide.
- **Partner Laundromat Section**: Pitch & onboarding lead form for facility owners to join the network.

### 2. Operations Command Center (`/dashboard`)
- **Passcode Protected**: PIN gate (Default PIN: `1234` or click "Quick Demo Unlock").
- **Financial Metric Cards**: Real-time Gross Revenue, Laundromat Payouts, Rider Costs, Net Gross Profit, and Active Pickups.
- **Orders Pipeline (Kanban & Table Views)**:
  - 5 Status Stages: `Pending Pickup` ➡️ `At Facility` ➡️ `Washing` ➡️ `Out for Delivery` ➡️ `Completed`.
  - **1-Click Status Advance**: Progresses orders through each stage with automated audit history.
  - **One-Click WhatsApp Customer**: Direct link pre-filled with customer's specific order status.
  - **One-Click Rider Dispatch**: Sends pickup ticket with directions and contact info to the rider.
  - **M-Pesa Payment Toggle**: Toggle `Pending` ⇄ `Paid` with receipt number tracking.
- **Partner Laundromats Tab**: Manage partner facilities, contact persons, locations, and discount rates.
- **Riders & Fleet Tab**: Manage bodaboda riders, operating zones, and motorbike plate numbers.
- **Unit Economics Simulator**: Interactive sliders adjusting Bag Price, Wholesale Discount %, Rider Fees, and Weekly Volume to project weekly & monthly profits.

### 3. Dedicated Tracking Page (`/track`)
- Direct tracking URL with query param support: `/track?id=SD-101`.
- Clean progress timeline with timestamps and dispatcher contact button.

### 4. Supabase PostgreSQL Schema (`supabase/schema.sql`)
- Production-ready schema with tables for `customers`, `laundromats`, `riders`, `orders`, `order_items`, and `order_history`.
- Foreign keys, custom ENUMs (`order_status_enum`, `payment_status_enum`), indexes, and initial seeds.

---

## 🛠️ Quick Start

```bash
# Navigate to the project directory
cd /home/vogero/Documents/safidrop

# Install dependencies (already completed)
npm install

# Run the local development server
npm run dev

# Open your browser
# Storefront: http://localhost:3000
# Ops Dashboard: http://localhost:3000/dashboard (PIN: 1234)
# Tracker: http://localhost:3000/track?id=SD-101
```

---

## 🚢 Free Cloud Deployment (Vercel + Supabase)

1. **Deploy Frontend to Vercel**:
   ```bash
   npx vercel
   ```
2. **Database (Supabase)**:
   - Create a free Supabase project at [supabase.com](https://supabase.com).
   - In the Supabase SQL Editor, paste the contents of `supabase/schema.sql` and run it.
