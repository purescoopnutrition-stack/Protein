'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Eye } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';

/* eslint-disable @typescript-eslint/no-explicit-any */

const statuses = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  shipped: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function AdminOrders() {
  return <AdminGuard><AdminLayout title="Orders"><Content /></AdminLayout></AdminGuard>;
}

function Content() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: orders, isLoading } = useAdminOrders(statusFilter);
  const updateStatus = useUpdateOrderStatus();
  const { data: settings } = useSettings();
  const whatsappNumber = settings?.whatsapp_number || '918130297902';
  const [viewOrder, setViewOrder] = useState<any | null>(null);

  function handleStatusChange(orderId: string, newStatus: string) {
    updateStatus.mutate({ id: orderId, status: newStatus }, {
      onSuccess: () => toast.success('Status updated'),
      onError: () => toast.error('Failed to update status'),
    });
  }

  function openWhatsApp(phone: string, orderNumber: string) {
    const formattedPhone = phone.startsWith('91') ? phone : `91${phone}`;
    const msg = `Hi! Regarding your PureScoop order *${orderNumber}*:\n`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Button key={s} variant={statusFilter === s ? 'default' : 'outline'} size="sm"
            className={`rounded-full capitalize ${statusFilter === s ? 'bg-primary text-white' : 'border-white/10 text-white/60 hover:text-white'}`}
            onClick={() => setStatusFilter(s)}>
            {s}
          </Button>
        ))}
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader><TableRow className="border-white/5">
            <TableHead className="text-white/50">Order #</TableHead>
            <TableHead className="text-white/50">Customer</TableHead>
            <TableHead className="text-white/50">Total</TableHead>
            <TableHead className="text-white/50">Status</TableHead>
            <TableHead className="text-white/50">Date</TableHead>
            <TableHead className="text-white/50 text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/50">Loading...</TableCell></TableRow>
            : !orders?.length ? <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/50">No orders</TableCell></TableRow>
            : orders.map((order: any) => (
              <TableRow key={order.id} className="border-white/5">
                <TableCell className="font-mono font-medium text-white text-sm">{order.order_number}</TableCell>
                <TableCell><div className="text-white text-sm">{order.customer_name}</div><div className="text-white/40 text-xs">{order.phone}</div></TableCell>
                <TableCell className="font-bold">₹{Number(order.total).toLocaleString('en-IN')}</TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                    <SelectTrigger className={`w-[130px] h-8 rounded-full text-xs border ${statusColors[order.status] || ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.filter(s => s !== 'all').map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-white/50 text-sm">{new Date(order.created_at).toLocaleDateString('en-IN')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50" onClick={() => setViewOrder(order)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-400" onClick={() => openWhatsApp(order.phone, order.order_number)}><MessageCircle className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={(o) => !o && setViewOrder(null)}>
        <DialogContent className="bg-[#1A1A1A] text-white border-white/10 sm:max-w-lg">
          <DialogHeader><DialogTitle>Order {viewOrder?.order_number}</DialogTitle></DialogHeader>
          {viewOrder && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-white/40">Name:</span><p className="font-medium">{viewOrder.customer_name}</p></div>
                <div><span className="text-white/40">Phone:</span><p className="font-medium">{viewOrder.phone}</p></div>
                <div><span className="text-white/40">Email:</span><p className="font-medium">{viewOrder.email || 'N/A'}</p></div>
                <div><span className="text-white/40">Pincode:</span><p className="font-medium">{viewOrder.pincode}</p></div>
              </div>
              <div><span className="text-white/40">Address:</span><p className="font-medium">{viewOrder.address}</p></div>
              {viewOrder.notes && <div><span className="text-white/40">Notes:</span><p className="font-medium">{viewOrder.notes}</p></div>}
              <div className="border-t border-white/10 pt-3 space-y-2">
                <h4 className="font-bold">Items</h4>
                {(viewOrder.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between"><span>{item.product_name} {item.variant_name ? `(${item.variant_name})` : ''} × {item.quantity}</span><span>₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</span></div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-3 space-y-1">
                <div className="flex justify-between"><span className="text-white/50">Subtotal</span><span>₹{Number(viewOrder.subtotal).toLocaleString('en-IN')}</span></div>
                {Number(viewOrder.discount) > 0 && <div className="flex justify-between text-green-400"><span>Discount{viewOrder.coupon_code ? ` (${viewOrder.coupon_code})` : ''}</span><span>-₹{Number(viewOrder.discount).toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between"><span className="text-white/50">Shipping</span><span>{Number(viewOrder.shipping) === 0 ? 'FREE' : `₹${viewOrder.shipping}`}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span className="text-primary">₹{Number(viewOrder.total).toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

