// ============================================================
// Product Image Gallery Editor - library picker, uploads, ordering
// ============================================================

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Star, X, Upload, Library } from 'lucide-react';
import { createImage } from '@/lib/firebase';
import { readImageFile } from '@/lib/product-utils';
import type { ImageRecord } from '@/types';

interface ProductImagesEditorProps {
  images: string[];
  library: ImageRecord[];
  onChange: (images: string[]) => void;
  onLibraryChange: (library: ImageRecord[]) => void;
}

export function ProductImagesEditor({ images, library, onChange, onLibraryChange }: ProductImagesEditorProps) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const toggleLibraryImage = (path: string) => {
    if (images.includes(path)) {
      onChange(images.filter(p => p !== path));
    } else {
      onChange([...images, path]);
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    setError('');
    setUploading(true);
    try {
      let currentLibrary = library;
      let currentImages = images;
      for (const file of files) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          setError('Only JPEG, PNG, and WebP files are allowed');
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          setError('Each file must be less than 10MB');
          continue;
        }
        const dataUrl = await readImageFile(file);
        const existing = currentLibrary.find(img => img.path === dataUrl);
        if (!existing) {
          const id = await createImage({ path: dataUrl, isActive: true, createdAt: new Date().toISOString() });
          currentLibrary = [...currentLibrary, { id, path: dataUrl, isActive: true, createdAt: new Date().toISOString() }];
        }
        if (!currentImages.includes(dataUrl)) {
          currentImages = [...currentImages, dataUrl];
        }
      }
      onLibraryChange(currentLibrary);
      onChange(currentImages);
    } catch {
      setError('Could not process one of the images. Please try another file.');
    } finally {
      setUploading(false);
    }
  };

  const activeLibrary = library.filter(img => img.isActive || images.includes(img.path));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-gray-400 text-xs">Product Images ({images.length})</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowLibrary(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs hover:bg-white/10 transition-all"
          >
            <Library className="w-3 h-3" /> From Library
          </button>
          <label className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 text-black text-xs font-medium cursor-pointer hover:opacity-90 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload className="w-3 h-3" /> {uploading ? 'Uploading...' : 'Upload'}
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs mb-2">{error}</p>}

      {images.length === 0 ? (
        <div className="bg-black/50 rounded-lg border border-dashed border-white/10 p-4 text-center">
          <p className="text-gray-600 text-xs">No images yet. Pick from the library or upload new ones.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((src, index) => (
            <div key={src} className="relative group rounded-lg overflow-hidden border border-white/10 bg-black">
              <img src={src} alt="" className="w-full h-24 object-cover" />
              {index === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-green-500 text-black text-[10px] font-bold uppercase">Main</span>
              )}
              <div className="flex items-center justify-between p-1.5 bg-black/80">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} title="Move earlier" className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 transition-all">
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} title="Move later" className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-30 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-1">
                  {index !== 0 && (
                    <button type="button" onClick={() => { const next = [...images]; const [item] = next.splice(index, 1); next.unshift(item); onChange(next); }} title="Set as main image" className="p-1 rounded text-gray-400 hover:text-yellow-400 transition-all">
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button type="button" onClick={() => onChange(images.filter((_, i) => i !== index))} title="Remove image" className="p-1 rounded text-gray-400 hover:text-red-400 transition-all">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showLibrary && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setShowLibrary(false)}>
          <div className="bg-[#111] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div>
                <h3 className="text-white font-semibold text-sm">Image Library</h3>
                <p className="text-gray-500 text-xs">Select one or more images. Selected images are added to the product gallery.</p>
              </div>
              <button type="button" onClick={() => setShowLibrary(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {activeLibrary.length === 0 ? (
                <p className="text-gray-500 text-xs text-center py-8">No active images in the library. Upload images first.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {activeLibrary.map(img => {
                    const selected = images.includes(img.path);
                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => toggleLibraryImage(img.path)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selected ? 'border-green-500' : 'border-white/10 hover:border-white/30'}`}
                      >
                        <img src={img.path} alt="" className="w-full h-full object-cover" />
                        {selected && (
                          <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 text-black text-[10px] font-bold flex items-center justify-center">
                            {images.indexOf(img.path) + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-white/5 flex justify-end">
              <button type="button" onClick={() => setShowLibrary(false)} className="px-4 py-2 rounded-lg bg-green-500 text-black text-sm font-medium hover:opacity-90 transition-all">
                Done ({images.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
