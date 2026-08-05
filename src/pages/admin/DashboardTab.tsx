// ============================================================
// Admin Dashboard Tab - Statistics overview
// ============================================================

import { useState, useEffect } from 'react';
import { ShoppingBag, Laptop, DollarSign, TrendingUp } from 'lucide-react';
import { subscribeToOrders, subscribeToLaptops, subscribeToSettings } from '@/lib/firebase';
import type { Order, Laptop as LaptopType, Settings } from '@/types';

export function DashboardTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [laptops, setLaptops] = useState<LaptopType[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const unsubOrders = subscribeToOrders(setOrders);
    const unsubLaptops = subscribeToLaptops(setLaptops);
    const unsubSettings = subscribeToSettings(setSettings);
    return () => { unsubOrders(); unsubLaptops(); unsubSettings(); };
  }, []);

  const stats = {
    totalOrders: orders.length,
    totalProducts: laptops.length,
    activeLaptops: laptops.filter(l => l.isActive).length,
    totalRevenue: orders.reduce((sum, o) => {
      const n = parseFloat(o.total.replace(/[^\d.]/g, ''));
      return sum + (isNaN(n) ? 0 : n);
    }, 0),
    imageCount: 0, // Will be calculated from images tab
  };

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="#00ff00" />
        <StatCard icon={Laptop} label="Total Products" value={stats.totalProducts} color="#3b82f6" />
        <StatCard icon={TrendingUp} label="Active Laptops" value={stats.activeLaptops} color="#f59e0b" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`${stats.totalRevenue.toLocaleString()} EGP`} color="#10b981" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-white/5">
                  <th className="text-left pb-3 font-medium">Order ID</th>
                  <th className="text-left pb-3 font-medium">Customer</th>
                  <th className="text-left pb-3 font-medium">Phone</th>
                  <th className="text-left pb-3 font-medium">Total</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 text-gray-400 font-mono text-xs">{o.id.slice(-8)}</td>
                    <td className="py-3 text-white">{o.customerName}</td>
                    <td className="py-3 text-gray-400">{o.phone}</td>
                    <td className="py-3 text-green-400 font-medium">{o.total}</td>
                    <td className="py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Primary Color Preview */}
      {settings?.primaryColor && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-5">
          <h2 className="text-white font-semibold mb-2">Primary Color</h2>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border border-white/10"
              style={{ backgroundColor: settings.primaryColor }}
            />
            <span className="text-gray-400 text-sm font-mono">{settings.primaryColor}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof ShoppingBag;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-gray-500 text-xs">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: '#3b82f6',
    processing: '#f59e0b',
    completed: '#10b981',
    cancelled: '#ef4444',
  };
  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-medium uppercase"
      style={{ backgroundColor: `${colors[status] || '#6b7280'}20`, color: colors[status] || '#6b7280' }}
    >
      {status}
    </span>
  );
}
