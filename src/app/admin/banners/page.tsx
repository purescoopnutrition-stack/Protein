'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminBanners } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { uploadFile, generateFilePath, BUCKETS } from '@/lib/storage-helpers';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const schema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  cta_text: z.string().optional(),
  cta_link: z.string().optional(),
  position: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export default function AdminBanners() {
  return <AdminGuard><AdminLayout title="Banners"><Content /></AdminLayout></AdminGuard>;
}

function Content() {
  const { data: banners, isLoading } = useAdminBanners();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, position: 0, title: '', subtitle: '', cta_text: '', cta_link: '' },
  });

  function openNew() { setEditId(null); reset({ is_active: true, position: 0, title: '', subtitle: '', cta_text: '', cta_link: '' }); setImageFile(null); setPreviewUrl(''); setDialogOpen(true); }
  function openEdit(b: Record<string, unknown>) {
    setEditId(b.id as string); reset({ title: (b.title as string) || '', subtitle: (b.subtitle as string) || '', cta_text: (b.cta_text as string) || '', cta_link: (b.cta_link as string) || '', position: b.position as number, is_active: b.is_active as boolean });
    setPreviewUrl(b.image_url as string); setImageFile(null); setDialogOpen(true);
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      let image_url = previewUrl;
      if (imageFile) { const p = generateFilePath(imageFile, 'banners'); image_url = await uploadFile(BUCKETS.BANNER_IMAGES, p, imageFile); }
      if (!image_url && !editId) { toast.error('Image is required'); setSaving(false); return; }
      const payload = { ...data, image_url: image_url || '', title: data.title || null, subtitle: data.subtitle || null, cta_text: data.cta_text || null, cta_link: data.cta_link || null };
      if (editId) { const { error } = await supabase.from('banners').update(payload).eq('id', editId); if (error) throw error; }
      else { const { error } = await supabase.from('banners').insert(payload); if (error) throw error; }
      toast.success(editId ? 'Updated!' : 'Created!'); qc.invalidateQueries({ queryKey: ['admin-banners'] }); qc.invalidateQueries({ queryKey: ['banners'] }); setDialogOpen(false);
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Failed'); } finally { setSaving(false); }
  }

  async function handleDelete(id: string) { if (!confirm('Delete?')) return; await supabase.from('banners').delete().eq('id', id); qc.invalidateQueries({ queryKey: ['admin-banners'] }); toast.success('Deleted'); }

  return (
    <div className="space-y-6">
      <div className="flex justify-end"><Button onClick={openNew} className="bg-primary text-white rounded-xl"><Plus className="w-4 h-4 mr-2" /> Add Banner</Button></div>
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
        <Table>
          <TableHeader><TableRow className="border-white/5"><TableHead className="text-white/50">Image</TableHead><TableHead className="text-white/50">Title</TableHead><TableHead className="text-white/50">CTA</TableHead><TableHead className="text-white/50">Status</TableHead><TableHead className="text-white/50 text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={5} className="text-center py-12 text-white/50">Loading...</TableCell></TableRow>
            : !banners?.length ? <TableRow><TableCell colSpan={5} className="text-center py-12 text-white/50">No banners</TableCell></TableRow>
            : banners.map((b: Record<string, unknown>) => (
              <TableRow key={b.id as string} className="border-white/5">
                <TableCell><div className="w-24 h-14 rounded-lg bg-white/5 overflow-hidden"><img src={b.image_url as string} alt="" className="w-full h-full object-cover" /></div></TableCell>
                <TableCell className="font-medium text-white">{(b.title as string) || '—'}</TableCell>
                <TableCell className="text-white/50 text-sm">{(b.cta_text as string) || '—'}</TableCell>
                <TableCell><Badge variant={b.is_active ? 'default' : 'secondary'}>{b.is_active ? 'Active' : 'Hidden'}</Badge></TableCell>
                <TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" className="h-8 w-8 text-white/50" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => handleDelete(b.id as string)}><Trash2 className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] text-white border-white/10">
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Banner</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><label className="text-xs text-white/50 mb-2 block">Image *</label><div className="flex items-center gap-3">{(imageFile || previewUrl) && <div className="w-32 h-20 rounded-lg overflow-hidden bg-white/5"><img src={imageFile ? URL.createObjectURL(imageFile) : previewUrl} alt="" className="w-full h-full object-cover" /></div>}<Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="border-white/10 text-white"><Upload className="w-4 h-4 mr-1" /> Upload</Button></div><input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setImageFile(e.target.files[0]); }} /></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="text-xs text-white/50">Title</label><Input {...register('title')} className="bg-white/5 border-white/10 text-white mt-1" /></div><div><label className="text-xs text-white/50">Subtitle</label><Input {...register('subtitle')} className="bg-white/5 border-white/10 text-white mt-1" /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="text-xs text-white/50">CTA Text</label><Input {...register('cta_text')} className="bg-white/5 border-white/10 text-white mt-1" placeholder="Shop Now" /></div><div><label className="text-xs text-white/50">CTA Link</label><Input {...register('cta_link')} className="bg-white/5 border-white/10 text-white mt-1" placeholder="/shop" /></div></div>
            <div className="grid grid-cols-2 gap-4"><div><label className="text-xs text-white/50">Position</label><Input type="number" {...register('position')} className="bg-white/5 border-white/10 text-white mt-1" /></div><div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm"><Switch checked={watch('is_active')} onCheckedChange={(v) => setValue('is_active', v)} /> Active</label></div></div>
            <Button type="submit" disabled={saving} className="w-full bg-primary text-white rounded-xl">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

