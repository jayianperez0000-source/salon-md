import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PromotionsSection } from './components/PromotionsSection';
import { ServiceCatalog } from './components/ServiceCatalog';
import { GallerySection } from './components/GallerySection';
import { HomeServiceSection } from './components/HomeServiceSection';
import { LocationHoursSection } from './components/LocationHoursSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { PackageCalculatorModal } from './components/PackageCalculatorModal';
import { ProposalInfoModal } from './components/ProposalInfoModal';
import { BookingModal } from './components/BookingModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { SERVICES_DATA } from './data/salonData';
import { BookingRecord } from './types';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [selectedServices, setSelectedServices] = useState<{ [serviceId: string]: number }>({});
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  
  // Booking System States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreselected, setBookingPreselected] = useState<{ [serviceId: string]: number }>({});
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const cartCount = Object.values(selectedServices).reduce((sum, qty) => sum + qty, 0);

  const handleUpdateQuantity = (serviceId: string, delta: number) => {
    setSelectedServices(prev => {
      const current = prev[serviceId] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      }
      return { ...prev, [serviceId]: updated };
    });
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(prev => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });
  };

  const handleClearAll = () => {
    setSelectedServices({});
  };

  // Direct Book Service from Catalog Card
  const handleDirectBookService = (serviceId: string) => {
    setBookingPreselected({ [serviceId]: 1 });
    setIsBookingOpen(true);
  };

  // Direct Book Promo from Promotions Card
  const handleSelectPromo = (promoId: string) => {
    let items: { [id: string]: number } = {};
    if (promoId === 'promo-rebond-glow') {
      items = { 'hair-rebonding': 1 };
    } else if (promoId === 'promo-mom-me') {
      items = { 'classic-mani-pedi': 2 };
    } else if (promoId === 'promo-lash-brow') {
      items = { 'lash-lift-tint': 1, 'eyebrow-threading': 1 };
    } else if (promoId === 'promo-total-relax') {
      items = { 'massage-swedish-full': 1, 'foot-spa-scrub': 1 };
    }
    setBookingPreselected(items);
    setIsBookingOpen(true);
  };

  // Transition from Pamper Package Basket to Booking
  const handleProceedFromPackageToBooking = (packageItems: { [id: string]: number }) => {
    setBookingPreselected(packageItems);
    setIsCalculatorOpen(false);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-800 selection:bg-rose-100 selection:text-rose-900">
      {/* Navigation */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCalculatorOpen(true)}
        onOpenProposal={() => setIsProposalOpen(true)}
        onOpenBooking={() => {
          setBookingPreselected(selectedServices);
          setIsBookingOpen(true);
        }}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreCatalog={() => {
            const el = document.getElementById('catalog');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenBooking={() => {
            setBookingPreselected(selectedServices);
            setIsBookingOpen(true);
          }}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Priority: Must — Promotions Section */}
        <PromotionsSection onSelectPromo={handleSelectPromo} />

        {/* Priority: Must — Categorized Service Catalog */}
        <ServiceCatalog
          selectedServices={selectedServices}
          onUpdateQuantity={handleUpdateQuantity}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onBookService={handleDirectBookService}
        />

        {/* Priority: Should — Photo Gallery */}
        <GallerySection />

        {/* Home Service Feature from Proposal Background */}
        <HomeServiceSection onOpenCalculator={() => setIsCalculatorOpen(true)} />

        {/* Priority: Must — Location and Mall Floor Guide */}
        <LocationHoursSection />

        {/* FAQs */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer 
        onOpenProposal={() => setIsProposalOpen(true)} 
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Interactive Pamper Package Calculator Modal */}
      <PackageCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        selectedServices={selectedServices}
        allServices={SERVICES_DATA}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveService={handleRemoveService}
        onClearAll={handleClearAll}
        onProceedToBooking={handleProceedFromPackageToBooking}
      />

      {/* Full Booking System Modal with Down Payment */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        allServices={SERVICES_DATA}
        initialSelectedServices={bookingPreselected}
        onBookingSuccess={() => {
          // Keep state refreshed
        }}
      />

      {/* My Bookings Tracker & Receipt Viewer */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        onOpenNewBooking={() => {
          setBookingPreselected({});
          setIsBookingOpen(true);
        }}
      />

      {/* Academic Proposal Specs Modal */}
      <ProposalInfoModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
      />

      {/* Staff & Admin Management Portal (CRUD, DB & Custom QR Code) */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        allServices={SERVICES_DATA}
      />

      {/* Floating Admin & Database Portal Quick Access Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-stone-900/95 hover:bg-stone-900 text-stone-200 hover:text-white shadow-xl border border-stone-700/80 backdrop-blur-md text-xs font-bold transition-all hover:scale-105"
          title="Staff & Admin Portal (CRUD & QR Settings)"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span>Admin Portal</span>
        </button>
      </div>
    </div>
  );
}
