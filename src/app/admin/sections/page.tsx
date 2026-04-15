'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, MoveUp, MoveDown, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminSectionsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);

  const { data: sections, isLoading } = useQuery({
    queryKey: ['admin-sections'],
    queryFn: async () => {
      const { data } = await supabase.from('home_sections').select('*').order('position', { ascending: true });
      return data;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*');
      return data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      if (editingSection) {
        const { error } = await supabase.from('home_sections').update(formData).eq('id', editingSection.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('home_sections').insert([formData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
      setIsDialogOpen(false);
      setEditingSection(null);
      toast.success('Section saved successfully');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('home_sections').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sections'] });
      toast.success('Section deleted');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      title: formData.get('title'),
      type: formData.get('type'),
      category_id: formData.get('category_id') === 'none' ? null : formData.get('category_id'),
      view_all_link: formData.get('view_all_link'),
      is_active: true,
    });
  };

  return (
    <AdminGuard>
      <AdminLayout title="Landing Page Sections">
        <div className="flex justify-between items-center mb-6">
          <p className="text-white/60">Configure the sections displayed on your landing page.</p>
          <Button onClick={() => { setEditingSection(null); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Section
          </Button>
        </div>

        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-white/5">
                <TableHead className="text-white/40">Title</TableHead>
                <TableHead className="text-white/40">Type</TableHead>
                <TableHead className="text-white/40">Source</TableHead>
                <TableHead className="text-white/40 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : sections?.map((section) => (
                <TableRow key={section.id} className="border-white/5 hover:bg-white/5">
                  <TableCell className="font-bold">{section.title}</TableCell>
                  <TableCell className="capitalize">{section.type}</TableCell>
                  <TableCell>
                    {section.category_id ? categories?.find(c => c.id === section.category_id)?.name : 'All Products'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingSection(section); setIsDialogOpen(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(section.id)} className="text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-[#222] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>{editingSection ? 'Edit' : 'Add'} Home Section</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Section Title</label>
                <Input name="title" defaultValue={editingSection?.title} placeholder="e.g. Today's Spotlight" className="bg-white/5 border-white/10" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Display Type</label>
                <select name="type" defaultValue={editingSection?.type || 'carousel'} className="w-full h-10 bg-white/5 border-white/10 rounded-md px-3 text-sm">
                  <option value="carousel">Carousel</option>
                  <option value="grid">Grid</option>
                  <option value="tabs">Tabs (with categories)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Source (Category)</label>
                <select name="category_id" defaultValue={editingSection?.category_id || 'none'} className="w-full h-10 bg-white/5 border-white/10 rounded-md px-3 text-sm">
                  <option value="none">All Categories (Latest)</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">View All Link</label>
                <Input name="view_all_link" defaultValue={editingSection?.view_all_link || '/shop'} placeholder="/shop?category=..." className="bg-white/5 border-white/10" />
              </div>

              <DialogFooter className="pt-4">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Section'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AdminGuard>
  );
}
