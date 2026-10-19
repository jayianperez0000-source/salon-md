import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Printer, 
  Phone,
  Trash2,
  Sparkles
} from 'lucide-react';
import { BookingRecord } from '../types';
import { BUSINESS_INFO } from '../data/salonData';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewBooking: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  onOpenNewBooking
}) => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const loadBookings = () => {
    try {
      const stored = localStorage.getItem('salon_md_bookings');
      if (stored) {
        setBookings(JSON.parse(stored));
      } else {
        setBookings([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadBookings();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      b.customer.mobile.toLowerCase().includes(q) ||
      b.customer.name.toLowerCase().includes(q)
    );
  });

  const handleCancelBooking = (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment reservation?')) {
      return;
    }
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b);
    setBookings(updated);
    localStorage.setItem('salon_md_bookings', JSON.stringify(updated));
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-300" />
              <span>My Appointments & Reservations</span>
            </h3>
            <p className="text-stone-300 text-xs">
              Check your scheduled slots, deposit payments, and booking receipts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Booking ID (e.g. SMD-2026-XXXX) or Mobile number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {bookings.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-lg font-bold text-stone-800">No Appointments Found</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                You haven&apos;t booked any appointment online yet. Use our booking system to reserve your slot with a simple down payment!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewBooking();
                }}
                className="px-5 py-2.5 bg-rose-800 text-white rounded-xl text-xs font-semibold hover:bg-rose-900 transition-colors shadow-sm"
              >
                Book Appointment Now
              </button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500">
              No reservation matches your search query.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    b.status === 'cancelled'
                      ? 'bg-stone-50 border-stone-200 opacity-60'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-stone-900">{b.id}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status === 'confirmed' ? 'Confirmed & Reserved' : b.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500">
                      Booked for: <strong className="text-stone-900">{b.date} @ {b.timeSlot}</strong>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid sm:grid-cols-2 gap-2 text-xs py-3 text-stone-600">
                    <div>
                      <span className="text-stone-400">Client:</span> {b.customer.name} ({b.customer.mobile})
                    </div>
                    <div>
                      <span className="text-stone-400">Specialist:</span> {b.stylist}
                    </div>
                    <div>
                      <span className="text-stone-400">Venue:</span> {b.venue === 'salon' ? 'Circle C Mall 2nd Floor' : `Home: ${b.homeAddress}`}
                    </div>
                    <div>
                      <span className="text-stone-400">Payment:</span> {b.paymentPlan === 'downpayment' ? '25% Down Payment' : 'Full Payment'} ({b.paymentMethod.toUpperCase()})
                    </div>
                  </div>

                  {/* Services summary */}
                  <div className="text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100 mb-3">
                    <span className="font-bold text-stone-700 block mb-1">Services Reserved:</span>
                    <div className="space-y-0.5 text-stone-600">
                      {b.services.map((s, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>• {s.name} (x{s.quantity})</span>
                          <span>₱{(s.price * s.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financials & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    <div className="text-xs">
                      <span className="text-stone-500">Deposit Paid: </span>
                      <strong className="text-emerald-700 font-bold">₱{b.paidAmount.toLocaleString()}</strong>
                      {b.balanceDue > 0 && (
                        <span className="ml-2 text-stone-500">
                          (Balance at salon: <strong className="text-rose-900">₱{b.balanceDue.toLocaleString()}</strong>)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-3 py-1.5 text-stone-400 hover:text-rose-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          Cancel Slot
                        </button>
                      )}

                      <a
                        href={`tel:${BUSINESS_INFO.contact.phone.replace(/[^0-9]/g, '')}`}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Call Salon
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Need to reschedule? Call front desk at (02) 8920-5542</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
