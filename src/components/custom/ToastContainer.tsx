import { useToast } from '@/hooks/useToast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: { id: string; message: string; type: string }; onRemove: (id: string) => void }) {
  const icon = toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
               toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> :
               <Info className="w-5 h-5 text-blue-400" />;

  const borderColor = toast.type === 'success' ? 'border-green-500/50' :
                      toast.type === 'error' ? 'border-red-500/50' :
                      'border-blue-500/50';

  return (
    <div className={`flex items-center gap-3 bg-black/90 backdrop-blur-md border ${borderColor} rounded-lg px-4 py-3 shadow-lg shadow-green-500/10 min-w-[280px] max-w-[400px] animate-in slide-in-from-right duration-300`}>
      {icon}
      <p className="text-white text-sm flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-gray-400 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
