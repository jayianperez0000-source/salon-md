import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Home, 
  QrCode, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  AlertCircle,
  Phone,
  Mail,
  ChevronRight,
  Download
} from 'lucide-react';
import { ServiceItem, Stylist, BookingRecord, PaymentMethod, PaymentPlan } from '../types';
import { BUSINESS_INFO, STYLISTS_DATA, TIME_SLOTS } from '../data/salonData';
import { getStoredPaymentConfig, saveStoredBookings, getStoredBookings } from '../utils/storage';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  allServices: ServiceItem[];
  initialSelectedServices?: { [serviceId: string]: number };
  onBookingSuccess?: (booking: BookingRecord) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  allServices,
  initialSelectedServices = {},
  onBookingSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedServices, setSelectedServices] = useState<{ [serviceId: string]: number }>(initialSelectedServices);
  const [venue, setVenue] = useState<'salon' | 'home'>('salon');
  const [homeAddress, setHomeAddress] = useState('');
  const [stylistId, setStylistId] = useState('any');
  
  // Date & Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(defaultDateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1].time);

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientMobile, setClientMobile] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // Payment Selection
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('downpayment');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  // Confirmation State
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<'gcash' | 'maya' | ''>('');
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentConfig, setPaymentConfig] = useState(getStoredPaymentConfig());

  // Sync initial selections if modal opens with pre-selected items
  useEffect(() => {
    if (isOpen) {
      setPaymentConfig(getStoredPaymentConfig());
      if (Object.keys(initialSelectedServices).length > 0) {
        setSelectedServices(initialSelectedServices);
      }
      setErrorMsg('');
    }
  }, [isOpen, initialSelectedServices]);

  if (!isOpen) return null;

  // Selected items calculation
  const bookedItems = Object.entries(selectedServices)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const s = allServices.find(item => item.id === id);
      return s ? { service: s, qty } : null;
    })
    .filter((item): item is { service: ServiceItem; qty: number } => Boolean(item));

  const totalCount = bookedItems.reduce((acc, curr) => acc + curr.qty, 0);
  const subtotal = bookedItems.reduce((acc, curr) => acc + (curr.service.price * curr.qty), 0);
  const totalDuration = bookedItems.reduce((acc, curr) => acc + (curr.service.durationMinutes * curr.qty), 0);

  // Discounts
  const multiServiceDiscount = totalCount >= 3 ? Math.round(subtotal * 0.10) : 0;
  const fullPrepayDiscount = paymentPlan === 'full' ? Math.round((subtotal - multiServiceDiscount) * paymentConfig.prepayFullDiscountPercent) : 0;
  const totalDiscount = multiServiceDiscount + fullPrepayDiscount;
  const totalAmount = Math.max(0, subtotal - totalDiscount);

  // Down Payment calculation
  const downPaymentAmount = paymentPlan === 'downpayment'
    ? Math.max(200, Math.round(totalAmount * paymentConfig.downpaymentPercent))
    : totalAmount;
  const balanceDue = paymentPlan === 'downpayment' ? totalAmount - downPaymentAmount : 0;

  const hours = Math.floor(totalDuration / 60);
  const mins = totalDuration % 60;
  const durationFormatted = hours > 0 
    ? `${hours} hr${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} mins` : ''}`
    : `${mins} mins`;

  const selectedStylist = STYLISTS_DATA.find(s => s.id === stylistId) || STYLISTS_DATA[0];

  const handleUpdateQty = (id: string, delta: number) => {
    setSelectedServices(prev => {
      const current = prev[id] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: updated };
    });
  };

  const handleProceedToStep2 = () => {
    if (bookedItems.length === 0) {
      setErrorMsg('Please select at least one service to proceed.');
      return;
    }
    if (venue === 'home' && !homeAddress.trim()) {
      setErrorMsg('Please provide your complete residence address for Home Service.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleProceedToStep3 = () => {
    if (!selectedDate) {
      setErrorMsg('Please select your preferred appointment date.');
      return;
    }
    if (!selectedTimeSlot) {
      setErrorMsg('Please select a time slot.');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleProceedToStep4 = () => {
    if (!clientName.trim()) {
      setErrorMsg('Please provide your Full Name.');
      return;
    }
    if (!clientMobile.trim() || clientMobile.length < 10) {
      setErrorMsg('Please provide a valid 11-digit mobile contact number.');
      return;
    }
    setErrorMsg('');
    setStep(4);
  };

  const handleConfirmPaymentAndBook = () => {
    // Validation for online payment channels
    if (paymentMethod === 'gcash' || paymentMethod === 'maya' || paymentMethod === 'bank_transfer') {
      if (!referenceNumber.trim() || referenceNumber.length < 4) {
        setErrorMsg('Please enter the transaction reference / approval number from your payment app.');
        return;
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.length < 15) {
        setErrorMsg('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry.trim()) {
        setErrorMsg('Please enter card expiry date (MM/YY).');
        return;
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        setErrorMsg('Please enter a valid CVV.');
        return;
      }
    }

    const bookingId = `SMD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BookingRecord = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      services: bookedItems.map(item => ({
        id: item.service.id,
        name: item.service.name,
        price: item.service.price,
        quantity: item.qty,
        durationMinutes: item.service.durationMinutes
      })),
      stylist: selectedStylist.name,
      venue,
      homeAddress: venue === 'home' ? homeAddress : undefined,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      customer: {
        name: clientName,
        mobile: clientMobile,
        email: clientEmail,
        notes: clientNotes
      },
      subtotal,
      discount: totalDiscount,
      totalAmount,
      paymentPlan,
      paidAmount: downPaymentAmount,
      balanceDue,
      paymentMethod,
      paymentReference: referenceNumber || `CARD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'confirmed'
    };

    // Save to database
    try {
      const existingList = getStoredBookings();
      saveStoredBookings([newBooking, ...existingList]);
    } catch (e) {
      console.error('Failed to save booking to database', e);
    }

    setConfirmedBooking(newBooking);
    if (onBookingSuccess) {
      onBookingSuccess(newBooking);
    }
    setErrorMsg('');
    setStep(5);
  };

  const handleCopyReceipt = () => {
    if (!confirmedBooking) return;
    const msg = `🎉 Salon MD Booking Confirmed!
Booking ID: ${confirmedBooking.id}
Client: ${confirmedBooking.customer.name} (${confirmedBooking.customer.mobile})
Date & Time: ${confirmedBooking.date} @ ${confirmedBooking.timeSlot}
Stylist: ${confirmedBooking.stylist}
Venue: ${confirmedBooking.venue === 'salon' ? 'Circle C Mall, 2nd Floor, QC' : `Home Service: ${confirmedBooking.homeAddress}`}
Services: ${confirmedBooking.services.map(s => `${s.name} (x${s.quantity})`).join(', ')}
Deposit Paid: ₱${confirmedBooking.paidAmount.toLocaleString()} (${confirmedBooking.paymentMethod.toUpperCase()})
Remaining Balance at Salon: ₱${confirmedBooking.balanceDue.toLocaleString()}
Reference: ${confirmedBooking.paymentReference}

Thank you for choosing Salon MD! See you soon.`;

    navigator.clipboard.writeText(msg);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
                Online Reservation & Down Payment
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Salon MD Appointment Booking
            </h2>
            <p className="text-stone-300 text-xs">
              Circle C Mall, 2nd Floor · Instant Slot Guarantee with Down Payment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar (Steps 1-4) */}
        {step < 5 && (
          <div className="bg-stone-100 border-b border-stone-200 px-6 py-3 flex items-center justify-between text-xs font-semibold text-stone-600">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-rose-900 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-rose-800 text-white' : 'bg-stone-300 text-stone-700'}`}>1</span>
              <span className="hidden sm:inline">Services & Venue</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-rose-900 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-rose-800 text-white' : 'bg-stone-300 text-stone-700'}`}>2</span>
              <span className="hidden sm:inline">Date & Time</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-rose-900 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-rose-800 text-white' : 'bg-stone-300 text-stone-700'}`}>3</span>
              <span className="hidden sm:inline">Client Info</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-rose-900 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 4 ? 'bg-rose-800 text-white' : 'bg-stone-300 text-stone-700'}`}>4</span>
              <span className="hidden sm:inline">Online Down Payment</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ================= STEP 1: SERVICES & VENUE ================= */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Venue Selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 block">
                  1. Select Appointment Venue
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVenue('salon')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      venue === 'salon'
                        ? 'border-rose-800 bg-rose-50/60 ring-2 ring-rose-200'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                      <Building2 className="w-4 h-4 text-rose-800" />
                      <span>In-Salon Visit</span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1">2nd Floor, Circle C Mall, QC</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVenue('home')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      venue === 'home'
                        ? 'border-rose-800 bg-rose-50/60 ring-2 ring-rose-200'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                      <Home className="w-4 h-4 text-rose-800" />
                      <span>QC Home Service</span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1">We bring salon tools to your door</div>
                  </button>
                </div>

                {venue === 'home' && (
                  <div className="pt-2 animate-fade-in">
                    <label className="text-xs text-stone-700 font-semibold block mb-1">
                      Complete Home Address in Quezon City *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Unit 4B, Congressional Townhomes, Congressional Ave, Project 8, QC"
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                )}
              </div>

              {/* Stylist Selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 block">
                  2. Select Preferred Stylist or Specialist
                </label>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {STYLISTS_DATA.map((stylist) => (
                    <button
                      key={stylist.id}
                      type="button"
                      onClick={() => setStylistId(stylist.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                        stylistId === stylist.id
                          ? 'border-rose-800 bg-rose-50/50 ring-1 ring-rose-800'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-stone-900 text-xs sm:text-sm">{stylist.name}</div>
                        <div className="text-[11px] text-rose-800 font-semibold">{stylist.role}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{stylist.specialty}</div>
                      </div>
                      <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        ★ {stylist.rating}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Services List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-bold tracking-wider text-stone-500">
                    3. Selected Services ({totalCount})
                  </label>
                  <span className="text-xs text-stone-500">
                    Est. Duration: <strong>{durationFormatted}</strong>
                  </span>
                </div>

                {bookedItems.length === 0 ? (
                  <div className="p-6 text-center bg-stone-50 border border-dashed border-stone-300 rounded-2xl space-y-2">
                    <p className="text-xs text-stone-500">No services selected yet.</p>
                    <p className="text-xs text-stone-700 font-medium">Please select from our popular services below:</p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                    {bookedItems.map(({ service, qty }) => (
                      <div key={service.id} className="p-3.5 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-stone-900 text-sm truncate">{service.name}</div>
                          <div className="text-xs text-stone-500">
                            ₱{service.price.toLocaleString()} · {service.durationMinutes} mins
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                            <button
                              onClick={() => handleUpdateQty(service.id, -1)}
                              className="p-1 text-stone-600 hover:bg-stone-200"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold">{qty}</span>
                            <button
                              onClick={() => handleUpdateQty(service.id, 1)}
                              className="p-1 text-stone-600 hover:bg-stone-200"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="font-bold text-stone-900 text-sm w-16 text-right">
                            ₱{(service.price * qty).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Add Top Services Drawer */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-stone-700 block">Quick Add Popular Services:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allServices.slice(0, 6).map((service) => {
                      const isAdded = (selectedServices[service.id] || 0) > 0;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => handleUpdateQty(service.id, 1)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex flex-col justify-between ${
                            isAdded
                              ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                              : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span className="truncate">{service.name}</span>
                          <span className="text-[11px] text-stone-500 mt-1">
                            ₱{service.price.toLocaleString()} {isAdded && '✓'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: DATE & TIME SLOT ================= */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              {/* Date Selection */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 block">
                  Select Appointment Date
                </label>
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                      <Calendar className="w-4 h-4 text-rose-700" />
                      <span>Operating Days: Monday – Sunday</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Open daily during Circle C Mall hours (10:00 AM – 8:00 PM)
                    </p>
                  </div>

                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 shadow-2xs"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 block">
                  Select Available Time Slot for {selectedDate}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className="font-bold text-xs sm:text-sm">{slot.time}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-rose-200' : 'text-emerald-700'}`}>
                          Available Slot
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Appointment summary recap */}
              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 block">Assigned Specialist:</span>
                  <span className="font-bold text-stone-900">{selectedStylist.name}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Venue:</span>
                  <span className="font-bold text-stone-900">
                    {venue === 'salon' ? 'Circle C Mall 2nd Flr' : 'Home Service QC'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Total Duration:</span>
                  <span className="font-bold text-rose-900">~{durationFormatted}</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CLIENT DETAILS ================= */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Customer Contact Information
                </h3>
                <p className="text-xs text-stone-500">
                  We will send your digital confirmation receipt and SMS reminder to these contact details.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-rose-800" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maria Santos"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-rose-800" />
                    Mobile Number (Philippines) *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0917 123 4567"
                    value={clientMobile}
                    onChange={(e) => setClientMobile(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-800" />
                  Email Address (Optional for PDF Receipt)
                </label>
                <input
                  type="email"
                  placeholder="e.g. maria.santos@gmail.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Special Notes / Hair History / Beauty Preferences (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Bleached hair 6 months ago, prefer natural gel nail shade, sensitive underarms, etc."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 4: ONLINE PAYMENT & DOWN PAYMENT ================= */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              {/* Payment Plan Choice: Down Payment vs Full Payment */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 block">
                  1. Choose Payment Option
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentPlan('downpayment')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentPlan === 'downpayment'
                        ? 'border-rose-800 bg-rose-50/60 ring-2 ring-rose-200'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm">25% Down Payment</span>
                      <span className="text-[10px] uppercase font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">
                        Most Popular
                      </span>
                    </div>
                    <div className="text-xl font-serif font-bold text-rose-950 mt-1">
                      ₱{downPaymentAmount.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Pay small reservation deposit now. Remaining balance of <strong>₱{balanceDue.toLocaleString()}</strong> is settled at the salon counter.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPlan('full')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentPlan === 'full'
                        ? 'border-rose-800 bg-rose-50/60 ring-2 ring-rose-200'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm">Full Prepayment</span>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Save 5%
                      </span>
                    </div>
                    <div className="text-xl font-serif font-bold text-stone-900 mt-1">
                      ₱{totalAmount.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Settle 100% online now and enjoy a 5% prepayment bonus. Walk in & walk out stress-free!
                    </p>
                  </button>
                </div>
              </div>

              {/* Payment Channel Selector */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-500 block">
                  2. Select Philippine Payment Channel
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gcash')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'gcash'
                        ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 font-bold text-blue-900'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-blue-600">GCash</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Instant QR / Mobile</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('maya')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'maya'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 font-bold text-emerald-900'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-emerald-600">Maya</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">QR Ph / Wallet</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-stone-900 bg-stone-100 ring-1 ring-stone-900 font-bold text-stone-900'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-stone-800">Card</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Visa / Mastercard</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-amber-700 bg-amber-50/60 ring-1 ring-amber-700 font-bold text-amber-900'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-amber-800">Bank Transfer</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">BDO / BPI Online</div>
                  </button>
                </div>
              </div>

              {/* Payment Details Container */}
              <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
                {/* GCASH DETAILS */}
                {paymentMethod === 'gcash' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-stone-200">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-28 h-28 rounded-xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center p-1.5 text-center overflow-hidden bg-white shadow-2xs">
                          {paymentConfig.gcash.qrImage ? (
                            <img
                              src={paymentConfig.gcash.qrImage}
                              alt="GCash QR Code"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <>
                              <QrCode className="w-12 h-12 text-blue-600" />
                              <span className="text-[9px] font-bold text-blue-700 mt-1">SCAN GCASH</span>
                            </>
                          )}
                        </div>
                        {paymentConfig.gcash.qrImage && (
                          <a
                            href={paymentConfig.gcash.qrImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            download="Salon_MD_GCash_QR.png"
                            className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 mt-1.5"
                          >
                            <Download className="w-3 h-3" />
                            <span>Save / View QR</span>
                          </a>
                        )}
                      </div>
                      <div className="space-y-1 text-xs sm:text-sm text-stone-700 w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-600 uppercase">Merchant GCash Account</span>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            0% Extra Fee
                          </span>
                        </div>
                        <div className="font-bold text-stone-900">{paymentConfig.gcash.merchantName}</div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-stone-900 font-bold">{paymentConfig.gcash.accountNumber}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(paymentConfig.gcash.accountNumber.replace(/[^0-9]/g, ''));
                              setCopiedNumber('gcash');
                              setTimeout(() => setCopiedNumber(''), 2000);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold transition-colors border border-stone-200"
                            title="Copy number to clipboard"
                          >
                            {copiedNumber === 'gcash' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-stone-500" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-xs text-stone-500">Amount to send: <strong className="text-rose-900">₱{downPaymentAmount.toLocaleString()}</strong></div>
                        <div className="text-[11px] text-stone-400 italic pt-0.5">{paymentConfig.gcash.qrNote}</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        GCash Reference No. / Ref ID (9-13 Digits) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 9028 1402 8591"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">
                        Enter the reference number from your GCash confirmation SMS or transaction receipt.
                      </p>
                    </div>
                  </div>
                )}

                {/* MAYA DETAILS */}
                {paymentMethod === 'maya' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-stone-200">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-28 h-28 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center p-1.5 text-center overflow-hidden bg-white shadow-2xs">
                          {paymentConfig.maya.qrImage ? (
                            <img
                              src={paymentConfig.maya.qrImage}
                              alt="Maya QR Code"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <>
                              <QrCode className="w-12 h-12 text-emerald-600" />
                              <span className="text-[9px] font-bold text-emerald-700 mt-1">SCAN MAYA QR</span>
                            </>
                          )}
                        </div>
                        {paymentConfig.maya.qrImage && (
                          <a
                            href={paymentConfig.maya.qrImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            download="Salon_MD_Maya_QR.png"
                            className="text-[10px] text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1 mt-1.5"
                          >
                            <Download className="w-3 h-3" />
                            <span>Save / View QR</span>
                          </a>
                        )}
                      </div>
                      <div className="space-y-1 text-xs sm:text-sm text-stone-700 w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-600 uppercase">Maya / QR Ph Merchant</span>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Bayanihan QR Ph
                          </span>
                        </div>
                        <div className="font-bold text-stone-900">{paymentConfig.maya.merchantName}</div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-stone-900 font-bold">{paymentConfig.maya.accountNumber}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(paymentConfig.maya.accountNumber.replace(/[^0-9]/g, ''));
                              setCopiedNumber('maya');
                              setTimeout(() => setCopiedNumber(''), 2000);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold transition-colors border border-stone-200"
                            title="Copy number to clipboard"
                          >
                            {copiedNumber === 'maya' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-stone-500" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-xs text-stone-500">Amount to send: <strong className="text-rose-900">₱{downPaymentAmount.toLocaleString()}</strong></div>
                        <div className="text-[11px] text-stone-400 italic pt-0.5">{paymentConfig.maya.qrNote}</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Maya Reference No. / Transaction ID *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MYA-98124018"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* CARD DETAILS */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 animate-fade-in">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Cardholder Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. MARIA SANTOS"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">16-Digit Card Number *</label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4123 4567 8901 2345"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Expiry (MM/YY) *</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">CVV / CVC *</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* BANK TRANSFER DETAILS */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-stone-200">
                      <div>
                        <span className="font-bold text-amber-900 block">BDO Unibank</span>
                        <span className="text-stone-500 block">Acct: {paymentConfig.bank.bdo.accountName}</span>
                        <span className="font-mono font-bold text-stone-800">{paymentConfig.bank.bdo.accountNumber}</span>
                      </div>
                      <div>
                        <span className="font-bold text-red-900 block">BPI (Bank of the Philippine Islands)</span>
                        <span className="text-stone-500 block">Acct: {paymentConfig.bank.bpi.accountName}</span>
                        <span className="font-mono font-bold text-stone-800">{paymentConfig.bank.bpi.accountNumber}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Bank Transfer Reference / Trace No. *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. BDO-TRX-5912401"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Summary Box */}
              <div className="p-4 bg-stone-100 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Services Subtotal:</span>
                  <span className="font-semibold text-stone-900">₱{subtotal.toLocaleString()}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discounts Applied:</span>
                    <span>-₱{totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Grand Total Cost:</span>
                  <span className="font-semibold text-stone-900">₱{totalAmount.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-sm">
                  <span className="text-rose-900">
                    {paymentPlan === 'downpayment' ? 'Down Payment Charged Now:' : 'Total Amount Paid Now:'}
                  </span>
                  <span className="text-xl font-serif text-rose-950">
                    ₱{downPaymentAmount.toLocaleString()}
                  </span>
                </div>
                {paymentPlan === 'downpayment' && (
                  <div className="text-[11px] text-stone-500 flex justify-between pt-1">
                    <span>Remaining Balance at Circle C Counter:</span>
                    <span className="font-bold text-stone-700">₱{balanceDue.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 5: CONFIRMATION & RECEIPT ================= */}
          {step === 5 && confirmedBooking && (
            <div className="space-y-6 text-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  APPOINTMENT RESERVED & CONFIRMED
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
                  We look forward to pampering you!
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                  Your appointment slot has been locked with Salon MD Circle C Mall. An SMS confirmation will be sent to <strong>{confirmedBooking.customer.mobile}</strong>.
                </p>
              </div>

              {/* Printable Receipt Card */}
              <div className="bg-white border-2 border-dashed border-stone-300 rounded-3xl p-6 text-left space-y-4 shadow-sm max-w-xl mx-auto">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-stone-900">Salon MD</h4>
                    <span className="text-xs text-stone-500">Circle C Mall, 2nd Floor, Quezon City</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Booking Reference</span>
                    <span className="font-mono font-bold text-sm text-rose-900">{confirmedBooking.id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block">Client Name</span>
                    <span className="font-bold text-stone-900">{confirmedBooking.customer.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Contact</span>
                    <span className="font-bold text-stone-900">{confirmedBooking.customer.mobile}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Schedule</span>
                    <span className="font-bold text-stone-900">{confirmedBooking.date} @ {confirmedBooking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Assigned Specialist</span>
                    <span className="font-bold text-stone-900">{confirmedBooking.stylist}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 block">Venue</span>
                    <span className="font-bold text-stone-900">
                      {confirmedBooking.venue === 'salon' 
                        ? 'Circle C Mall, 2nd Floor (Beside Central Escalator)' 
                        : `Home Service: ${confirmedBooking.homeAddress}`}
                    </span>
                  </div>
                </div>

                {/* Services itemized */}
                <div className="pt-3 border-t border-stone-100">
                  <span className="text-[11px] uppercase font-bold text-stone-400 block mb-1.5">Reserved Services:</span>
                  <div className="space-y-1 text-xs">
                    {confirmedBooking.services.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-stone-700">
                        <span>• {item.name} (x{item.quantity})</span>
                        <span className="font-semibold">₱{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial breakdown */}
                <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <span>Total Service Value:</span>
                    <span>₱{confirmedBooking.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Online Down Payment Paid ({confirmedBooking.paymentMethod.toUpperCase()}):</span>
                    <span>₱{confirmedBooking.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-800 font-bold pt-1 border-t border-stone-100 text-sm">
                    <span>Balance Due on Visit:</span>
                    <span className="text-rose-900">₱{confirmedBooking.balanceDue.toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 italic pt-1">
                    Payment Ref: {confirmedBooking.paymentReference}
                  </div>
                </div>
              </div>

              {/* Action buttons on receipt */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleCopyReceipt}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors shadow-2xs"
                >
                  {copiedReceipt ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-600" />
                      <span>Copy Booking Details</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors shadow-2xs"
                >
                  <Printer className="w-4 h-4 text-stone-600" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-xs font-semibold text-white transition-colors shadow-sm"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer (Steps 1-4) */}
        {step < 5 && (
          <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setStep((prev) => (prev - 1) as any);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                type="button"
                onClick={handleProceedToStep2}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm ml-auto"
              >
                <span>Continue to Date & Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleProceedToStep3}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm ml-auto"
              >
                <span>Continue to Client Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleProceedToStep4}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm ml-auto"
              >
                <span>Proceed to Online Down Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={handleConfirmPaymentAndBook}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs sm:text-sm font-bold transition-colors shadow-md ml-auto"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₱{downPaymentAmount.toLocaleString()} & Confirm Booking</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
