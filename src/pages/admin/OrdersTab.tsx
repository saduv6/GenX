// ============================================================
// Admin Orders Tab - Full order management with status, delete
// ============================================================

import { useState, useEffect } from 'react';
import { Trash2, Search } from 'lucide-react';
import { subscribeToOrders, updateOrderStatus, deleteOrder } from '@/lib/firebase';
import type { Order } from '@/types';

type StatusFilter = 'all' | 'new' | 'processing' | 'completed' | 'cancelled';

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToOrders(setOrders);
  }, []);

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.customerName.toLowerCase().includes(q) ||
             o.phone.includes(q) ||
             o.id.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = async (id: string, status: Order['status']) => {
    await updateOrderStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    await deleteOrder(id);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'new', 'processing', 'completed', 'cancelled'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === s
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-white/5">
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Phone</th>
                  <th className="text-left p-4 font-medium">Items</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="p-4 text-gray-400 font-mono text-xs">{o.id.slice(-8)}</td>
                    <td className="p-4 text-white">{o.customerName}</td>
                    <td className="p-4 text-gray-400">{o.phone}</td>
                    <td className="p-4 text-gray-400">{o.items.length} item(s)</td>
                    <td className="p-4 text-green-400 font-medium">{o.total}</td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={e => handleStatusChange(o.id, e.target.value as Order['status'])}
                        className="bg-black border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-green-500/50 appearance-none pr-6 relative"
                        style={{ backgroundImage: 'none' }}
                      >
                        <option value="new">New</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      {confirmDelete === o.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(o.id)} className="text-red-400 text-xs hover:underline">Yes</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-gray-500 text-xs hover:underline">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(o.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
