import { BookingRecord, PaymentGatewayConfig, PaymentMethod } from '../types';
import { PAYMENT_CONFIG } from '../data/salonData';

const BOOKINGS_STORAGE_KEY = 'salon_md_bookings';
const PAYMENT_CONFIG_STORAGE_KEY = 'salon_md_payment_config';
const ADMIN_AUTH_KEY = 'salon_md_admin_auth';

export const INITIAL_SEED_BOOKINGS: BookingRecord[] = [
  {
    id: 'SMD-2026-8921',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    services: [
      {
        id: 'hair-rebonding',
        name: 'Permanent Hair Rebonding',
        price: 1499,
        quantity: 1,
        durationMinutes: 180
      },
      {
        id: 'hair-spa',
        name: 'Intensive Hair Spa Treatment',
        price: 450,
        quantity: 1,
        durationMinutes: 50
      }
    ],
    stylist: 'Ate Gina Santos',
    venue: 'salon',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '01:45 PM',
    customer: {
      name: 'Camille Del Rosario',
      mobile: '0917 554 9912',
      email: 'camille.dr@gmail.com',
      notes: 'Thick wavy hair, requesting mild Japanese formula'
    },
    subtotal: 1949,
    discount: 0,
    totalAmount: 1949,
    paymentPlan: 'downpayment',
    paidAmount: 487,
    balanceDue: 1462,
    paymentMethod: 'gcash',
    paymentReference: 'GC-90284102914',
    paymentVerificationStatus: 'verified',
    verifiedAt: new Date(Date.now() - 3600000 * 3).toLocaleString(),
    status: 'confirmed',
    internalNotes: 'Deposit ₱487 verified via GCash SMS. Chair 2 reserved.'
  },
  {
    id: 'SMD-2026-8922',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    services: [
      {
        id: 'classic-mani-pedi',
        name: 'Classic Manicure & Pedicure Duo',
        price: 350,
        quantity: 2,
        durationMinutes: 60
      },
      {
        id: 'foot-spa-scrub',
        name: 'Luxury Foot Spa with Sea Salt Scrub',
        price: 400,
        quantity: 2,
        durationMinutes: 50
      }
    ],
    stylist: 'Ate May Flor',
    venue: 'salon',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '11:15 AM',
    customer: {
      name: 'Maria Elena Santos & Daughter',
      mobile: '0928 419 8831',
      email: 'elena.santos@yahoo.com',
      notes: 'Mom & daughter pamper day, side-by-side chairs please'
    },
    subtotal: 1500,
    discount: 150,
    totalAmount: 1350,
    paymentPlan: 'full',
    paidAmount: 1350,
    balanceDue: 0,
    paymentMethod: 'maya',
    paymentReference: 'MYA-884102941',
    paymentVerificationStatus: 'pending',
    paymentDeadline: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes remaining
    status: 'confirmed',
    internalNotes: 'Paid in full online with 5% promo discount. 15-minute verification hold active.'
  },
  {
    id: 'SMD-2026-8919',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    services: [
      {
        id: 'lash-lift-tint',
        name: 'Keratin Lash Lift & Deep Tint',
        price: 550,
        quantity: 1,
        durationMinutes: 50
      },
      {
        id: 'eyebrow-threading',
        name: 'Eyebrow Threading & Precision Shaping',
        price: 120,
        quantity: 1,
        durationMinutes: 20
      }
    ],
    stylist: 'Ate Joy Dela Cruz',
    venue: 'salon',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timeSlot: '03:00 PM',
    customer: {
      name: 'Jessica Tan',
      mobile: '0995 821 0041',
      email: 'jess.tan@gmail.com'
    },
    subtotal: 670,
    discount: 0,
    totalAmount: 670,
    paymentPlan: 'downpayment',
    paidAmount: 200,
    balanceDue: 470,
    paymentMethod: 'gcash',
    paymentReference: 'GC-1194019284',
    status: 'completed',
    internalNotes: 'Completed yesterday. Balance ₱470 received in cash by front desk.'
  },
  {
    id: 'SMD-2026-7788',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    services: [
      {
        id: 'hair-spa',
        name: 'Intensive Hair Spa Treatment',
        price: 450,
        quantity: 1,
        durationMinutes: 50
      }
    ],
    stylist: 'Kuya Mark Bautista',
    venue: 'salon',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '04:15 PM',
    customer: {
      name: 'Kenneth Soriano',
      mobile: '0917 882 1044',
      email: 'kenneth.s@gmail.com'
    },
    subtotal: 450,
    discount: 0,
    totalAmount: 450,
    paymentPlan: 'downpayment',
    paidAmount: 200,
    balanceDue: 250,
    paymentMethod: 'gcash',
    paymentReference: 'GC-UNPAID-HOLD',
    paymentVerificationStatus: 'flagged',
    paymentDeadline: new Date(Date.now() - 3600000 * 1.75).toISOString(),
    isAutoCancelledDueToTimeout: true,
    status: 'cancelled',
    cancellationReason: 'Payment time limit expired: No verified payment received within the 15-minute slot hold window.',
    cancelledAt: new Date(Date.now() - 3600000 * 1.75).toISOString(),
    internalNotes: 'Auto-cancelled by system after 15-minute payment countdown elapsed. Stylist slot released back to calendar.'
  },
  {
    id: 'SMD-2026-7721',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    services: [
      {
        id: 'hair-rebond-brazilian',
        name: 'Japanese Silk Rebond + Brazilian Blowout',
        price: 2500,
        quantity: 1,
        durationMinutes: 180
      }
    ],
    stylist: 'Ms. Apple Hernandez',
    venue: 'salon',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '01:00 PM',
    customer: {
      name: 'Rico Panganiban',
      mobile: '0915 220 9918',
      email: 'rico.p@gmail.com'
    },
    subtotal: 2500,
    discount: 0,
    totalAmount: 2500,
    paymentPlan: 'downpayment',
    paidAmount: 625,
    balanceDue: 1875,
    paymentMethod: 'bank_transfer',
    paymentReference: 'BDO-00000012',
    paymentVerificationStatus: 'flagged',
    status: 'cancelled',
    cancellationReason: 'Invalid Payment Reference - Reference number could not be found in BDO Bank records after verification.',
    cancelledAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    internalNotes: 'Customer entered fake test reference without actual bank transfer. Slot cancelled and released for other clients.'
  }
];

export const getStoredBookings = (): BookingRecord[] => {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_BOOKINGS));
      return INITIAL_SEED_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === 0) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_BOOKINGS));
      return INITIAL_SEED_BOOKINGS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading bookings from localStorage', e);
    return INITIAL_SEED_BOOKINGS;
  }
};

export const saveStoredBookings = (bookings: BookingRecord[]): void => {
  try {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    window.dispatchEvent(new Event('salon_md_bookings_updated'));
  } catch (e) {
    console.error('Error saving bookings to localStorage', e);
  }
};

export const getStoredPaymentConfig = (): PaymentGatewayConfig => {
  try {
    const raw = localStorage.getItem(PAYMENT_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...PAYMENT_CONFIG,
        ...parsed,
        autoCancelTimeoutMinutes: parsed.autoCancelTimeoutMinutes ?? PAYMENT_CONFIG.autoCancelTimeoutMinutes ?? 15,
        autoCancelEnabled: parsed.autoCancelEnabled ?? PAYMENT_CONFIG.autoCancelEnabled ?? true,
        gcash: { ...PAYMENT_CONFIG.gcash, ...parsed.gcash },
        maya: { ...PAYMENT_CONFIG.maya, ...parsed.maya },
        bank: { ...PAYMENT_CONFIG.bank, ...parsed.bank }
      };
    }
  } catch (e) {
    console.error('Error reading payment config', e);
  }
  return {
    ...PAYMENT_CONFIG,
    autoCancelTimeoutMinutes: PAYMENT_CONFIG.autoCancelTimeoutMinutes ?? 15,
    autoCancelEnabled: PAYMENT_CONFIG.autoCancelEnabled ?? true
  } as PaymentGatewayConfig;
};

export const saveStoredPaymentConfig = (config: PaymentGatewayConfig): void => {
  try {
    localStorage.setItem(PAYMENT_CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('salon_md_payment_config_updated'));
  } catch (e) {
    console.error('Error saving payment config', e);
  }
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

export const setAdminAuthenticated = (auth: boolean): void => {
  if (auth) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
};

export const exportBookingsToCSV = (bookings: BookingRecord[]) => {
  const headers = [
    'Booking ID',
    'Date',
    'Time Slot',
    'Customer Name',
    'Mobile',
    'Email',
    'Venue',
    'Stylist',
    'Services',
    'Total Amount (PHP)',
    'Payment Plan',
    'Deposit Paid (PHP)',
    'Balance Due (PHP)',
    'Payment Channel',
    'Payment Reference',
    'Status',
    'Internal Notes'
  ];

  const rows = bookings.map(b => [
    b.id,
    b.date,
    b.timeSlot,
    `"${b.customer.name.replace(/"/g, '""')}"`,
    b.customer.mobile,
    b.customer.email || '',
    b.venue === 'salon' ? 'Circle C Mall 2nd Floor' : `Home: ${b.homeAddress || ''}`,
    b.stylist,
    `"${b.services.map(s => `${s.name} (x${s.quantity})`).join('; ')}"`,
    b.totalAmount,
    b.paymentPlan,
    b.paidAmount,
    b.balanceDue,
    b.paymentMethod.toUpperCase(),
    b.paymentReference,
    b.status.toUpperCase(),
    `"${(b.internalNotes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Salon_MD_Appointments_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export interface ReferenceValidationResult {
  isValid: boolean;
  message: string;
  isDuplicate: boolean;
}

export const validatePaymentReference = (
  ref: string,
  existingBookings: BookingRecord[],
  currentBookingId?: string,
  paymentMethod?: PaymentMethod
): ReferenceValidationResult => {
  const clean = ref.trim().replace(/\s+/g, '');
  if (!clean) {
    return { isValid: false, message: 'Please enter your payment reference number.', isDuplicate: false };
  }

  // Minimum length check (GCash standard is 9-13 digits, Maya is 8-12 alphanumeric, Bank/InstaPay is 6-16 chars)
  const minLength = paymentMethod === 'bank_transfer' ? 6 : 8;
  if (clean.length < minLength) {
    const methodLabel = paymentMethod === 'bank_transfer' 
      ? 'Bank transfer / InstaPay trace number' 
      : 'GCash / Maya confirmation';
    return { 
      isValid: false, 
      message: `Reference number is too short (${clean.length} chars). Please enter the full reference number from your ${methodLabel}.`, 
      isDuplicate: false 
    };
  }

  // Obvious test/dummy checks
  const lower = clean.toLowerCase();
  const dummyStrings = ['12345678', '00000000', '11111111', '99999999', 'test', 'sample', 'asdfghjk', 'qwerty', 'fake', 'none', 'na123'];
  if (dummyStrings.some(d => lower.includes(d))) {
    return {
      isValid: false,
      message: 'Please enter a genuine transaction reference number from your bank or payment app.',
      isDuplicate: false
    };
  }

  // Duplicate receipt check across non-cancelled bookings
  const duplicate = existingBookings.find(b => 
    b.id !== currentBookingId && 
    b.status !== 'cancelled' &&
    b.paymentReference &&
    b.paymentReference.replace(/\s+/g, '').toLowerCase() === clean.toLowerCase()
  );

  if (duplicate) {
    return {
      isValid: false,
      message: `Duplicate Reference Detected: This reference number is already registered under active booking ${duplicate.id} (${duplicate.customer.name}). Each appointment must have a unique, unused payment receipt.`,
      isDuplicate: true
    };
  }

  return { isValid: true, message: 'Valid format', isDuplicate: false };
};

export const cancelBookingDueToInvalidPayment = (
  bookingId: string,
  reason: string,
  note?: string
): BookingRecord[] => {
  const current = getStoredBookings();
  const updated = current.map(b => {
    if (b.id === bookingId) {
      return {
        ...b,
        status: 'cancelled' as const,
        paymentVerificationStatus: 'flagged' as const,
        cancellationReason: reason,
        cancelledAt: new Date().toISOString(),
        internalNotes: note 
          ? `${b.internalNotes || ''}\n[Cancelled]: ${note}`.trim() 
          : `${b.internalNotes || ''}\n[Cancelled]: Reference unverified/invalid. Slot released.`.trim()
      };
    }
    return b;
  });
  saveStoredBookings(updated);
  return updated;
};

/**
 * Calculates deadline ISO string based on creation time and timeout minutes
 */
export const calculatePaymentDeadline = (createdAtIso: string, timeoutMinutes: number = 15): string => {
  const createdTime = new Date(createdAtIso).getTime();
  const deadlineTime = createdTime + (timeoutMinutes * 60 * 1000);
  return new Date(deadlineTime).toISOString();
};

/**
 * Returns formatted time remaining and expiration status
 */
export const formatTimeRemaining = (deadlineIso?: string): {
  isExpired: boolean;
  text: string;
  minutes: number;
  seconds: number;
  totalSeconds: number;
} => {
  if (!deadlineIso) {
    return { isExpired: false, text: 'No limit', minutes: 0, seconds: 0, totalSeconds: 0 };
  }
  const deadline = new Date(deadlineIso).getTime();
  const now = Date.now();
  const diffMs = deadline - now;

  if (diffMs <= 0) {
    return { isExpired: true, text: 'Expired', minutes: 0, seconds: 0, totalSeconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const text = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

  return { isExpired: false, text, minutes, seconds, totalSeconds };
};

/**
 * Checks all stored bookings for overdue unverified reference numbers.
 * If found and auto-cancellation is enabled, automatically cancels the booking,
 * sets cancellationReason, flags verification, records timestamp, releases the slot,
 * and saves to localStorage.
 */
export const checkAndExpireOverdueBookings = (
  customList?: BookingRecord[]
): {
  updatedBookings: BookingRecord[];
  expiredCount: number;
  newlyExpiredIds: string[];
} => {
  const config = getStoredPaymentConfig();
  if (config.autoCancelEnabled === false) {
    const list = customList || getStoredBookings();
    return { updatedBookings: list, expiredCount: 0, newlyExpiredIds: [] };
  }

  const timeoutMinutes = config.autoCancelTimeoutMinutes || 15;
  const currentList = customList || getStoredBookings();
  const now = Date.now();
  const newlyExpiredIds: string[] = [];

  const updatedList = currentList.map(b => {
    // Only target active bookings with unverified reference numbers (not cards, not already completed/cancelled, not already verified)
    if (
      (b.status === 'confirmed' || b.status === 'pending') &&
      b.paymentVerificationStatus !== 'verified' &&
      b.paymentMethod !== 'card'
    ) {
      const deadline = b.paymentDeadline 
        ? new Date(b.paymentDeadline).getTime() 
        : new Date(b.createdAt).getTime() + (timeoutMinutes * 60 * 1000);

      if (now > deadline) {
        newlyExpiredIds.push(b.id);
        const reason = `Payment time limit expired: Payment reference was not confirmed within the allocated ${timeoutMinutes}-minute hold window. Appointment automatically cancelled and slot released.`;
        return {
          ...b,
          status: 'cancelled' as const,
          paymentVerificationStatus: 'flagged' as const,
          isAutoCancelledDueToTimeout: true,
          cancellationReason: reason,
          cancelledAt: new Date().toISOString(),
          internalNotes: `${b.internalNotes || ''}\n[Auto-Cancelled]: Payment time limit (${timeoutMinutes}m) expired without verified reference. Slot released back to salon schedule.`.trim()
        };
      }
    }
    return b;
  });

  if (newlyExpiredIds.length > 0) {
    saveStoredBookings(updatedList);
  }

  return {
    updatedBookings: updatedList,
    expiredCount: newlyExpiredIds.length,
    newlyExpiredIds
  };
};
