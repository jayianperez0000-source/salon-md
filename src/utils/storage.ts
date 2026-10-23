import { BookingRecord, PaymentGatewayConfig } from '../types';
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
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
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
    status: 'confirmed',
    internalNotes: 'Paid in full online with 5% promo discount. Awaiting SMS cross-check.'
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
        gcash: { ...PAYMENT_CONFIG.gcash, ...parsed.gcash },
        maya: { ...PAYMENT_CONFIG.maya, ...parsed.maya },
        bank: { ...PAYMENT_CONFIG.bank, ...parsed.bank }
      };
    }
  } catch (e) {
    console.error('Error reading payment config', e);
  }
  return PAYMENT_CONFIG as PaymentGatewayConfig;
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
  currentBookingId?: string
): ReferenceValidationResult => {
  const clean = ref.trim().replace(/\s+/g, '');
  if (!clean) {
    return { isValid: false, message: 'Please enter your payment reference number.', isDuplicate: false };
  }

  // Minimum length check (GCash standard is 9-13 digits, Maya is 8-12 alphanumeric)
  if (clean.length < 8) {
    return { 
      isValid: false, 
      message: 'Reference number is too short. Please enter the full reference number (usually 9 to 13 digits) from your GCash or Maya confirmation.', 
      isDuplicate: false 
    };
  }

  // Obvious test/dummy checks
  const lower = clean.toLowerCase();
  const dummyStrings = ['12345678', '00000000', '11111111', '99999999', 'test', 'sample', 'asdfghjk', 'qwerty'];
  if (dummyStrings.some(d => lower.includes(d))) {
    return {
      isValid: false,
      message: 'Please enter a genuine transaction reference number from your payment app.',
      isDuplicate: false
    };
  }

  // Duplicate receipt check across existing bookings
  const duplicate = existingBookings.find(b => 
    b.id !== currentBookingId && 
    b.paymentReference &&
    b.paymentReference.replace(/\s+/g, '').toLowerCase() === clean.toLowerCase()
  );

  if (duplicate) {
    return {
      isValid: false,
      message: `Duplicate Reference Detected: This reference number is already registered under booking ${duplicate.id} (${duplicate.customer.name}). Each appointment must have a unique payment receipt.`,
      isDuplicate: true
    };
  }

  return { isValid: true, message: 'Valid format', isDuplicate: false };
};
