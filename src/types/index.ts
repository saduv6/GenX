// ============================================================
// GenX Laptop - Type Definitions
// ============================================================

export interface LaptopVariant {
  id: string;
  ram: string;
  storage: string;
  price: number;
  inStock: boolean;
}

export interface Laptop {
  id: string;
  name: string;
  nameAr?: string;
  descriptionAr?: string;
  image: string;
  price: number;
  category: string;
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  screen: string;
  description: string;
  inStock: boolean;
  isActive: boolean;
  sortOrder: number;
  bestSeller: boolean;
  variants: LaptopVariant[];
}

export interface CartItem {
  laptopId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantId?: string;
  variantLabel?: string;
}

export interface Cart {
  sessionId: string;
  items: CartItem[];
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: string;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ImageRecord {
  id: string;
  path: string; // base64
  isActive: boolean;
  createdAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Settings {
  storeName: string;
  storeNameAr: string;
  storeDescription: string;
  storeDescriptionAr: string;
  contactPhone: string;
  whatsappLink: string;
  tiktokLink: string;
  instagramLink: string;
  facebookLink: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTitleAr: string;
  heroSubtitleAr: string;
  logoUrl: string;
  primaryColor: string;
  footerText: string;
  footerTextAr: string;
  adminPasswordHash: string;
  adminPasswordSalt: string;
}

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
