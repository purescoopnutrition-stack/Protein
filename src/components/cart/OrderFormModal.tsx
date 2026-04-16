import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/cart-store';
import { useSettings } from '@/hooks/use-settings';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';

const orderSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
  email: z.string().email('Enter a valid email').or(z.literal('')).optional(),
  address: z.string().min(10, 'Enter your full address'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

function generateOrderNumber(): string {
  const date = new Date();
  const d = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PS-${d}-${rand}`;
}

export function OrderFormModal() {
  const { items, coupon, isOrderModalOpen, closeOrderModal, clearCart, getSubtotal, getDiscount, getShipping, getTotal } = useCartStore();
  const { data: settings } = useSettings();
  const shippingCharges = Number(settings?.shipping_charges ?? 50);
  const freeThreshold = Number(settings?.free_shipping_threshold ?? 999);
  const whatsappNumber = settings?.whatsapp_number ?? '918130297902';

  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: { name: '', phone: '', email: '', address: '', pincode: '', notes: '' },
  });

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping(shippingCharges, freeThreshold);
  const total = getTotal(shippingCharges, freeThreshold);

  async function onSubmit(data: OrderFormData) {
    setSubmitting(true);
    try {
      const orderNumber = generateOrderNumber();

      const orderData = {
        order_number: orderNumber,
        customer_name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address,
        pincode: data.pincode,
        notes: data.notes || null,
        status: 'pending',
        subtotal,
        discount,
        shipping,
        total,
      };

      const orderItems = items.map((item) => ({
        product_id: item.productId,
        product_name: item.productName,
        variant_name: item.variant || null,
        flavour: item.flavour || null,
        size: item.size || null,
        quantity: item.quantity,
        price: item.price,
      }));

      // Call backend checkout API
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderData,
          orderItems,
          couponCode: coupon?.code || null,
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to place order via API');
      }

      // Build WhatsApp message
      const itemsList = items
        .map((item, i) => {
          const details = [item.variant, item.flavour, item.size].filter(Boolean).join(', ');
          const detailStr = details ? ` (${details})` : '';
          return `${i + 1}. ${item.productName}${detailStr} × ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`;
        })
        .join('\n');

      const msg = `🛒 *New Order - ${orderNumber}*

👤 *Customer:* ${data.name}
📞 *Phone:* ${data.phone}
📧 *Email:* ${data.email || 'N/A'}
📍 *Address:* ${data.address} - ${data.pincode}

📦 *Order Items:*
${itemsList}

💰 *Subtotal:* ₹${subtotal.toLocaleString('en-IN')}${discount > 0 ? `\n🏷️ *Discount${coupon ? ` (${coupon.code})` : ''}:* -₹${discount.toLocaleString('en-IN')}` : ''}
🚚 *Shipping:* ${shipping === 0 ? 'FREE' : `₹${shipping}`}
─────────────
*Total: ₹${total.toLocaleString('en-IN')}*${data.notes ? `\n\n📝 *Notes:* ${data.notes}` : ''}`;

      // Open WhatsApp
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');

      // Clean up
      clearCart();
      closeOrderModal();
      reset();
      toast.success('Order placed successfully! Redirecting to WhatsApp...');
    } catch (err: unknown) {
      console.error('Order error:', err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={isOrderModalOpen} onOpenChange={(open) => !open && closeOrderModal()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Complete Your Order
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="order-name">Full Name *</Label>
            <Input
              id="order-name"
              placeholder="John Doe"
              {...register('name')}
              className="rounded-xl h-11"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="order-phone">Phone Number *</Label>
            <Input
              id="order-phone"
              placeholder="9876543210"
              {...register('phone')}
              className="rounded-xl h-11"
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="order-email">Email (optional)</Label>
            <Input
              id="order-email"
              placeholder="you@example.com"
              type="email"
              {...register('email')}
              className="rounded-xl h-11"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="order-address">Full Address *</Label>
            <Textarea
              id="order-address"
              placeholder="House/Flat No., Street, Area, City, State"
              {...register('address')}
              className="rounded-xl min-h-[80px]"
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>

          {/* Pincode */}
          <div className="space-y-1.5">
            <Label htmlFor="order-pincode">Pincode *</Label>
            <Input
              id="order-pincode"
              placeholder="400001"
              {...register('pincode')}
              className="rounded-xl h-11"
            />
            {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="order-notes">Order Notes (optional)</Label>
            <Textarea
              id="order-notes"
              placeholder="Any special instructions..."
              {...register('notes')}
              className="rounded-xl min-h-[60px]"
            />
          </div>

          {/* Order Summary */}
          <div className="p-4 bg-muted/30 rounded-xl space-y-2 text-sm">
            <h4 className="font-bold text-base mb-3">Order Summary</h4>
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-muted-foreground truncate max-w-[200px]">
                  {item.productName} × {item.quantity}
                </span>
                <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-14 rounded-full bg-green-600 hover:bg-green-700 text-white text-base font-bold"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <MessageCircle className="w-5 h-5 mr-2" />
                Place Order via WhatsApp
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
