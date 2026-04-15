'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminBrands } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Loader2, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { uploadFile, generateFilePath, BUCKETS } from '@/lib/storage-helpers';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const schema = z.object({ name: z.string().min(2), slug: z.string().min(2), description: z.string().optional(), position: z.coerce.number().default(0) });
type FormData = z.infer<typeof schema>;

export default function AdminBrands() {
  return <AdminGuard><AdminLayout title="Brands"><Content /></AdminLayout></AdminGuard>;
}

function Content() {
  const { data: brands, isLoading } = useAdminBrands();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '', description: '', position: 0 },
  });

  function openNew() { setEditId(null); reset({ name: '', slug: '', description: '', position: 0 }); setLogoFile(null); setPreviewUrl(''); setDialogOpen(true); }
  function openEdit(b: any) {
    setEditId(b.id as string); reset({ name: b.name as string, slug: b.slug as string, description: (b.description as string) || '', position: b.position as number });
    setPreviewUrl((b.logo_url as string) || ''); setLogoFile(null); setDialogOpen(true);
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      let logo_url = previewUrl;
      if (logoFile) { const p = generateFilePath(logoFile, 'brands'); logo_url = await uploadFile(BUCKETS.BRAND_LOGOS, p, logoFile); }
      const payload = { ...data, logo_url: logo_url || null };
      if (editId) { const { error } = await supabase.from('brands').update(payload).eq('id', editId); if (error) throw error; }
      else { const { error } = await supabase.from('brands').insert(payload); if (error) throw error; }
      toast.success(editId ? 'Updated!' : 'Created!');
      qc.invalidateQueries({ queryKey: ['admin-brands'] }); qc.invalidateQueries({ queryKey: ['brands'] });
      setDialogOpen(false);
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Failed'); } finally { setSaving(false); }
  }

  async function handleDelete(id: string) { if (!confirm('Delete?')) return; await supabase.from('brands').delete().eq('id', id); qc.invalidateQueries({ queryKey: ['admin-brands'] }); toast.success('Deleted'); }

  return (
    <div className="space-y-6">
      <div className="flex justify-end"><Button onClick={openNew} className="bg-primary text-white rounded-xl"><Plus className="w-4 h-4 mr-2" /> Add Brand</Button></div>
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
        <Table>
          <TableHeader><TableRow className="border-white/5"><TableHead className="text-white/50">Logo</TableHead><TableHead className="text-white/50">Name</TableHead><TableHead className="text-white/50">Slug</TableHead><TableHead className="text-white/50 text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={4} className="text-center py-12 text-white/50">Loading...</TableCell></TableRow>
            : !brands?.length ? <TableRow><TableCell colSpan={4} className="text-center py-12 text-white/50">No brands</TableCell></TableRow>
            : brands.map((b: any) => (
              <TableRow key={b.id} className="border-white/5"><TableCell><div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden">{b.logo_url && <img src={b.logo_url} alt="" className="w-full h-full object-contain p-1" />}</div></TableCell><TableCell className="font-medium text-white">{b.name}</TableCell><TableCell className="text-white/50">{b.slug}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" className="h-8 w-8 text-white/50" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => handleDelete(b.id)}><Trash2 className="w-4 h-4" /></Button></div></TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] text-white border-white/10">
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Brand</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><label className="text-xs text-white/50">Name</label><Input {...register('name', { onChange: (e) => !editId && setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')) })} className="bg-white/5 border-white/10 text-white mt-1" />{errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}</div>
            <div><label className="text-xs text-white/50">Slug</label><Input {...register('slug')} className="bg-white/5 border-white/10 text-white mt-1" /></div>
            <div><label className="text-xs text-white/50">Description</label><Input {...register('description')} className="bg-white/5 border-white/10 text-white mt-1" /></div>
            <div><label className="text-xs text-white/50">Position</label><Input type="number" {...register('position')} className="bg-white/5 border-white/10 text-white mt-1" /></div>
            <div><label className="text-xs text-white/50 mb-2 block">Logo</label><div className="flex items-center gap-3">{(logoFile || previewUrl) && <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5"><img src={logoFile ? URL.createObjectURL(logoFile) : previewUrl} alt="" className="w-full h-full object-contain p-1" /></div>}<Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="border-white/10 text-white"><Upload className="w-4 h-4 mr-1" /> Upload</Button></div><input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setLogoFile(e.target.files[0]); }} /></div>
            <Button type="submit" disabled={saving} className="w-full bg-primary text-white rounded-xl">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

