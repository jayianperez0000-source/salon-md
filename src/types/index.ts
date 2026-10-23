export type ServiceCategory = 
  | 'hair' 
  | 'nails' 
  | 'lashes-brows' 
  | 'waxing' 
  | 'massage' 
  | 'makeup' 
  | 'home-service';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  categoryName: string;
  price: number;
  priceRange?: string; // e.g. "Starts at ₱1,200" or "₱500 - ₱1,500"
  durationMinutes: number;
  description: string;
  inclusions: string[];
  gender: 'unisex' | 'female' | 'male';
  isPopular?: boolean;
  isPromo?: boolean;
  promoBadge?: string;
}

export interface PromotionDeal {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  originalPrice: number;
  promoPrice: number;
  savings: number;
  validity: string;
  includedServices: string[];
  featuredImage: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: ServiceCategory | 'ambience';
  categoryLabel: string;
  imageUrl: string;
  description: string;
  serviceTags: string[];
}

export interface SelectedService {
  service: ServiceItem;
  quantity: number;
}

export type PaymentMethod = 'gcash' | 'maya' | 'card' | 'bank_transfer';

export type PaymentPlan = 'downpayment' | 'full';

export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Stylist {
  id: string;
  name: string;
  role: string;
  specialty: string;
  rating: number;
  available: boolean;
}

export type PaymentVerificationStatus = 'verified' | 'pending' | 'flagged';

export interface BookingRecord {
  id: string;
  createdAt: string;
  services: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    durationMinutes: number;
  }[];
  stylist: string;
  venue: 'salon' | 'home';
  homeAddress?: string;
  date: string;
  timeSlot: string;
  customer: {
    name: string;
    mobile: string;
    email: string;
    notes?: string;
  };
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentPlan: PaymentPlan;
  paidAmount: number;
  balanceDue: number;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentReceiptImage?: string; // Base64 screenshot of GCash/Maya confirmation
  paymentVerificationStatus?: PaymentVerificationStatus; // 'verified' | 'pending' | 'flagged'
  verifiedAt?: string;
  status: BookingStatus;
  internalNotes?: string;
}

export interface PaymentGatewayConfig {
  downpaymentPercent: number;
  prepayFullDiscountPercent: number;
  gcash: {
    merchantName: string;
    accountNumber: string;
    qrImage: string;
    qrNote: string;
  };
  maya: {
    merchantName: string;
    accountNumber: string;
    qrImage: string;
    qrNote: string;
  };
  bank: {
    bdo: {
      accountName: string;
      accountNumber: string;
    };
    bpi: {
      accountName: string;
      accountNumber: string;
    };
  };
}

