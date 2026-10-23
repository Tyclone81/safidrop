import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SafiDrop | Doorstep Laundry Pickup & Delivery in Kisumu',
  description:
    'The Glovo for Laundry. Fast door-to-door laundry pickup & delivery in Kisumu. Flat-rate bags, zero door scales, 24-48h turnaround, and M-Pesa convenience.',
  keywords: [
    'laundry pickup Kisumu',
    'dry cleaning Kisumu',
    'laundromat delivery Milimani',
    'wash and fold Kisumu',
    'SafiDrop laundry',
    'glovo for laundry kenya',
  ],
  authors: [{ name: 'SafiDrop Logistics' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white text-slate-900 antialiased font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
