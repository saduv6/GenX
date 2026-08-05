// ============================================================
// Admin Images Tab - Upload, toggle active, delete
// ============================================================

import { useState, useEffect } from 'react';
import { Upload, Trash2, Eye, EyeOff } from 'lucide-react';
import { getImages, createImage, updateImage, deleteImage, addAuditLog, getLoggedInAdmin } from '@/lib/firebase';
import type { ImageRecord } from '@/types';

export function ImagesTab() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      const imgs = await getImages();
      setImages(imgs);
    }
    load();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPEG and PNG files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const newId = await createImage({
          path: base64,
          isActive: true,
          createdAt: new Date().toISOString(),
        });
        await addAuditLog('CREATE', 'image', newId, 'Uploaded new image', getLoggedInAdmin() || '');
        const updated = await getImages();
        setImages(updated);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  const toggleActive = async (img: ImageRecord) => {
    await updateImage(img.id, { isActive: !img.isActive });
    await addAuditLog('UPDATE', 'image', img.id, `${img.isActive ? 'Deactivated' : 'Activated'} image`, getLoggedInAdmin() || '');
    setImages(prev => prev.map(i => i.id === img.id ? { ...i, isActive: !i.isActive } : i));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    await deleteImage(id);
    await addAuditLog('DELETE', 'image', id, 'Deleted image', getLoggedInAdmin() || '');
    setImages(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Upload */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h3 className="text-white font-semibold text-sm mb-3">Upload Image</h3>
        <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-green-500/30 transition-colors">
          <div className="text-center">
            <Upload className="w-6 h-6 mx-auto text-gray-500 mb-1" />
            <span className="text-gray-500 text-xs">Click to upload (JPEG/PNG, max 5MB)</span>
          </div>
          <input type="file" accept="image/jpeg,image/png" onChange={handleFileUpload} className="hidden" />
        </label>
        {uploading && <p className="text-green-400 text-xs mt-2">Uploading...</p>}
      </div>

      {/* Image Grid */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h3 className="text-white font-semibold text-sm mb-4">
          Images ({images.length})
          <span className="text-gray-500 font-normal ml-2">- {images.filter(i => i.isActive).length} active</span>
        </h3>
        {images.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No images uploaded yet</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {images.map(img => (
              <div key={img.id} className={`relative group rounded-xl overflow-hidden border ${img.isActive ? 'border-white/10' : 'border-red-500/20 opacity-60'} transition-all`}>
                <img src={img.path} alt="" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button
                    onClick={() => toggleActive(img)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    title={img.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {img.isActive ? <EyeOff className="w-3.5 h-3.5 text-gray-300" /> : <Eye className="w-3.5 h-3.5 text-gray-300" />}
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-300" />
                  </button>
                </div>
                {!img.isActive && (
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-red-500/80 text-white text-[9px] font-medium">Inactive</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
