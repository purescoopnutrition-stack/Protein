'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Image as ImageIcon, Loader2, Upload, X, Flame } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  adminFetchProducts,
  adminSaveProduct,
  adminDeleteProduct,
  adminUploadImage,
  adminDeleteImage,
} from '@/lib/admin-api';

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  compare_price: z.coerce.number().optional(),
  stock: z.coerce.number().min(0).default(0),
  category_name: z.string().optional(),
  brand_name: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_bestseller: z.boolean().default(false),
  is_active: z.boolean().default(true),
  // Supplement specific
  weight: z.string().optional(),
  servings: z.coerce.number().optional(),
  protein_per_serving: z.string().optional(),
  carbs_per_serving: z.string().optional(),
  fat_per_serving: z.string().optional(),
  energy_per_serving: z.string().optional(),
  ingredients: z.string().optional(),
  usage_instructions: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function AdminProducts() {
  return (
    <AdminGuard>
      <AdminLayout title="Products">
        <ProductsContent />
      </AdminLayout>
    </AdminGuard>
  );
}

function ProductsContent() {
  const qc = useQueryClient();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; url: string; position: number }[]>([]);
  const [flavours, setFlavours] = useState<string>('');
  const [sizes, setSizes] = useState<string>('');
  const [togglingHot, setTogglingHot] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadProducts() {
    setIsLoading(true);
    try {
      const data = await adminFetchProducts();
      setProducts(data);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function toggleHotSelling(prod: any) {
    setTogglingHot(prod.id);
    try {
      const newVal = !prod.is_bestseller;
      // Use the existing adminSaveProduct endpoint to update just the bestseller flag
      await adminSaveProduct({
        editId: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: Number(prod.price),
        compare_price: prod.compare_price ? Number(prod.compare_price) : undefined,
        stock: prod.stock,
        is_featured: prod.is_featured,
        is_bestseller: newVal,
        is_active: prod.is_active,
        weight: prod.weight,
        servings: prod.servings,
        protein_per_serving: prod.protein_per_serving,
        carbs_per_serving: prod.carbs_per_serving,
        fat_per_serving: prod.fat_per_serving,
        energy_per_serving: prod.energy_per_serving,
        ingredients: prod.ingredients,
        usage_instructions: prod.usage_instructions,
        category_name: prod.category?.name,
        brand_name: prod.brand?.name,
        flavourList: (prod.flavours as { name: string }[])?.map((f) => f.name) || [],
        sizeList: (prod.sizes as { name: string }[])?.map((s) => s.name) || [],
      });
      toast.success(newVal ? '🔥 Marked as Hot Selling!' : 'Removed from Hot Selling');
      qc.invalidateQueries({ queryKey: ['products'] });
      await loadProducts();
    } catch {
      toast.error('Failed to update product');
    } finally {
      setTogglingHot(null);
    }
  }

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { is_active: true, stock: 0, price: 0 },
  });

  function openNew() {
    setEditId(null);
    reset({ is_active: true, stock: 0, price: 0 });
    setImages([]);
    setExistingImages([]);
    setFlavours('');
    setSizes('');
    setDialogOpen(true);
  }

  function openEdit(prod: any) {
    setEditId(prod.id);
    reset({
      name: prod.name,
      slug: prod.slug,
      description: prod.description || '',
      price: Number(prod.price),
      compare_price: prod.compare_price ? Number(prod.compare_price) : undefined,
      stock: prod.stock,
      category_name: prod.category?.name || '',
      brand_name: prod.brand?.name || '',
      is_featured: prod.is_featured,
      is_bestseller: prod.is_bestseller,
      is_active: prod.is_active,
      weight: prod.weight || '',
      servings: prod.servings || undefined,
      protein_per_serving: prod.protein_per_serving || '',
      carbs_per_serving: prod.carbs_per_serving || '',
      fat_per_serving: prod.fat_per_serving || '',
      energy_per_serving: prod.energy_per_serving || '',
      ingredients: prod.ingredients || '',
      usage_instructions: prod.usage_instructions || '',
    });
    setImages([]);
    setExistingImages((prod.images as { id: string; url: string; position: number }[]) || []);
    setFlavours((prod.flavours as { name: string }[])?.map((f) => f.name).join(', ') || '');
    setSizes((prod.sizes as { name: string }[])?.map((s) => s.name).join(', ') || '');
    setDialogOpen(true);
  }

  async function onSubmit(data: ProductForm) {
    setSaving(true);
    try {
      const flavourList = flavours.split(',').map((f) => f.trim()).filter(Boolean);
      const sizeList = sizes.split(',').map((s) => s.trim()).filter(Boolean);

      // Save product via server API (uses service role — bypasses RLS)
      const result = await adminSaveProduct({
        editId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        compare_price: data.compare_price,
        stock: data.stock,
        is_featured: data.is_featured,
        is_bestseller: data.is_bestseller,
        is_active: data.is_active,
        weight: data.weight,
        servings: data.servings,
        protein_per_serving: data.protein_per_serving,
        carbs_per_serving: data.carbs_per_serving,
        fat_per_serving: data.fat_per_serving,
        energy_per_serving: data.energy_per_serving,
        ingredients: data.ingredients,
        usage_instructions: data.usage_instructions,
        category_name: data.category_name,
        brand_name: data.brand_name,
        flavourList,
        sizeList,
      });

      const productId = result.id;

      // Upload new images via server API
      for (let i = 0; i < images.length; i++) {
        await adminUploadImage(images[i], productId, existingImages.length + i);
      }

      toast.success(editId ? 'Product updated!' : 'Product created!');
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      await loadProducts();
      setDialogOpen(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await adminDeleteProduct(id);
      toast.success('Product deleted');
      qc.invalidateQueries({ queryKey: ['products'] });
      await loadProducts();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  }

  async function removeExistingImage(imgId: string, url: string) {
    try {
      await adminDeleteImage(imgId, url);
      setExistingImages((prev) => prev.filter((i) => i.id !== imgId));
    } catch {
      toast.error('Failed to remove image');
    }
  }

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-white/50">{products?.length || 0} products</p>
        <Button onClick={openNew} className="bg-primary text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5">
              <TableHead className="text-white/50">Image</TableHead>
              <TableHead className="text-white/50">Name</TableHead>
              <TableHead className="text-white/50">Price</TableHead>
              <TableHead className="text-white/50">Stock</TableHead>
              <TableHead className="text-white/50">🔥 Hot</TableHead>
              <TableHead className="text-white/50">Status</TableHead>
              <TableHead className="text-white/50 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/50">Loading...</TableCell></TableRow>
            ) : !products?.length ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/50">No products yet</TableCell></TableRow>
            ) : (
              products.map((prod: any) => {
                const img = (prod.images as { url: string; position: number }[])?.sort((a: any, b: any) => a.position - b.position)[0];
                return (
                  <TableRow key={prod.id} className="border-white/5">
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center">
                        {img ? <img src={img.url} alt="" className="w-full h-full object-contain p-1" /> : <ImageIcon className="w-5 h-5 text-white/20" />}
                      </div>
                    </TableCell>
                    <TableCell><span className="font-medium text-white">{prod.name}</span></TableCell>
                    <TableCell>₹{Number(prod.price).toLocaleString('en-IN')}</TableCell>
                    <TableCell>{prod.stock}</TableCell>
                    <TableCell>
                      <button
                        title={prod.is_bestseller ? 'Remove from Hot Selling' : 'Mark as Hot Selling'}
                        onClick={() => toggleHotSelling(prod)}
                        disabled={togglingHot === prod.id}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          prod.is_bestseller
                            ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30'
                            : 'bg-white/5 text-white/30 hover:bg-orange-500/10 hover:text-orange-400 border border-white/10'
                        }`}
                      >
                        {togglingHot === prod.id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <Flame className={`w-3 h-3 ${prod.is_bestseller ? 'fill-orange-400' : ''}`} />}
                        {prod.is_bestseller ? 'Hot' : 'Set Hot'}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={prod.is_active ? 'default' : 'secondary'} className="text-xs">
                        {prod.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white" onClick={() => openEdit(prod)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300"
                          disabled={deleting === prod.id} onClick={() => handleDelete(prod.id)}>
                          {deleting === prod.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1A1A1A] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 font-medium">Name *</label>
                <Input {...register('name', { onChange: (e) => !editId && setValue('slug', autoSlug(e.target.value)) })} className="bg-white/5 border-white/10 text-white mt-1" />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-xs text-white/50 font-medium">Slug *</label>
                <Input {...register('slug')} className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 font-medium">Description</label>
              <Textarea {...register('description')} className="bg-white/5 border-white/10 text-white mt-1 min-h-[120px]" />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-white/50 font-medium">Price (₹) *</label>
                <Input type="number" step="0.01" {...register('price')} className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <label className="text-xs text-white/50 font-medium">Compare Price (₹)</label>
                <Input type="number" step="0.01" {...register('compare_price')} className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <label className="text-xs text-white/50 font-medium">Stock</label>
                <Input type="number" {...register('stock')} className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 font-medium">Category</label>
                <Input {...register('category_name')} placeholder="e.g. Whey Protein" className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <label className="text-xs text-white/50 font-medium">Brand</label>
                <Input {...register('brand_name')} placeholder="e.g. Optimum Nutrition" className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 font-medium">Flavours (comma-separated)</label>
                <Input value={flavours} onChange={(e) => setFlavours(e.target.value)} placeholder="Chocolate, Vanilla" className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
              <div>
                <label className="text-xs text-white/50 font-medium">Sizes (comma-separated)</label>
                <Input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="250g, 500g, 1kg" className="bg-white/5 border-white/10 text-white mt-1" />
              </div>
            </div>

            {/* Supplement Specific */}
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-sm font-bold text-primary mb-4">Supplement Facts</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold">Weight (Net)</label>
                  <Input {...register('weight')} placeholder="2.27kg / 5lb" className="bg-white/5 border-white/10 text-white mt-1 h-9 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold">Servings</label>
                  <Input type="number" {...register('servings')} placeholder="71" className="bg-white/5 border-white/10 text-white mt-1 h-9 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold">Protein/Serv</label>
                  <Input {...register('protein_per_serving')} placeholder="24g" className="bg-white/5 border-white/10 text-white mt-1 h-9 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold">Energy/Serv</label>
                  <Input {...register('energy_per_serving')} placeholder="120 kcal" className="bg-white/5 border-white/10 text-white mt-1 h-9 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold">Carbs/Serv</label>
                  <Input {...register('carbs_per_serving')} placeholder="3g" className="bg-white/5 border-white/10 text-white mt-1 h-9 text-xs" />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold">Fats/Serv</label>
                  <Input {...register('fat_per_serving')} placeholder="1g" className="bg-white/5 border-white/10 text-white mt-1 h-9 text-xs" />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 font-medium font-bold uppercase">Ingredients</label>
                <Textarea {...register('ingredients')} placeholder="Whey Protein Isolate, Lecithin..." className="bg-white/5 border-white/10 text-white mt-1 min-h-[80px]" />
              </div>
              <div>
                <label className="text-xs text-white/50 font-medium font-bold uppercase">Usage Instructions</label>
                <Textarea {...register('usage_instructions')} placeholder="Mix 1 scoop with 200ml water..." className="bg-white/5 border-white/10 text-white mt-1 min-h-[80px]" />
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-sm font-bold text-white/70 mb-4 uppercase tracking-wider">Product Flags</h4>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-center">
                  <Switch checked={watch('is_featured')} onCheckedChange={(v) => setValue('is_featured', v)} />
                  <span className="text-xs font-bold text-white/70">⭐ Featured</span>
                  <span className="text-[10px] text-white/30">Show in featured sections</span>
                </label>
                <label className="flex flex-col items-center gap-2 p-4 rounded-xl border border-orange-500/30 bg-orange-500/10 cursor-pointer hover:bg-orange-500/20 transition-colors text-center">
                  <Switch checked={watch('is_bestseller')} onCheckedChange={(v) => setValue('is_bestseller', v)} />
                  <span className="text-xs font-bold text-orange-400">🔥 Hot Selling</span>
                  <span className="text-[10px] text-white/30">Show in landing page</span>
                </label>
                <label className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-center">
                  <Switch checked={watch('is_active')} onCheckedChange={(v) => setValue('is_active', v)} />
                  <span className="text-xs font-bold text-white/70">✅ Active</span>
                  <span className="text-[10px] text-white/30">Visible in store</span>
                </label>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="text-xs text-white/50 font-medium mb-2 block">Images</label>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 group">
                    <img src={img.url} alt="" className="w-full h-full object-contain p-1" />
                    <button type="button" onClick={() => removeExistingImage(img.id, img.url)}
                      className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-primary/30 group">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-contain p-1" />
                    <button type="button" onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center hover:border-primary/50 transition-colors">
                  <Upload className="w-5 h-5 text-white/30" />
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => setImages((prev) => [...prev, ...Array.from(e.target.files || [])])} />
            </div>

            <Button type="submit" disabled={saving} className="w-full bg-primary text-white rounded-xl h-11">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editId ? 'Update Product' : 'Create Product')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
