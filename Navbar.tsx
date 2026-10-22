import React, { useState } from 'react';
import { Sparkles, Phone, Clock, MapPin, Menu, X, ShoppingBag, GraduationCap, ChevronRight, Calendar, BookmarkCheck, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../data/salonData';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenProposal: () => void;
  onOpenBooking: () => void;
  onOpenMyBookings: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onOpenCart, 
  onOpenProposal,
  onOpenBooking,
  onOpenMyBookings,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Service Catalog', href: '#catalog' },
    { label: 'Monthly Promos', href: '#promos' },
    { label: 'Photo Gallery', href: '#gallery' },
    { label: 'Home Service', href: '#home-service' },
    { label: 'Location & Floor Guide', href: '#location' },
    { label: 'FAQs', href: '#faqs' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Banner */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-stone-300">
              5 Years of Trusted Beauty Care · 2nd Floor, Circle C Mall, Quezon City
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-stone-300 hover:text-rose-300 transition-colors font-medium bg-stone-800/80 hover:bg-stone-800 px-2.5 py-0.5 rounded-full border border-stone-700/60"
              title="Admin & Database Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin Portal</span>
            </button>
            <span className="hidden sm:inline text-stone-600">|</span>
            <button
              onClick={onOpenMyBookings}
              className="inline-flex items-center gap-1.5 text-rose-300 hover:text-white transition-colors font-medium"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Track My Bookings</span>
            </button>
            <span className="hidden sm:inline text-stone-600">|</span>
            <span className="flex items-center gap-1 text-stone-300">
              <Clock className="w-3 h-3 text-rose-400" />
              Mall Hours: {BUSINESS_INFO.operatingHours.weekdays}
            </span>
            <span className="hidden sm:inline text-stone-600">|</span>
            <button
              onClick={onOpenProposal}
              className="inline-flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors font-medium underline-offset-4 hover:underline"
            >
              <GraduationCap className="w-3.5 h-3.5 text-rose-400" />
              <span>BSIT Proposal Specs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-stone-900 to-rose-950 flex items-center justify-center text-white shadow-md border border-rose-900/20 group-hover:scale-105 transition-transform">
              <span className="font-serif font-bold text-xl tracking-tight text-rose-100">MD</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-rose-900 transition-colors">
                  Salon MD
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  Circle C Mall
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">Hair · Nails · Lashes · Massage · Home Service</p>
            </div>
          </a>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-stone-600 hover:text-rose-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pamper Basket / Package Calculator Trigger */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs sm:text-sm font-semibold transition-colors border border-stone-200"
              aria-label="Open Pamper Package Calculator"
            >
              <Sparkles className="w-4 h-4 text-rose-700" />
              <span className="hidden xl:inline">Package Basket</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-rose-700 text-white rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* NEW: Book Appointment Button with Down Payment */}
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm border border-stone-800"
              title="Salon MD Admin Portal (Database, Bookings & QR)"
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>Admin Portal</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 lg:hidden rounded-lg hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-rose-900"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-800 text-white text-xs font-bold"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment (Online Down Payment)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyBookings();
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold"
            >
              <BookmarkCheck className="w-4 h-4 text-rose-700" />
              <span>Track My Existing Reservations</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-900 text-stone-200 hover:text-white text-xs font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>Admin & Staff Portal (Manage DB & QR)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProposal();
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-50 text-stone-600 text-xs font-medium"
            >
              <GraduationCap className="w-4 h-4 text-stone-500" />
              <span>View BSIT Capstone Proposal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

