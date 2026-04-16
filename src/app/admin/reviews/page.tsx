'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminReviews } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, Trash2 } from 'lucide-react';
import { adminUpdateCrud, adminDeleteCrud } from '@/lib/admin-api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AdminReviews() {
  return <AdminGuard><AdminLayout title="Reviews"><Content /></AdminLayout></AdminGuard>;
}

function Content() {
  const { data: reviews, isLoading } = useAdminReviews();
  const qc = useQueryClient();

  async function approve(id: string) { await adminUpdateCrud('reviews', id, { is_approved: true }); qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Approved'); }
  async function reject(id: string) { await adminUpdateCrud('reviews', id, { is_approved: false }); qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Rejected'); }
  async function del(id: string) { if (!confirm('Delete?')) return; await adminDeleteCrud('reviews', id); qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Deleted'); }

  return (
    <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden overflow-x-auto">
      <Table>
        <TableHeader><TableRow className="border-white/5">
          <TableHead className="text-white/50">Product</TableHead>
          <TableHead className="text-white/50">Customer</TableHead>
          <TableHead className="text-white/50">Rating</TableHead>
          <TableHead className="text-white/50">Comment</TableHead>
          <TableHead className="text-white/50">Status</TableHead>
          <TableHead className="text-white/50 text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/50">Loading...</TableCell></TableRow>
          : !reviews?.length ? <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/50">No reviews</TableCell></TableRow>
          : reviews.map((r: any) => (
            <TableRow key={r.id} className="border-white/5">
              <TableCell className="font-medium text-white text-sm">{(r as Record<string, unknown> & { product?: { name: string } }).product?.name ?? 'Unknown'}</TableCell>
              <TableCell><div className="text-white text-sm">{r.customer_name}</div><div className="text-white/40 text-xs">{r.email}</div></TableCell>
              <TableCell>
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                ))}</div>
              </TableCell>
              <TableCell><p className="text-white/70 text-sm max-w-[200px] truncate">{r.comment}</p></TableCell>
              <TableCell><Badge variant={r.is_approved ? 'default' : 'secondary'}>{r.is_approved ? 'Approved' : 'Pending'}</Badge></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {!r.is_approved && <Button variant="ghost" size="icon" className="h-8 w-8 text-green-400" onClick={() => approve(r.id)}><Check className="w-4 h-4" /></Button>}
                  {r.is_approved && <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-400" onClick={() => reject(r.id)}><X className="w-4 h-4" /></Button>}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => del(r.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

