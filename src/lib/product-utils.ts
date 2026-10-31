// ============================================================
// Product helpers - SKU rules, gallery images, image compression
// ============================================================

import type { Category, Laptop } from '@/types';

export function getCategoryScope(categoryId: string, categories: Category[]): string[] {
  const children = categories.filter(c => c.parentId === categoryId).map(c => c.id);
  return [categoryId, ...children];
}

export function laptopInCategories(laptop: Laptop, categoryIds: string[]): boolean {
  if (categoryIds.includes(laptop.category)) return true;
  return (laptop.categories || []).some(id => categoryIds.includes(id));
}

const SKU_PATTERN = /^[A-Z0-9_-]{1,40}$/;
const SKU_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function normalizeSku(raw: string): string {
  return raw.trim().toUpperCase();
}

export function isValidSku(sku: string): boolean {
  return SKU_PATTERN.test(sku);
}

export function generateSku(): string {
  let sku = 'GNX-';
  for (let i = 0; i < 8; i++) {
    sku += SKU_CHARS[Math.floor(Math.random() * SKU_CHARS.length)];
  }
  return sku;
}

export function findSkuConflict(sku: string, laptops: Laptop[], excludeId?: string): Laptop | undefined {
  return laptops.find(l => l.id !== excludeId && normalizeSku(l.sku || '') === sku);
}

export function getProductImages(laptop: Laptop): string[] {
  if (laptop.images && laptop.images.length > 0) return laptop.images;
  return laptop.image ? [laptop.image] : [];
}

export function readImageFile(file: File, maxSize = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas is not supported'));
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
