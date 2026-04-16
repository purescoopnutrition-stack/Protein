'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const ADMIN_TOKEN = 'ps-admin-authenticated';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminLayout title="Dashboard">
        <DashboardContent />
      </AdminLayout>
    </AdminGuard>
  );
}

function DashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: { 'x-admin-token': ADMIN_TOKEN },
    })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {/* non-critical */})
      .finally(() => setIsLoading(false));
  }, []);

  const cards = [
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-blue-500/10 text-blue-400' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'bg-green-500/10 text-green-400' },
    { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: 'bg-amber-500/10 text-amber-400' },
    { title: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'bg-purple-500/10 text-purple-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/50 font-medium">{card.title}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold">
              {isLoading ? '—' : card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <a href="/admin/products" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <Package className="w-6 h-6 text-primary mb-2" />
            <p className="font-medium text-sm">Add Product</p>
          </a>
          <a href="/admin/orders" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <ShoppingCart className="w-6 h-6 text-primary mb-2" />
            <p className="font-medium text-sm">View Orders</p>
          </a>
          <a href="/admin/settings" className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <Clock className="w-6 h-6 text-primary mb-2" />
            <p className="font-medium text-sm">Update Settings</p>
          </a>
        </div>
      </div>
    </div>
  );
}
