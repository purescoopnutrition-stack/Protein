import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, Trash2, ShoppingBag, Tag, X, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';
import { useState } from 'react';
import { OrderFormModal } from './OrderFormModal';

export function CartDrawer() {
  const {
    items, coupon, isCartOpen, closeCart, removeItem,
    updateQty, clearCart, applyCoupon, removeCoupon,
    getSubtotal, getDiscount, getShipping, getTotal, openOrderModal,
  } = useCartStore();

  const { data: settings } = useSettings();
  const shippingCharges = Number(settings?.shipping_charges ?? 50);
  const freeThreshold = Number(settings?.free_shipping_threshold ?? 999);

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping(shippingCharges, freeThreshold);
  const total = getTotal(shippingCharges, freeThreshold);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setApplying(true);
    const result = await applyCoupon(couponInput);
    setApplying(false);
    if (result.success) {
      toast.success(result.message);
      setCouponInput('');
    } else {
      toast.error(result.message);
    }
  }

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                <ShoppingBag className="w-5 h-5" />
                Your Cart ({items.length})
              </SheetTitle>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground text-center">
                Add some products to get started!
              </p>
              <Button onClick={closeCart} className="rounded-full bg-primary text-white">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.productId}-${item.variant}-${item.flavour}-${item.size}-${idx}`}
                      className="flex gap-4 p-3 rounded-2xl bg-muted/30 border border-border/50"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 rounded-xl bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.productName}</h4>
                        {(item.variant || item.flavour || item.size) && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {[item.variant, item.flavour, item.size].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        <p className="text-sm font-bold text-primary mt-1">₹{item.price.toLocaleString('en-IN')}</p>

                        {/* Qty Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border rounded-full overflow-hidden">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() => updateQty(item.productId, item.quantity - 1, item.variant, item.flavour, item.size)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none"
                              onClick={() => updateQty(item.productId, item.quantity + 1, item.variant, item.flavour, item.size)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeItem(item.productId, item.variant, item.flavour, item.size)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-bold">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Coupon + Summary */}
              <div className="border-t px-6 py-4 space-y-4 bg-white">
                {/* Coupon */}
                {coupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-green-700 text-sm">{coupon.code}</span>
                      <span className="text-xs text-green-600">
                        (-₹{discount.toLocaleString('en-IN')})
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeCoupon}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      className="rounded-full h-10 text-sm uppercase"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={applying || !couponInput.trim()}
                      variant="outline"
                      className="rounded-full h-10 px-4 text-sm font-bold"
                    >
                      {applying ? '...' : 'Apply'}
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free shipping on orders above ₹{freeThreshold.toLocaleString('en-IN')}
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Button
                  onClick={openOrderModal}
                  className="w-full h-14 rounded-full bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Proceed to Order <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <OrderFormModal />
    </>
  );
}
