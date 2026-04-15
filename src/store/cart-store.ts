import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface CartItem {
  productId: string;
  productName: string;
  image: string;
  price: number;
  comparePrice?: number;
  quantity: number;
  variant?: string;
  flavour?: string;
  size?: string;
}

interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxDiscount?: number | null;
}

interface CartStore {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  isCartOpen: boolean;
  isOrderModalOpen: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  openOrderModal: () => void;
  closeOrderModal: () => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, variant?: string, flavour?: string, size?: string) => void;
  updateQty: (productId: string, qty: number, variant?: string, flavour?: string, size?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Computed helpers
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: (shippingCharges: number, freeThreshold: number) => number;
  getTotal: (shippingCharges: number, freeThreshold: number) => number;
  getItemCount: () => number;
}

function itemKey(item: { productId: string; variant?: string; flavour?: string; size?: string }) {
  return `${item.productId}__${item.variant || ''}__${item.flavour || ''}__${item.size || ''}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isCartOpen: false,
      isOrderModalOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      openOrderModal: () => set({ isOrderModalOpen: true, isCartOpen: false }),
      closeOrderModal: () => set({ isOrderModalOpen: false }),

      addItem: (newItem) => {
        const items = [...get().items];
        const key = itemKey(newItem);
        const existingIdx = items.findIndex((i) => itemKey(i) === key);

        if (existingIdx >= 0) {
          items[existingIdx] = {
            ...items[existingIdx],
            quantity: items[existingIdx].quantity + (newItem.quantity || 1),
          };
        } else {
          items.push({ ...newItem, quantity: newItem.quantity || 1 });
        }

        set({ items, isCartOpen: true });
      },

      removeItem: (productId, variant, flavour, size) => {
        const key = itemKey({ productId, variant, flavour, size });
        set({ items: get().items.filter((i) => itemKey(i) !== key) });
      },

      updateQty: (productId, qty, variant, flavour, size) => {
        if (qty <= 0) {
          get().removeItem(productId, variant, flavour, size);
          return;
        }
        const key = itemKey({ productId, variant, flavour, size });
        set({
          items: get().items.map((i) =>
            itemKey(i) === key ? { ...i, quantity: qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: async (code: string) => {
        try {
          const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code.toUpperCase().trim())
            .eq('is_active', true)
            .single();

          if (error || !data) {
            return { success: false, message: 'Invalid coupon code' };
          }

          // Check expiry
          if (data.expires_at && new Date(data.expires_at) < new Date()) {
            return { success: false, message: 'This coupon has expired' };
          }

          // Check usage limit
          if (data.usage_limit && data.used_count >= data.usage_limit) {
            return { success: false, message: 'This coupon has reached its usage limit' };
          }

          // Check min order
          const subtotal = get().getSubtotal();
          if (data.min_order && subtotal < data.min_order) {
            return {
              success: false,
              message: `Minimum order amount is ₹${data.min_order}`,
            };
          }

          set({
            coupon: {
              code: data.code,
              type: data.type as 'percentage' | 'fixed',
              value: data.value,
              maxDiscount: data.max_discount,
            },
          });

          return { success: true, message: 'Coupon applied successfully!' };
        } catch {
          return { success: false, message: 'Failed to validate coupon' };
        }
      },

      removeCoupon: () => set({ coupon: null }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscount: () => {
        const { coupon } = get();
        if (!coupon) return 0;

        const subtotal = get().getSubtotal();

        if (coupon.type === 'fixed') {
          return Math.min(coupon.value, subtotal);
        }

        // Percentage
        let discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
        return Math.round(discount * 100) / 100;
      },

      getShipping: (shippingCharges: number, freeThreshold: number) => {
        const subtotal = get().getSubtotal();
        if (get().items.length === 0) return 0;
        return subtotal >= freeThreshold ? 0 : shippingCharges;
      },

      getTotal: (shippingCharges: number, freeThreshold: number) => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping(shippingCharges, freeThreshold);
        return Math.max(0, subtotal - discount + shipping);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'purescoop-cart',
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    }
  )
);
