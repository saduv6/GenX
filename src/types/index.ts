// ============================================================
// GenX Laptop - Type Definitions
// ============================================================

export interface Laptop {
  id: string;
  name: string;
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
}

export interface CartItem {
  laptopId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
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

export interface Settings {
  storeName: string;
  storeDescription: string;
  contactPhone: string;
  whatsappLink: string;
  tiktokLink: string;
  instagramLink: string;
  facebookLink: string;
  heroTitle: string;
  heroSubtitle: string;
  logoUrl: string;
  primaryColor: string;
  footerText: string;
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
