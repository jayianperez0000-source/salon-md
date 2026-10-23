import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
    KeyRound, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  QrCode, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Search, 
  Filter, 
  Sparkles, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  LogOut, 
  FileSpreadsheet, 
  FileText,
  Save,
  Building2,
  Home
} from 'lucide-react';
import { BookingRecord, PaymentGatewayConfig, ServiceItem, Stylist } from '../types';
import { BUSINESS_INFO, STYLISTS_DATA, TIME_SLOTS } from '../data/salonData';
import { 
  getStoredBookings, 
  saveStoredBookings, 
  getStoredPaymentConfig, 
  saveStoredPaymentConfig, 
  isAdminAuthenticated, 
  setAdminAuthenticated, 
  exportBookingsToCSV,
  INITIAL_SEED_BOOKINGS 
} from '../utils/storage';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  allServices: ServiceItem[];
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  allServices
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'appointments' | 'payments' | 'database'>('appointments');

  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [stylistFilter, setStylistFilter] = useState('all');

  // Edit / Add modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // New manual booking form state
  const [newClientName, setNewClientName] = useState('');
  const [newClientMobile, setNewClientMobile] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newVenue, setNewVenue] = useState<'salon' | 'home'>('salon');
  const [newHomeAddress, setNewHomeAddress] = useState('');
  const [newStylist, setNewStylist] = useState(STYLISTS_DATA[0].name);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTimeSlot, setNewTimeSlot] = useState(TIME_SLOTS[0].time);
  const [newSelectedServiceIds, setNewSelectedServiceIds] = useState<{ [id: string]: number }>({
    'hair-cut-wash': 1
  });
  const [newPaidDeposit, setNewPaidDeposit] = useState<number>(100);
  const [newPaymentChannel, setNewPaymentChannel] = useState<'cash' | 'gcash' | 'maya' | 'card'>('cash');
  const [newNotes, setNewNotes] = useState('');

  // Payment Config state
  const [paymentConfig, setPaymentConfig] = useState<PaymentGatewayConfig>(getStoredPaymentConfig());
  const [paymentSavedMessage, setPaymentSavedMessage] = useState(false);

  // Refresh bookings from storage
  const loadData = () => {
    setBookings(getStoredBookings());
    setPaymentConfig(getStoredPaymentConfig());
    setIsAuthenticated(isAdminAuthenticated());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Filtered Bookings calculation (Direct computation without hooks)
  const filteredBookings = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (stylistFilter !== 'all' && b.stylist !== stylistFilter) return false;
    if (dateFilter && b.date !== dateFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = b.customer.name.toLowerCase().includes(q);
      const matchesMobile = b.customer.mobile.toLowerCase().includes(q);
      const matchesId = b.id.toLowerCase().includes(q);
      const matchesRef = b.paymentReference.toLowerCase().includes(q);
      if (!matchesName && !matchesMobile && !matchesId && !matchesRef) return false;
    }
    return true;
  });

  // Authentication logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = passwordInput.trim().toLowerCase();
    // Default PIN: "salonmd2026" or "admin" or "salonmd"
    if (pin === 'salonmd2026' || pin === 'admin' || pin === 'salonmd' || pin === 'salon' || pin === '1234') {
      setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setAuthError('');
      loadData();
    } else {
      setAuthError('Incorrect Password. Use default PIN: salonmd2026');
    }
  };

  const handleQuickLogin = () => {
    setPasswordInput('salonmd2026');
    setAdminAuthenticated(true);
    setIsAuthenticated(true);
    setAuthError('');
    loadData();
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Status updates
  const handleUpdateStatus = (bookingId: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        // If marked completed, we can also set balance due to 0
        const isCompleted = newStatus === 'completed';
        return {
          ...b,
          status: newStatus,
          balanceDue: isCompleted ? 0 : b.balanceDue,
          internalNotes: isCompleted 
            ? `${b.internalNotes || ''} (Completed & balance settled at salon)`.trim()
            : b.internalNotes
        };
      }
      return b;
    });
    setBookings(updated);
    saveStoredBookings(updated);
  };

  // Delete appointment
  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm(`Are you sure you want to permanently delete booking ${bookingId}?`)) {
      const updated = bookings.filter(b => b.id !== bookingId);
      setBookings(updated);
      saveStoredBookings(updated);
    }
  };

  // Edit appointment save
  const handleSaveEditedBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    const updated = bookings.map(b => b.id === editingBooking.id ? editingBooking : b);
    setBookings(updated);
    saveStoredBookings(updated);
    setIsEditing(false);
    setEditingBooking(null);
  };

  // Create manual booking
  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientMobile.trim()) {
      alert('Please enter client name and phone number');
      return;
    }

    const serviceList = Object.entries(newSelectedServiceIds)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const s = allServices.find(item => item.id === id);
        return s ? {
          id: s.id,
          name: s.name,
          price: s.price,
          quantity: qty,
          durationMinutes: s.durationMinutes
        } : null;
      })
      .filter(Boolean) as any[];

    if (serviceList.length === 0) {
      alert('Please select at least one service');
      return;
    }

    const subtotal = serviceList.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const balanceDue = Math.max(0, subtotal - newPaidDeposit);
    const bookingId = `SMD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRec: BookingRecord = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      services: serviceList,
      stylist: newStylist,
      venue: newVenue,
      homeAddress: newVenue === 'home' ? newHomeAddress : undefined,
      date: newDate,
      timeSlot: newTimeSlot,
      customer: {
        name: newClientName,
        mobile: newClientMobile,
        email: newClientEmail,
        notes: newNotes
      },
      subtotal,
      discount: 0,
      totalAmount: subtotal,
      paymentPlan: balanceDue === 0 ? 'full' : 'downpayment',
      paidAmount: newPaidDeposit,
      balanceDue,
      paymentMethod: (newPaymentChannel === 'cash' ? 'bank_transfer' : newPaymentChannel) as any,
      paymentReference: `MANUAL-${newPaymentChannel.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'confirmed',
      internalNotes: `Manual walk-in/phone booking recorded by admin. Paid ₱${newPaidDeposit} via ${newPaymentChannel}.`
    };

    const updated = [newRec, ...bookings];
    setBookings(updated);
    saveStoredBookings(updated);
    setIsNewBookingModalOpen(false);
    // Reset form
    setNewClientName('');
    setNewClientMobile('');
    setNewNotes('');
  };

  // Payment Config file upload (Base64)
  const handleQrUpload = (channel: 'gcash' | 'maya', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPaymentConfig(prev => ({
        ...prev,
        [channel]: {
          ...prev[channel],
          qrImage: base64String
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSavePaymentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredPaymentConfig(paymentConfig);
    setPaymentSavedMessage(true);
    setTimeout(() => setPaymentSavedMessage(false), 3000);
  };

  // Database Backup / Restore
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      bookings,
      paymentConfig
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Salon_MD_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.bookings && Array.isArray(parsed.bookings)) {
          setBookings(parsed.bookings);
          saveStoredBookings(parsed.bookings);
        }
        if (parsed.paymentConfig) {
          setPaymentConfig(parsed.paymentConfig);
          saveStoredPaymentConfig(parsed.paymentConfig);
        }
        alert('Database backup restored successfully!');
      } catch (err) {
        alert('Invalid JSON backup file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToSample = () => {
    if (window.confirm('Reset database to default sample appointments?')) {
      setBookings(INITIAL_SEED_BOOKINGS);
      saveStoredBookings(INITIAL_SEED_BOOKINGS);
    }
  };

  // Financial Analytics
  const totalRevenueDeposits = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.paidAmount : 0), 0);
  const totalBalancePending = bookings.reduce((sum, b) => sum + (b.status === 'confirmed' ? b.balanceDue : 0), 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = bookings.filter(b => b.date === todayStr && b.status !== 'cancelled').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4 flex flex-col max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-stone-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-900/70 border border-rose-500/30 flex items-center justify-center text-rose-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Salon MD Admin Portal
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Circle C Mall Staff
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Appointments Database · Online Payments & QR Management · Client Records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition-colors border border-stone-800"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-16 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center shadow-sm">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Admin Sign-In
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Enter your Salon MD administrative password to access the database and payment configuration.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Admin Password (Default: salonmd2026)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-rose-800 hover:bg-rose-900 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
              >
                Access Admin Dashboard
              </button>

              <button
                type="button"
                onClick={handleQuickLogin}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs transition-colors border border-stone-200 flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-rose-700" />
                <span>One-Click Manager Sign-in (Auto PIN: salonmd2026)</span>
              </button>

              <div className="text-[11px] text-stone-400">
                Authorized salon reception & managerial staff only. Default PIN: <strong>salonmd2026</strong>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs */}
            <div className="bg-stone-100 border-b border-stone-200 px-6 py-2 flex items-center justify-between overflow-x-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'appointments'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Appointments ({bookings.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'payments'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Code & Payment Setup</span>
                </button>

                <button
                  onClick={() => setActiveTab('database')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'database'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Database & Export</span>
                </button>
              </div>

              {/* Action: Add Walk-in Booking */}
              {activeTab === 'appointments' && (
                <button
                  onClick={() => setIsNewBookingModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold transition-colors shadow-sm ml-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Walk-in / Phone Booking</span>
                </button>
              )}
            </div>

            {/* TAB 1: APPOINTMENTS VIEW */}
            {activeTab === 'appointments' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 bg-[#FAF7F2] border border-stone-200 rounded-2xl">
                    <span className="text-[11px] uppercase font-bold text-stone-500 block">Total Active Bookings</span>
                    <span className="font-serif text-2xl font-bold text-stone-900">{bookings.length}</span>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">{confirmedCount} Confirmed Slots</div>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border border-stone-200 rounded-2xl">
                    <span className="text-[11px] uppercase font-bold text-stone-500 block">Today&apos;s Appointments</span>
                    <span className="font-serif text-2xl font-bold text-rose-950">{todayCount}</span>
                    <div className="text-[11px] text-stone-500 font-medium mt-0.5">Circle C Mall 2nd Floor</div>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border border-stone-200 rounded-2xl">
                    <span className="text-[11px] uppercase font-bold text-stone-500 block">Deposits Collected</span>
                    <span className="font-serif text-2xl font-bold text-emerald-800">₱{totalRevenueDeposits.toLocaleString()}</span>
                    <div className="text-[11px] text-stone-500 font-medium mt-0.5">Via GCash, Maya & Card</div>
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border border-stone-200 rounded-2xl">
                    <span className="text-[11px] uppercase font-bold text-stone-500 block">Pending Salon Balances</span>
                    <span className="font-serif text-2xl font-bold text-stone-900">₱{totalBalancePending.toLocaleString()}</span>
                    <div className="text-[11px] text-stone-500 font-medium mt-0.5">Due upon client arrival</div>
                  </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-stone-50 p-3.5 sm:p-4 rounded-2xl border border-stone-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-5 relative">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by client name, mobile (09XX), booking ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-900"
                      >
                        <option value="all">Status: All Appointments</option>
                        <option value="confirmed">Confirmed / Reserved</option>
                        <option value="completed">Completed & Paid</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-2.5 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-900"
                        title="Filter by appointment date"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                          setDateFilter('');
                          setStylistFilter('all');
                        }}
                        className="w-full px-3 py-2 bg-white border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => exportBookingsToCSV(bookings)}
                        className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                        title="Export to Excel / CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden xl:inline">Excel</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Appointments Table */}
                {filteredBookings.length === 0 ? (
                  <div className="p-12 text-center bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                    <Calendar className="w-10 h-10 text-stone-400 mx-auto" />
                    <h4 className="font-serif font-bold text-stone-800">No Appointments Match Your Search</h4>
                    <p className="text-xs text-stone-500">Try adjusting your filters or search keywords.</p>
                  </div>
                ) : (
                  <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                          <tr>
                            <th className="p-3.5">Ref ID & Date</th>
                            <th className="p-3.5">Client & Contact</th>
                            <th className="p-3.5">Venue & Specialist</th>
                            <th className="p-3.5">Services</th>
                            <th className="p-3.5">Deposit / Balance</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-stone-50/70 transition-colors">
                              {/* Ref ID & Date */}
                              <td className="p-3.5 align-top">
                                <span className="font-mono font-bold text-rose-950 block">{b.id}</span>
                                <div className="text-[11px] text-stone-800 font-semibold mt-0.5">
                                  {b.date}
                                </div>
                                <div className="text-[10px] text-stone-500 font-medium flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-stone-400" />
                                  {b.timeSlot}
                                </div>
                              </td>

                              {/* Client & Contact */}
                              <td className="p-3.5 align-top">
                                <div className="font-bold text-stone-900 text-sm">{b.customer.name}</div>
                                <a 
                                  href={`tel:${b.customer.mobile.replace(/[^0-9]/g, '')}`} 
                                  className="text-[11px] text-rose-800 hover:underline flex items-center gap-1 font-medium mt-0.5"
                                >
                                  <Phone className="w-3 h-3" />
                                  {b.customer.mobile}
                                </a>
                                {b.customer.email && (
                                  <div className="text-[10px] text-stone-400 truncate max-w-[150px]">{b.customer.email}</div>
                                )}
                              </td>

                              {/* Venue & Stylist */}
                              <td className="p-3.5 align-top">
                                <div className="font-semibold text-stone-800 flex items-center gap-1">
                                  {b.venue === 'salon' ? (
                                    <>
                                      <Building2 className="w-3.5 h-3.5 text-stone-500" />
                                      <span>2nd Flr Circle C</span>
                                    </>
                                  ) : (
                                    <>
                                      <Home className="w-3.5 h-3.5 text-rose-700" />
                                      <span className="text-rose-900">QC Home Service</span>
                                    </>
                                  )}
                                </div>
                                <div className="text-[11px] text-stone-500 mt-0.5">
                                  Stylist: <strong>{b.stylist}</strong>
                                </div>
                                {b.venue === 'home' && b.homeAddress && (
                                  <div className="text-[10px] text-stone-400 truncate max-w-[140px]" title={b.homeAddress}>
                                    📍 {b.homeAddress}
                                  </div>
                                )}
                              </td>

                              {/* Services */}
                              <td className="p-3.5 align-top">
                                <div className="space-y-0.5 max-w-[180px]">
                                  {b.services.map((s, idx) => (
                                    <div key={idx} className="text-[11px] text-stone-700 truncate">
                                      • {s.name} {s.quantity > 1 ? `(x${s.quantity})` : ''}
                                    </div>
                                  ))}
                                </div>
                                {b.customer.notes && (
                                  <div className="text-[10px] text-stone-500 italic mt-1 line-clamp-1">
                                    Note: {b.customer.notes}
                                  </div>
                                )}
                              </td>

                              {/* Payment info */}
                              <td className="p-3.5 align-top">
                                <div className="text-[11px] text-emerald-700 font-bold">
                                  Paid: ₱{b.paidAmount.toLocaleString()}
                                </div>
                                {b.balanceDue > 0 ? (
                                  <div className="text-[10px] text-rose-800 font-bold">
                                    Due: ₱{b.balanceDue.toLocaleString()}
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded font-bold">
                                    Fully Paid
                                  </span>
                                )}
                                <div className="text-[10px] text-stone-400 uppercase mt-0.5">
                                  {b.paymentMethod} · {b.paymentReference.slice(-8)}
                                </div>
                              </td>

                              {/* Status Badge */}
                              <td className="p-3.5 align-top">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${
                                  b.status === 'confirmed'
                                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                    : b.status === 'completed'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                    : 'bg-rose-100 text-rose-900 border border-rose-200'
                                }`}>
                                  {b.status === 'confirmed' ? 'Reserved' : b.status}
                                </span>
                              </td>

                              {/* Action controls */}
                              <td className="p-3.5 align-top text-right space-y-1">
                                <div className="flex items-center justify-end gap-1">
                                  {b.status !== 'completed' && (
                                    <button
                                      onClick={() => handleUpdateStatus(b.id, 'completed')}
                                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold"
                                      title="Mark as Completed & Settle Balance"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      setEditingBooking(b);
                                      setIsEditing(true);
                                    }}
                                    className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold"
                                    title="Edit Appointment Details"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteBooking(b.id)}
                                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-700 hover:bg-rose-50 text-xs transition-colors"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: QR CODE & PAYMENT CONFIGURATION */}
            {activeTab === 'payments' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                        Online Payment & QR Code Management
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-500">
                        Upload your real salon GCash & Maya QR codes and customize merchant numbers. Free and instant!
                      </p>
                    </div>

                    {paymentSavedMessage && (
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 animate-fade-in border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        Saved & Applied Live!
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSavePaymentConfig} className="space-y-8">
                    {/* GCASH QR CONFIGURATION */}
                    <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-sm space-y-5">
                      <div className="flex items-center gap-2.5 text-blue-900 font-bold border-b border-stone-100 pb-3">
                        <QrCode className="w-5 h-5 text-blue-600" />
                        <span className="font-serif text-lg">GCash Merchant & QR Code</span>
                      </div>

                      <div className="grid md:grid-cols-12 gap-6 items-start">
                        {/* QR Image Box */}
                        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-3">
                          <span className="text-xs uppercase font-bold text-stone-500">Active GCash QR Preview</span>
                          <div className="w-36 h-36 bg-white p-2 rounded-xl border border-stone-300 shadow-2xs flex items-center justify-center overflow-hidden">
                            {paymentConfig.gcash.qrImage ? (
                              <img
                                src={paymentConfig.gcash.qrImage}
                                alt="GCash QR"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <QrCode className="w-20 h-20 text-blue-600" />
                            )}
                          </div>

                          <label className="cursor-pointer px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New GCash QR</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleQrUpload('gcash', e)}
                              className="hidden"
                            />
                          </label>
                          <span className="text-[10px] text-stone-400">PNG or JPG screenshot from GCash app</span>
                        </div>

                        {/* GCash Inputs */}
                        <div className="md:col-span-8 space-y-4">
                          <div>
                            <label className="text-xs font-bold text-stone-700 block mb-1">
                              GCash Merchant / Account Name
                            </label>
                            <input
                              type="text"
                              value={paymentConfig.gcash.merchantName}
                              onChange={(e) => setPaymentConfig({
                                ...paymentConfig,
                                gcash: { ...paymentConfig.gcash, merchantName: e.target.value }
                              })}
                              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-stone-700 block mb-1">
                              GCash Mobile / Merchant Number
                            </label>
                            <input
                              type="text"
                              value={paymentConfig.gcash.accountNumber}
                              onChange={(e) => setPaymentConfig({
                                ...paymentConfig,
                                gcash: { ...paymentConfig.gcash, accountNumber: e.target.value }
                              })}
                              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-stone-700 block mb-1">
                              Instructions for Client (Shown on Checkout)
                            </label>
                            <input
                              type="text"
                              value={paymentConfig.gcash.qrNote}
                              onChange={(e) => setPaymentConfig({
                                ...paymentConfig,
                                gcash: { ...paymentConfig.gcash, qrNote: e.target.value }
                              })}
                              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MAYA QR CONFIGURATION */}
                    <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-sm space-y-5">
                      <div className="flex items-center gap-2.5 text-emerald-900 font-bold border-b border-stone-100 pb-3">
                        <QrCode className="w-5 h-5 text-emerald-600" />
                        <span className="font-serif text-lg">Maya / QR Ph Merchant & QR Code</span>
                      </div>

                      <div className="grid md:grid-cols-12 gap-6 items-start">
                        {/* Maya QR Box */}
                        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-3">
                          <span className="text-xs uppercase font-bold text-stone-500">Active Maya QR Preview</span>
                          <div className="w-36 h-36 bg-white p-2 rounded-xl border border-stone-300 shadow-2xs flex items-center justify-center overflow-hidden">
                            {paymentConfig.maya.qrImage ? (
                              <img
                                src={paymentConfig.maya.qrImage}
                                alt="Maya QR"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <QrCode className="w-20 h-20 text-emerald-600" />
                            )}
                          </div>

                          <label className="cursor-pointer px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New Maya QR</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleQrUpload('maya', e)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Maya Inputs */}
                        <div className="md:col-span-8 space-y-4">
                          <div>
                            <label className="text-xs font-bold text-stone-700 block mb-1">
                              Maya Merchant / Account Name
                            </label>
                            <input
                              type="text"
                              value={paymentConfig.maya.merchantName}
                              onChange={(e) => setPaymentConfig({
                                ...paymentConfig,
                                maya: { ...paymentConfig.maya, merchantName: e.target.value }
                              })}
                              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-stone-700 block mb-1">
                              Maya Account / Mobile Number
                            </label>
                            <input
                              type="text"
                              value={paymentConfig.maya.accountNumber}
                              onChange={(e) => setPaymentConfig({
                                ...paymentConfig,
                                maya: { ...paymentConfig.maya, accountNumber: e.target.value }
                              })}
                              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DOWN PAYMENT POLICY SETTINGS */}
                    <div className="p-6 bg-stone-50 border border-stone-200 rounded-3xl space-y-4">
                      <div className="font-bold text-stone-900 text-sm">
                        Down Payment & Prepayment Rules
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-stone-600 block mb-1">
                            Default Down Payment Percentage (%)
                          </label>
                          <select
                            value={paymentConfig.downpaymentPercent}
                            onChange={(e) => setPaymentConfig({
                              ...paymentConfig,
                              downpaymentPercent: parseFloat(e.target.value)
                            })}
                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-800"
                          >
                            <option value={0.20}>20% Deposit</option>
                            <option value={0.25}>25% Deposit (Default Recommended)</option>
                            <option value={0.30}>30% Deposit</option>
                            <option value={0.50}>50% Deposit</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-stone-600 block mb-1">
                            Full Prepayment Discount (%)
                          </label>
                          <select
                            value={paymentConfig.prepayFullDiscountPercent}
                            onChange={(e) => setPaymentConfig({
                              ...paymentConfig,
                              prepayFullDiscountPercent: parseFloat(e.target.value)
                            })}
                            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-800"
                          >
                            <option value={0.00}>No discount (0%)</option>
                            <option value={0.05}>5% Prepayment Discount (Default)</option>
                            <option value={0.10}>10% Prepayment Discount</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-bold transition-colors shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Payment & QR Configuration</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 3: DATABASE BACKUP & TOOLS */}
            {activeTab === 'database' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                      Free Database Tools & Data Portability
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Export your appointment records to Microsoft Excel / CSV, save backup JSON files, or reset records anytime.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* CSV Export Card */}
                    <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <FileSpreadsheet className="w-8 h-8 text-emerald-700" />
                        <h4 className="font-bold text-stone-900 text-base">Export to Excel (CSV)</h4>
                        <p className="text-xs text-stone-500">
                          Download a complete spreadsheet of all client appointments, payment references, and phone numbers.
                        </p>
                      </div>
                      <button
                        onClick={() => exportBookingsToCSV(bookings)}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download .CSV Spreadsheet</span>
                      </button>
                    </div>

                    {/* JSON Database Backup */}
                    <div className="p-6 bg-white border border-stone-200 rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <FileText className="w-8 h-8 text-rose-800" />
                        <h4 className="font-bold text-stone-900 text-base">Full Database Backup (JSON)</h4>
                        <p className="text-xs text-stone-500">
                          Save your complete bookings and payment gateway configuration into a single portable backup file.
                        </p>
                      </div>
                      <button
                        onClick={handleExportBackup}
                        className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download .JSON Backup</span>
                      </button>
                    </div>
                  </div>

                  {/* Restore from File */}
                  <div className="p-6 bg-stone-50 border border-stone-200 rounded-3xl space-y-3">
                    <div className="font-bold text-stone-900 text-sm">
                      Restore / Import Database Backup
                    </div>
                    <p className="text-xs text-stone-500">
                      Need to transfer data between laptops or restore a previous session? Select your saved `.json` file below:
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Choose Backup File (.json)</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Reset to Sample Data */}
                  <div className="p-6 bg-rose-50/50 border border-rose-200 rounded-3xl flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="font-bold text-rose-950 text-sm">Reset Sample Appointments</div>
                      <div className="text-xs text-stone-600">Populate the database with realistic demo appointments for academic presentation.</div>
                    </div>
                    <button
                      onClick={handleResetToSample}
                      className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-2xs"
                    >
                      Reset Sample Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODAL: EDIT APPOINTMENT DETAILS */}
        {isEditing && editingBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div 
              className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Edit Booking: {editingBooking.id}
                </h3>
                <button onClick={() => setIsEditing(false)} className="text-stone-400 hover:text-stone-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedBooking} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Client Name</label>
                  <input
                    type="text"
                    value={editingBooking.customer.name}
                    onChange={(e) => setEditingBooking({
                      ...editingBooking,
                      customer: { ...editingBooking.customer, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Client Mobile</label>
                  <input
                    type="text"
                    value={editingBooking.customer.mobile}
                    onChange={(e) => setEditingBooking({
                      ...editingBooking,
                      customer: { ...editingBooking.customer, mobile: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Appointment Date</label>
                    <input
                      type="date"
                      value={editingBooking.date}
                      onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Time Slot</label>
                    <select
                      value={editingBooking.timeSlot}
                      onChange={(e) => setEditingBooking({ ...editingBooking, timeSlot: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      {TIME_SLOTS.map(t => (
                        <option key={t.time} value={t.time}>{t.time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Assigned Specialist</label>
                  <select
                    value={editingBooking.stylist}
                    onChange={(e) => setEditingBooking({ ...editingBooking, stylist: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    {STYLISTS_DATA.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Status</label>
                    <select
                      value={editingBooking.status}
                      onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Remaining Balance Due (₱)</label>
                    <input
                      type="number"
                      value={editingBooking.balanceDue}
                      onChange={(e) => setEditingBooking({ ...editingBooking, balanceDue: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-rose-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Internal Salon Staff Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Paid balance in Cash at cashier, requested chair 1"
                    value={editingBooking.internalNotes || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, internalNotes: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: MANUAL WALK-IN / PHONE BOOKING */}
        {isNewBookingModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div 
              className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Add Walk-in or Phone Booking
                  </h3>
                  <p className="text-[11px] text-stone-500">Record an appointment manually at the counter</p>
                </div>
                <button onClick={() => setIsNewBookingModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateManualBooking} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Client Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Grace Lim"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      placeholder="0917 123 4567"
                      value={newClientMobile}
                      onChange={(e) => setNewClientMobile(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Time Slot</label>
                    <select
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      {TIME_SLOTS.map(t => (
                        <option key={t.time} value={t.time}>{t.time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Specialist</label>
                    <select
                      value={newStylist}
                      onChange={(e) => setNewStylist(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      {STYLISTS_DATA.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Venue</label>
                    <select
                      value={newVenue}
                      onChange={(e) => setNewVenue(e.target.value as any)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      <option value="salon">Circle C Mall (2nd Floor)</option>
                      <option value="home">QC Home Service</option>
                    </select>
                  </div>
                </div>

                {newVenue === 'home' && (
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">QC Home Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Project 8, Congressional Ave, QC"
                      value={newHomeAddress}
                      onChange={(e) => setNewHomeAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                )}

                {/* Service Selector */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Select Services</label>
                  <div className="max-h-36 overflow-y-auto border border-stone-200 rounded-xl p-2 space-y-1 bg-stone-50">
                    {allServices.map(s => {
                      const isChecked = !!newSelectedServiceIds[s.id];
                      return (
                        <label key={s.id} className="flex items-center justify-between p-1.5 hover:bg-white rounded-lg cursor-pointer">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                setNewSelectedServiceIds(prev => ({
                                  ...prev,
                                  [s.id]: e.target.checked ? 1 : 0
                                }));
                              }}
                              className="rounded text-rose-800"
                            />
                            <span className="text-stone-800 font-medium">{s.name}</span>
                          </div>
                          <span className="text-stone-500 font-semibold">₱{s.price.toLocaleString()}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Deposit Paid (₱)</label>
                    <input
                      type="number"
                      value={newPaidDeposit}
                      onChange={(e) => setNewPaidDeposit(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-bold text-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Payment Method</label>
                    <select
                      value={newPaymentChannel}
                      onChange={(e) => setNewPaymentChannel(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-semibold"
                    >
                      <option value="cash">Cash Counter</option>
                      <option value="gcash">GCash QR</option>
                      <option value="maya">Maya QR</option>
                      <option value="card">Card Terminal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Internal Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Phone reservation, will bring cash balance"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsNewBookingModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-rose-800 hover:bg-rose-900 text-white rounded-xl font-bold transition-colors"
                  >
                    Save Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
