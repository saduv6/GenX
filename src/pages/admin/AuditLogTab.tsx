// ============================================================
// Audit Log Tab - shows who did what and when
// ============================================================

import { useState, useEffect } from 'react';
import { ScrollText, Plus, Pencil, Trash2, Lock, Settings as SettingsIcon, Image as ImageIcon, ShoppingBag, Circle as HelpCircle } from 'lucide-react';
import { getAuditLogs } from '@/lib/firebase';
import type { AuditLog } from '@/types';

export function AuditLogTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAuditLogs(200);
      setLogs(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>;

  const iconFor = (action: string) => {
    if (action.startsWith('CREATE')) return <Plus className="w-3.5 h-3.5 text-green-400" />;
    if (action.startsWith('UPDATE') || action.startsWith('CHANGE')) return <Pencil className="w-3.5 h-3.5 text-blue-400" />;
    if (action.startsWith('DELETE')) return <Trash2 className="w-3.5 h-3.5 text-red-400" />;
    return <ScrollText className="w-3.5 h-3.5 text-gray-400" />;
  };

  const entityIcon = (entity: string) => {
    if (entity === 'laptop') return <ShoppingBag className="w-3 h-3" />;
    if (entity === 'image') return <ImageIcon className="w-3 h-3" />;
    if (entity === 'faq') return <HelpCircle className="w-3 h-3" />;
    if (entity === 'settings') return <SettingsIcon className="w-3 h-3" />;
    if (entity === 'admin') return <Lock className="w-3 h-3" />;
    if (entity === 'order') return <ShoppingBag className="w-3 h-3" />;
    return <ScrollText className="w-3 h-3" />;
  };

  const formatAction = (action: string) => {
    return action.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <h2 className="text-white font-semibold text-lg flex items-center gap-2">
        <ScrollText className="w-5 h-5 text-green-400" />
        Audit Log
      </h2>

      {logs.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center">
          <ScrollText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No activity recorded yet</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="divide-y divide-white/5">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {iconFor(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-medium">{formatAction(log.action)}</span>
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      {entityIcon(log.entity)}
                      {log.entity}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-gray-400 text-xs mt-0.5">{log.details}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-gray-500 text-xs">by <span className="text-green-400">{log.adminUsername}</span></span>
                    <span className="text-gray-600 text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
