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
import type { Laptop, Order, ImageRecord, Settings, CartItem, FaqItem } from '@/types';

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

// Guard: if env vars are missing (e.g. not configured on Netlify), don't crash the app
const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL);

let db: ReturnType<typeof getDatabase> | null = null;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
  } catch (e) {
    console.error('Firebase init failed:', e);
  }
}

// ============================================================
// Helper: get ref (returns null if DB not available)
// ============================================================
const getRef = (path: string): DatabaseReference | null => {
  if (!db) return null;
  return ref(db, path);
};

// Guard wrapper for async functions: returns fallback if DB is not available

// ============================================================
// Laptops
// ============================================================
export async function getLaptops(): Promise<Laptop[]> {
  if (!db) return [];
  const snapshot = await get(getRef('laptops')!);
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<Laptop, 'id'>) }));
}

export async function getLaptopById(id: string): Promise<Laptop | null> {
  if (!db) return null;
  const snapshot = await get(getRef(`laptops/${id}`)!);
  if (!snapshot.exists()) return null;
  return { id, ...snapshot.val() };
}

export async function createLaptop(laptop: Omit<Laptop, 'id'>): Promise<string> {
  if (!db) return '';
  const newRef = push(getRef('laptops')!);
  await set(newRef, laptop);
  return newRef.key!;
}

export async function updateLaptop(id: string, data: Partial<Laptop>): Promise<void> {
  if (!db) return;
  await update(getRef(`laptops/${id}`)!, data);
}

export async function deleteLaptop(id: string): Promise<void> {
  if (!db) return;
  await remove(getRef(`laptops/${id}`)!);
}

// ============================================================
// Orders
// ============================================================
export async function getOrders(): Promise<Order[]> {
  if (!db) return [];
  const snapshot = await get(getRef('orders')!);
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<Order, 'id'>) }));
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<string> {
  if (!db) return '';
  const newRef = push(getRef('orders')!);
  await set(newRef, order);
  return newRef.key!;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  if (!db) return;
  await update(getRef(`orders/${id}`)!, { status });
}

export async function deleteOrder(id: string): Promise<void> {
  if (!db) return;
  await remove(getRef(`orders/${id}`)!);
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
  if (!db) return [];
  const snapshot = await get(getRef(`carts/${sessionId}`)!);
  if (!snapshot.exists()) return [];
  return snapshot.val().items || [];
}

export async function saveCart(sessionId: string, items: CartItem[]): Promise<void> {
  if (!db) return;
  await set(getRef(`carts/${sessionId}`)!, { items });
}

export async function clearCart(sessionId: string): Promise<void> {
  if (!db) return;
  await remove(getRef(`carts/${sessionId}`)!);
}

// ============================================================
// Images
// ============================================================
export async function getImages(): Promise<ImageRecord[]> {
  if (!db) return [];
  const snapshot = await get(getRef('images')!);
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<ImageRecord, 'id'>) }));
}

export async function createImage(image: Omit<ImageRecord, 'id'>): Promise<string> {
  if (!db) return '';
  const newRef = push(getRef('images')!);
  await set(newRef, image);
  return newRef.key!;
}

export async function updateImage(id: string, data: Partial<ImageRecord>): Promise<void> {
  if (!db) return;
  await update(getRef(`images/${id}`)!, data);
}

export async function deleteImage(id: string): Promise<void> {
  if (!db) return;
  await remove(getRef(`images/${id}`)!);
}

// ============================================================
// Settings
// ============================================================
export async function getSettings(): Promise<Settings | null> {
  if (!db) return null;
  const snapshot = await get(getRef('settings')!);
  if (!snapshot.exists()) return null;
  return snapshot.val();
}

export async function saveSettings(settings: Settings): Promise<void> {
  if (!db) return;
  await set(getRef('settings')!, settings);
}

export async function updateSettings(partial: Partial<Settings>): Promise<void> {
  if (!db) return;
  await update(getRef('settings')!, partial);
}

// ============================================================
// FAQ
// ============================================================
export async function getFaqs(): Promise<FaqItem[]> {
  if (!db) return [];
  const snapshot = await get(getRef('faqs')!);
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<FaqItem, 'id'>) }));
}

export async function createFaq(faq: Omit<FaqItem, 'id'>): Promise<string> {
  if (!db) return '';
  const newRef = push(getRef('faqs')!);
  await set(newRef, faq);
  return newRef.key!;
}

export async function updateFaq(id: string, data: Partial<FaqItem>): Promise<void> {
  if (!db) return;
  await update(getRef(`faqs/${id}`)!, data);
}

export async function deleteFaq(id: string): Promise<void> {
  if (!db) return;
  await remove(getRef(`faqs/${id}`)!);
}

export function subscribeToFaqs(callback: (faqs: FaqItem[]) => void): () => void {
  if (!db) { callback([]); return () => {}; }
  const dbRef = getRef('faqs')!;
  onValue(dbRef, (snapshot) => {
    if (!snapshot.exists()) { callback([]); return; }
    const data = snapshot.val();
    callback(Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<FaqItem, 'id'>) })));
  });
  return () => off(dbRef);
}

// ============================================================
// Realtime listeners
// ============================================================
export function subscribeToLaptops(callback: (laptops: Laptop[]) => void): () => void {
  if (!db) { callback([]); return () => {}; }
  const dbRef = getRef('laptops')!;
  onValue(dbRef, (snapshot) => {
    if (!snapshot.exists()) { callback([]); return; }
    const data = snapshot.val();
    callback(Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<Laptop, 'id'>) })));
  });
  return () => off(dbRef);
}

export function subscribeToOrders(callback: (orders: Order[]) => void): () => void {
  if (!db) { callback([]); return () => {}; }
  const dbRef = getRef('orders')!;
  onValue(dbRef, (snapshot) => {
    if (!snapshot.exists()) { callback([]); return; }
    const data = snapshot.val();
    callback(Object.entries(data).map(([id, value]) => ({ id, ...(value as Omit<Order, 'id'>) })));
  });
  return () => off(dbRef);
}

export function subscribeToSettings(callback: (settings: Settings | null) => void): () => void {
  if (!db) { callback(null); return () => {}; }
  const dbRef = getRef('settings')!;
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
  if (!db) return;
  // Seed laptops if empty
  const laptopsSnapshot = await get(getRef('laptops')!);
  if (!laptopsSnapshot.exists()) {
    const sampleLaptops: Omit<Laptop, 'id'>[] = [
      {
        name: 'GenX UltraBook 14',
        nameAr: 'GenX ألترابوك 14',
        image: PLACEHOLDER_IMAGE,
        price: 4500,
        category: 'best-selling',
        cpu: 'Intel Core i5-1135G7',
        ram: '8GB DDR4',
        storage: '512GB NVMe SSD',
        gpu: 'Intel Iris Xe Graphics',
        screen: '14" FHD IPS',
        description: 'Ultra-portable laptop with premium build quality, perfect for professionals on the go. Features a stunning 14-inch FHD display and all-day battery life.',
        descriptionAr: 'لابتوب خفيف وعالي الجودة، مثالي للمحترفين أثناء التنقل. يتميز بشاشة FHD مقاس 14 بوصة وبطارية تدوم طوال اليوم.',
        inStock: true,
        isActive: true,
        sortOrder: 1,
        bestSeller: true,
        variants: [
          { id: 'v1', ram: '8GB', storage: '256GB', priceAdjustment: -500, inStock: true },
          { id: 'v2', ram: '16GB', storage: '512GB', priceAdjustment: 700, inStock: true },
          { id: 'v3', ram: '16GB', storage: '1TB', priceAdjustment: 1500, inStock: true },
        ],
      },
      {
        name: 'GenX Gaming 15',
        nameAr: 'GenX جيمنج 15',
        image: PLACEHOLDER_IMAGE,
        price: 5200,
        category: 'gaming',
        cpu: 'AMD Ryzen 5 5600H',
        ram: '16GB DDR4',
        storage: '512GB NVMe SSD',
        gpu: 'NVIDIA GTX 1650 4GB',
        screen: '15.6" FHD 144Hz',
        description: 'Dominate the competition with this powerful gaming laptop. High refresh rate display and dedicated graphics ensure smooth gameplay.',
        descriptionAr: 'سيطر على المنافسة مع هذا اللابتوب القوي للألعاب. شاشة بمعدل تحديث عالٍ وكرت شاشة مخصص يضمن تجربة لعب سلسة.',
        inStock: true,
        isActive: true,
        sortOrder: 2,
        bestSeller: true,
        variants: [
          { id: 'v1', ram: '8GB', storage: '512GB', priceAdjustment: -400, inStock: true },
          { id: 'v3', ram: '32GB', storage: '1TB', priceAdjustment: 1300, inStock: true },
        ],
      },
      {
        name: 'GenX Student 13',
        nameAr: 'GenX ستيودنت 13',
        image: PLACEHOLDER_IMAGE,
        price: 3200,
        category: 'student',
        cpu: 'Intel Core i3-1115G4',
        ram: '4GB DDR4',
        storage: '256GB SSD',
        gpu: 'Intel UHD Graphics',
        screen: '13.3" HD',
        description: 'Affordable and lightweight, designed for students. Perfect for online classes, assignments, and everyday computing tasks.',
        descriptionAr: 'اقتصادي وخفيف، مصمم للطلاب. مثالي للدروس الأونلاين والواجبات والمهام اليومية.',
        inStock: true,
        isActive: true,
        sortOrder: 3,
        bestSeller: false,
        variants: [
          { id: 'v1', ram: '4GB', storage: '128GB', priceAdjustment: -400, inStock: true },
          { id: 'v3', ram: '8GB', storage: '256GB', priceAdjustment: 500, inStock: true },
        ],
      },
      {
        name: 'GenX Pro 16',
        nameAr: 'GenX برو 16',
        image: PLACEHOLDER_IMAGE,
        price: 6800,
        category: 'business',
        cpu: 'Intel Core i7-11800H',
        ram: '16GB DDR4',
        storage: '1TB NVMe SSD',
        gpu: 'NVIDIA RTX 3050 4GB',
        screen: '16" FHD+',
        description: 'Professional-grade powerhouse for business users and creators. Large display, massive storage, and discrete graphics handle any workload.',
        descriptionAr: 'قوة احترافية لمستخدمي الأعمال والمبدعين. شاشة كبيرة وتخزين ضخم وكرت شاشة مخصص لأي عبء عمل.',
        inStock: true,
        isActive: true,
        sortOrder: 4,
        bestSeller: false,
        variants: [
          { id: 'v1', ram: '16GB', storage: '512GB', priceAdjustment: -1000, inStock: true },
          { id: 'v2', ram: '32GB', storage: '1TB', priceAdjustment: 1400, inStock: true },
          { id: 'v3', ram: '64GB', storage: '1TB', priceAdjustment: 3000, inStock: true },
        ],
      },
    ];
    for (const laptop of sampleLaptops) {
      await createLaptop(laptop);
    }
  } else {
    // Migrate: patch existing laptops with Arabic + variants if missing
    const data = laptopsSnapshot.val();
    for (const [id, value] of Object.entries(data)) {
      const laptop = value as Laptop;
      const needsUpdate: Partial<Laptop> = {};
      if (!laptop.nameAr) needsUpdate.nameAr = laptop.name;
      if (!laptop.descriptionAr) needsUpdate.descriptionAr = laptop.description;
      if (!laptop.variants) needsUpdate.variants = [];
      if (Object.keys(needsUpdate).length > 0) {
        await updateLaptop(id, needsUpdate);
      }
    }
  }

  // Seed settings if empty
  const settingsSnapshot = await get(getRef('settings')!);
  if (!settingsSnapshot.exists()) {
    const salt = crypto.randomUUID().replace(/-/g, '');
    const defaultPassword = 'admin123';
    const hash = await hashPassword(defaultPassword, salt);
    const defaultSettings: Settings = {
      storeName: 'GenX Laptop',
      storeNameAr: 'GenX لابتوب',
      storeDescription: 'Your trusted source for premium laptops in Egypt. We offer the best selection of gaming, business, and student laptops at competitive prices.',
      storeDescriptionAr: 'مصدر الموثوق للابتوبات الاحترافية في مصر. نقدم أفضل تشكيلة من لابتوبات الألعاب والأعمال والطلاب بأسعار تنافسية.',
      contactPhone: '+20 100 123 4567',
      whatsappLink: 'https://wa.me/201001234567',
      tiktokLink: 'https://tiktok.com/@genxlaptop',
      instagramLink: 'https://instagram.com/genxlaptop',
      facebookLink: 'https://facebook.com/genxlaptop',
      heroTitle: 'Welcome to GenX Laptop',
      heroSubtitle: 'Discover the Perfect Laptop for Work, Gaming & Study',
      heroTitleAr: 'مرحباً بك في GenX لابتوب',
      heroSubtitleAr: 'اكتشف اللابتوب المثالي للعمل والألعاب والدراسة',
      logoUrl: '',
      primaryColor: '#00ff00',
      footerText: '\u00a9 2026 GenX Laptop. All rights reserved.',
      footerTextAr: '\u00a9 2026 GenX لابتوب. جميع الحقوق محفوظة.',
      adminPasswordHash: hash,
      adminPasswordSalt: salt,
    };
    await saveSettings(defaultSettings);
  } else {
    // Migrate: patch existing settings with Arabic defaults if missing
    const existing = settingsSnapshot.val() as Settings;
    const needsUpdate: Partial<Settings> = {};
    if (!existing.storeNameAr) needsUpdate.storeNameAr = 'GenX لابتوب';
    if (!existing.storeDescriptionAr) needsUpdate.storeDescriptionAr = 'مصدر الموثوق للابتوبات الاحترافية في مصر. نقدم أفضل تشكيلة من لابتوبات الألعاب والأعمال والطلاب بأسعار تنافسية.';
    if (!existing.heroTitleAr) needsUpdate.heroTitleAr = 'مرحباً بك في GenX لابتوب';
    if (!existing.heroSubtitleAr) needsUpdate.heroSubtitleAr = 'اكتشف اللابتوب المثالي للعمل والألعاب والدراسة';
    if (!existing.footerTextAr) needsUpdate.footerTextAr = '\u00a9 2026 GenX لابتوب. جميع الحقوق محفوظة.';
    if (Object.keys(needsUpdate).length > 0) {
      await updateSettings(needsUpdate);
    }
  }

  // Seed FAQs if empty
  const faqsSnapshot = await get(getRef('faqs')!);
  if (!faqsSnapshot.exists()) {
    const defaultFaqs: Omit<FaqItem, 'id'>[] = [
      { question: 'How long does delivery take?', questionAr: 'كم يستغرق التوصيل؟', answer: 'Delivery within Cairo and Giza typically takes 2-3 business days. For other governorates, delivery takes 3-5 business days. You will receive a call from our delivery team to schedule the delivery time.', answerAr: 'التوصيل داخل القاهرة والجيزة يستغرق عادة 2-3 أيام عمل. للمحافظات الأخرى، يستغرق التوصيل 3-5 أيام عمل. ستصلك مكالمة من فريق التوصيل لتحديد موعد التسليم.', icon: 'Truck', sortOrder: 1, isActive: true },
      { question: 'What payment methods do you accept?', questionAr: 'ما هي طرق الدفع المتاحة؟', answer: 'We require a 500 EGP deposit to confirm your order. This amount is deducted from your total purchase price. When you receive your package, you simply pay the remaining balance to our delivery representative.', answerAr: 'نطلب دفعة مقدمة 500 جنيه لتأكيد طلبك. هذا المبلغ يُخصم من إجمالي قيمة الشراء. عند استلام الطرد، تدفع المبلغ المتبقي لمندوب التوصيل.', icon: 'CreditCard', sortOrder: 2, isActive: true },
      { question: 'How do I track my order?', questionAr: 'كيف أتابع طلبي؟', answer: 'After placing your order, you can contact us via WhatsApp or phone with your order details to check the status. Our team will provide you with delivery updates.', answerAr: 'بعد تأكيد طلبك، يمكنك التواصل معنا عبر واتساب أو الهاتف مع تفاصيل طلبك لمعرفة الحالة. فريقنا سيوفر لك تحديثات التوصيل.', icon: 'Package', sortOrder: 3, isActive: true },
      { question: 'Can I return or exchange a laptop?', questionAr: 'هل يمكنني إرجاع أو استبدال لابتوب؟', answer: 'Return and warranty policies vary by laptop model, as we offer a wide range of brands and configurations in our website. Please check the specific product page for details, or contact our support team and we\'ll clarify the policy for your chosen laptop before you purchase.', answerAr: 'سياسات الإرجاع والضمان تختلف حسب موديل اللابتوب، حيث نقدم تشكيلة واسعة من الماركات والتجهيزات. يرجى مراجعة صفحة المنتج المحددة للتفاصيل، أو التواصل مع فريق الدعم وسنوضح لك السياسة للابتوب المختار قبل الشراء.', icon: 'RotateCcw', sortOrder: 4, isActive: true },
      { question: 'Do laptops come with a warranty?', questionAr: 'هل اللابتوبات تأتي بضمان؟', answer: 'All laptops we offer, regardless of brand or configuration, come with a lifetime warranty. For detailed terms and coverage specifics, please refer to the individual product page or contact our support team.', answerAr: 'جميع اللابتوبات التي نقدمها، بغض النظر عن الماركة أو التجهيزة، تأتي بضمان مدى الحياة. للاطلاع على الشروط التفصيلية والتغطية، يرجى مراجعة صفحة المنتج أو التواصل مع فريق الدعم.', icon: 'Shield', sortOrder: 5, isActive: true },
      { question: 'How can I contact customer support?', questionAr: 'كيف أتواصل مع خدمة العملاء؟', answer: 'Our support team is available 24/7 via phone, WhatsApp, and all our social media channels. Feel free to reach out anytime, and we\'ll be happy to assist you.', answerAr: 'فريق الدعم متاح 24/7 عبر الهاتف وواتساب وجميع قنوات السوشيال ميديا. لا تتردد في التواصل في أي وقت، وسنكون سعداء بمساعدتك.', icon: 'HelpCircle', sortOrder: 6, isActive: true },
    ];
    for (const faq of defaultFaqs) {
      await createFaq(faq);
    }
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
