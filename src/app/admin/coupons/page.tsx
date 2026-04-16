'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminCoupons } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminInsertCrud, adminUpdateCrud, adminDeleteCrud } from '@/lib/admin-api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const schema = z.object({
  code: z.string().min(2),
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().min(0),
  min_order: z.coerce.number().default(0),
  max_discount: z.coerce.number().optional(),
  usage_limit: z.coerce.number().optional(),
  expires_at: z.string().optional(),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export default function AdminCoupons() {
  return <AdminGuard><AdminLayout title="Coupons"><Content /></AdminLayout></AdminGuard>;
}

function Content() {
  const { data: coupons, isLoading } = useAdminCoupons();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'percentage', is_active: true, code: '', value: 0, min_order: 0 },
  });

  function openNew() { setEditId(null); reset({ type: 'percentage', is_active: true, code: '', value: 0, min_order: 0 }); setDialogOpen(true); }
  function openEdit(c: Record<string, unknown>) {
    setEditId(c.id as string); reset({
      code: c.code as string, type: c.type as 'percentage' | 'fixed', value: Number(c.value), min_order: Number(c.min_order),
      max_discount: c.max_discount ? Number(c.max_discount) : undefined, usage_limit: (c.usage_limit as number) ?? undefined,
      expires_at: c.expires_at ? (c.expires_at as string).slice(0, 16) : '', is_active: c.is_active as boolean
    });
    setDialogOpen(true);
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      const payload = { ...data, code: data.code.toUpperCase().trim(), max_discount: data.max_discount || null, usage_limit: data.usage_limit || null, expires_at: data.expires_at || null };
      if (editId) { await adminUpdateCrud('coupons', editId, payload); }
      else { await adminInsertCrud('coupons', payload); }
      toast.success(editId ? 'Updated!' : 'Created!'); qc.invalidateQueries({ queryKey: ['admin-coupons'] }); setDialogOpen(false);
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Failed'); } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete?')) return;
    try {
      await adminDeleteCrud('coupons', id);
      qc.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end"><Button onClick={openNew} className="bg-primary text-white rounded-xl"><Plus className="w-4 h-4 mr-2" /> Add Coupon</Button></div>
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader><TableRow className="border-white/5"><TableHead className="text-white/50">Code</TableHead><TableHead className="text-white/50">Type</TableHead><TableHead className="text-white/50">Value</TableHead><TableHead className="text-white/50">Usage</TableHead><TableHead className="text-white/50">Status</TableHead><TableHead className="text-white/50 text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/50">Loading...</TableCell></TableRow>
            : !coupons?.length ? <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/50">No coupons</TableCell></TableRow>
            : coupons.map((c: Record<string, unknown>) => (
              <TableRow key={c.id as string} className="border-white/5">
                <TableCell className="font-mono font-bold text-white">{c.code as string}</TableCell>
                <TableCell className="capitalize">{c.type as string}</TableCell>
                <TableCell>{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</TableCell>
                <TableCell>{c.used_count as number}{c.usage_limit ? `/${c.usage_limit}` : ''}</TableCell>
                <TableCell><Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" className="h-8 w-8 text-white/50" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => handleDelete(c.id as string)}><Trash2 className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] text-white border-white/10">
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Coupon</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><label className="text-xs text-white/50">Code</label><Input {...register('code')} className="bg-white/5 border-white/10 text-white mt-1 uppercase" />{errors.code && <p className="text-xs text-red-400">{errors.code.message}</p>}</div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-white/50">Type</label><Select value={watch('type')} onValueChange={(v) => setValue('type', v as 'percentage' | 'fixed')}><SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed Amount</SelectItem></SelectContent></Select></div>
              <div><label className="text-xs text-white/50">Value</label><Input type="number" step="0.01" {...register('value')} className="bg-white/5 border-white/10 text-white mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-white/50">Min Order (₹)</label><Input type="number" {...register('min_order')} className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div><label className="text-xs text-white/50">Max Discount (₹)</label><Input type="number" {...register('max_discount')} className="bg-white/5 border-white/10 text-white mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-white/50">Usage Limit</label><Input type="number" {...register('usage_limit')} className="bg-white/5 border-white/10 text-white mt-1" /></div>
              <div><label className="text-xs text-white/50">Expires At</label><Input type="datetime-local" {...register('expires_at')} className="bg-white/5 border-white/10 text-white mt-1" /></div>
            </div>
            <label className="flex items-center gap-2 text-sm"><Switch checked={watch('is_active')} onCheckedChange={(v) => setValue('is_active', v)} /> Active</label>
            <Button type="submit" disabled={saving} className="w-full bg-primary text-white rounded-xl">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

