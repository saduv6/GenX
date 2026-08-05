// ============================================================
// GenX Laptop - Firebase Configuration & Database Operations
// ============================================================

import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  update,
  remove,
  onValue,
  off,
  type DatabaseReference,
} from 'firebase/database';
import type { Laptop, Order, ImageRecord, Settings, CartItem } from '@/types';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// ============================================================
// Helper: get ref
// ============================================================
const getRef = (path: string): DatabaseReference => ref(db, path);

// ============================================================
// Laptops
// ============================================================
export async function getLaptops(): Promise<Laptop[]> {
  const snapshot = await get(getRef('laptops'));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<Laptop, 'id'>) }));
}

export async function getLaptopById(id: string): Promise<Laptop | null> {
  const snapshot = await get(getRef(`laptops/${id}`));
  if (!snapshot.exists()) return null;
  return { id, ...snapshot.val() };
}

export async function createLaptop(laptop: Omit<Laptop, 'id'>): Promise<string> {
  const newRef = push(getRef('laptops'));
  await set(newRef, laptop);
  return newRef.key!;
}

export async function updateLaptop(id: string, data: Partial<Laptop>): Promise<void> {
  await update(getRef(`laptops/${id}`), data);
}

export async function deleteLaptop(id: string): Promise<void> {
  await remove(getRef(`laptops/${id}`));
}

// ============================================================
// Orders
// ============================================================
export async function getOrders(): Promise<Order[]> {
  const snapshot = await get(getRef('orders'));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<Order, 'id'>) }));
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<string> {
  const newRef = push(getRef('orders'));
  await set(newRef, order);
  return newRef.key!;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  await update(getRef(`orders/${id}`), { status });
}

export async function deleteOrder(id: string): Promise<void> {
  await remove(getRef(`orders/${id}`));
}

// ============================================================
// Cart (per session)
// ============================================================
export function getSessionId(): string {
  let sessionId = localStorage.getItem('genx_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('genx_session_id', sessionId);
  }
  return sessionId;
}

export async function getCart(sessionId: string): Promise<CartItem[]> {
  const snapshot = await get(getRef(`carts/${sessionId}`));
  if (!snapshot.exists()) return [];
  return snapshot.val().items || [];
}

export async function saveCart(sessionId: string, items: CartItem[]): Promise<void> {
  await set(getRef(`carts/${sessionId}`), { items });
}

export async function clearCart(sessionId: string): Promise<void> {
  await remove(getRef(`carts/${sessionId}`));
}

// ============================================================
// Images
// ============================================================
export async function getImages(): Promise<ImageRecord[]> {
  const snapshot = await get(getRef('images'));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<ImageRecord, 'id'>) }));
}

export async function createImage(image: Omit<ImageRecord, 'id'>): Promise<string> {
  const newRef = push(getRef('images'));
  await set(newRef, image);
  return newRef.key!;
}

export async function updateImage(id: string, data: Partial<ImageRecord>): Promise<void> {
  await update(getRef(`images/${id}`), data);
}

export async function deleteImage(id: string): Promise<void> {
  await remove(getRef(`images/${id}`));
}

// ============================================================
// Settings
// ============================================================
export async function getSettings(): Promise<Settings | null> {
  const snapshot = await get(getRef('settings'));
  if (!snapshot.exists()) return null;
  return snapshot.val();
}

export async function saveSettings(settings: Settings): Promise<void> {
  await set(getRef('settings'), settings);
}

export async function updateSettings(partial: Partial<Settings>): Promise<void> {
  await update(getRef('settings'), partial);
}

// ============================================================
// Realtime listeners
// ============================================================
export function subscribeToLaptops(callback: (laptops: Laptop[]) => void): () => void {
  const dbRef = getRef('laptops');
  onValue(dbRef, (snapshot) => {
    if (!snapshot.exists()) { callback([]); return; }
    const data = snapshot.val();
    callback(Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<Laptop, 'id'>) })));
  });
  return () => off(dbRef);
}

export function subscribeToOrders(callback: (orders: Order[]) => void): () => void {
  const dbRef = getRef('orders');
  onValue(dbRef, (snapshot) => {
    if (!snapshot.exists()) { callback([]); return; }
    const data = snapshot.val();
    callback(Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<Order, 'id'>) })));
  });
  return () => off(dbRef);
}

export function subscribeToSettings(callback: (settings: Settings | null) => void): () => void {
  const dbRef = getRef('settings');
  onValue(dbRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
  return () => off(dbRef);
}

// ============================================================
// Seed Data
// ============================================================
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,' + btoa(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#1a1a1a"/>
    <rect x="50" y="40" width="300" height="200" rx="10" fill="#0a0a0a" stroke="#00ff00" stroke-width="2"/>
    <rect x="70" y="60" width="260" height="160" rx="4" fill="#111"/>
    <text x="200" y="150" text-anchor="middle" fill="#00ff00" font-family="monospace" font-size="18">GenX Laptop</text>
    <rect x="120" y="240" width="160" height="20" rx="4" fill="#0a0a0a" stroke="#00ff00" stroke-width="1.5"/>
  </svg>`
);

export async function seedDatabase(): Promise<void> {
  // Seed laptops if empty
  const laptopsSnapshot = await get(getRef('laptops'));
  if (!laptopsSnapshot.exists()) {
    const sampleLaptops: Omit<Laptop, 'id'>[] = [
      {
        name: 'GenX UltraBook 14',
        image: PLACEHOLDER_IMAGE,
        price: 4500,
        category: 'best-selling',
        cpu: 'Intel Core i5-1135G7',
        ram: '8GB DDR4',
        storage: '512GB NVMe SSD',
        gpu: 'Intel Iris Xe Graphics',
        screen: '14" FHD IPS',
        description: 'Ultra-portable laptop with premium build quality, perfect for professionals on the go. Features a stunning 14-inch FHD display and all-day battery life.',
        inStock: true,
        isActive: true,
        sortOrder: 1,
        bestSeller: true,
      },
      {
        name: 'GenX Gaming 15',
        image: PLACEHOLDER_IMAGE,
        price: 5200,
        category: 'gaming',
        cpu: 'AMD Ryzen 5 5600H',
        ram: '16GB DDR4',
        storage: '512GB NVMe SSD',
        gpu: 'NVIDIA GTX 1650 4GB',
        screen: '15.6" FHD 144Hz',
        description: 'Dominate the competition with this powerful gaming laptop. High refresh rate display and dedicated graphics ensure smooth gameplay.',
        inStock: true,
        isActive: true,
        sortOrder: 2,
        bestSeller: true,
      },
      {
        name: 'GenX Student 13',
        image: PLACEHOLDER_IMAGE,
        price: 3200,
        category: 'student',
        cpu: 'Intel Core i3-1115G4',
        ram: '4GB DDR4',
        storage: '256GB SSD',
        gpu: 'Intel UHD Graphics',
        screen: '13.3" HD',
        description: 'Affordable and lightweight, designed for students. Perfect for online classes, assignments, and everyday computing tasks.',
        inStock: true,
        isActive: true,
        sortOrder: 3,
        bestSeller: false,
      },
      {
        name: 'GenX Pro 16',
        image: PLACEHOLDER_IMAGE,
        price: 6800,
        category: 'business',
        cpu: 'Intel Core i7-11800H',
        ram: '16GB DDR4',
        storage: '1TB NVMe SSD',
        gpu: 'NVIDIA RTX 3050 4GB',
        screen: '16" FHD+',
        description: 'Professional-grade powerhouse for business users and creators. Large display, massive storage, and discrete graphics handle any workload.',
        inStock: true,
        isActive: true,
        sortOrder: 4,
        bestSeller: false,
      },
    ];
    for (const laptop of sampleLaptops) {
      await createLaptop(laptop);
    }
  }

  // Seed settings if empty
  const settingsSnapshot = await get(getRef('settings'));
  if (!settingsSnapshot.exists()) {
    const salt = crypto.randomUUID().replace(/-/g, '');
    const defaultPassword = 'admin123';
    const hash = await hashPassword(defaultPassword, salt);
    const defaultSettings: Settings = {
      storeName: 'GenX Laptop',
      storeDescription: 'Your trusted source for premium laptops in Egypt. We offer the best selection of gaming, business, and student laptops at competitive prices.',
      contactPhone: '+20 100 123 4567',
      whatsappLink: 'https://wa.me/201001234567',
      tiktokLink: 'https://tiktok.com/@genxlaptop',
      instagramLink: 'https://instagram.com/genxlaptop',
      facebookLink: 'https://facebook.com/genxlaptop',
      heroTitle: 'Welcome to GenX Laptop',
      heroSubtitle: 'Discover the Perfect Laptop for Work, Gaming & Study',
      logoUrl: '',
      primaryColor: '#00ff00',
      footerText: '\u00a9 2026 GenX Laptop. All rights reserved.',
      adminPasswordHash: hash,
      adminPasswordSalt: salt,
    };
    await saveSettings(defaultSettings);
  }
}

// ============================================================
// Password hashing
// ============================================================
export async function hashPassword(password: string, salt: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================
// Session storage helpers
// ============================================================
export function setSplashSeen(): void {
  localStorage.setItem('genx_splash_seen', 'true');
}

export function hasSplashSeen(): boolean {
  return localStorage.getItem('genx_splash_seen') === 'true';
}

// ============================================================
// Compare helpers
// ============================================================
export function getCompareIds(): string[] {
  const raw = localStorage.getItem('compare_ids');
  return raw ? JSON.parse(raw) : [];
}

export function addCompareId(id: string): void {
  const ids = getCompareIds();
  if (!ids.includes(id) && ids.length < 4) {
    ids.push(id);
    localStorage.setItem('compare_ids', JSON.stringify(ids));
  }
}

export function removeCompareId(id: string): void {
  const ids = getCompareIds().filter(x => x !== id);
  localStorage.setItem('compare_ids', JSON.stringify(ids));
}

export function clearCompareIds(): void {
  localStorage.removeItem('compare_ids');
}

// ============================================================
// Admin auth helpers
// ============================================================
export function generateAdminToken(): string {
  return 'tkn_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function setAdminToken(token: string): void {
  localStorage.setItem('admin_token', token);
}

export function getAdminToken(): string | null {
  return localStorage.getItem('admin_token');
}

export function clearAdminToken(): void {
  localStorage.removeItem('admin_token');
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminToken();
}
