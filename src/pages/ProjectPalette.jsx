import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag, Send, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function ProjectPalette() {
  const queryClient = useQueryClient();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['projectItems'],
    queryFn: () => base44.entities.ProjectItem.list('-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ProjectItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectItems'] });
      toast({ title: 'Item removed' });
    },
  });

  const totalPrice = items.reduce((sum, item) => sum + (item.price_per_sqm || 0) * (item.quantity_sqm || 0), 0);
  const totalArea = items.reduce((sum, item) => sum + (item.quantity_sqm || 0), 0);

  const handleShopifyCheckout = async () => {
    setCheckoutLoading(true);
    const res = await base44.functions.invoke('createShopifyCheckout', {
      items,
      redirectUrl: window.location.href,
    });
    setCheckoutLoading(false);
    if (res.data?.checkoutUrl) {
      window.location.href = res.data.checkoutUrl;
    } else {
      toast({ title: 'Checkout failed', description: res.data?.error || 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-2">Project Palette</p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight">Your Selection</h1>
        </motion.div>

        {isLoading ? (
          <div className="mt-12 space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-20 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-display text-2xl text-muted-foreground">Your palette is empty</p>
            <p className="text-sm text-muted-foreground mt-2 mb-6">Browse the collection and add stones to get started</p>
            <Link to="/products">
              <Button variant="outline">Explore Collection</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12">
            {/* Items */}
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-muted rounded">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-display">
                          {item.product_name?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product_id}`} className="font-medium text-sm hover:underline">
                        {item.product_name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.quantity_sqm} m² × ${item.price_per_sqm}/m²
                      </p>
                      <p className="text-sm font-semibold mt-2">
                        ${((item.price_per_sqm || 0) * (item.quantity_sqm || 0)).toFixed(0)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteMutation.mutate(item.id)}
                      className="self-center p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-display text-lg font-semibold mb-6">Project Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Area</span>
                    <span>{totalArea} m²</span>
                  </div>
                  <div className="border-t border-border my-3" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Estimated Total</span>
                    <span>${totalPrice.toFixed(0)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleShopifyCheckout}
                  disabled={checkoutLoading}
                  className="w-full h-12 tracking-widest uppercase text-sm mt-6"
                >
                  {checkoutLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  {checkoutLoading ? 'Redirecting...' : 'Checkout'}
                </Button>

                <Link to="/contact" className="block mt-3">
                  <Button variant="outline" className="w-full h-12 tracking-widest uppercase text-sm">
                    <Send className="w-4 h-4 mr-2" />
                    Request Quote
                  </Button>
                </Link>

                <p className="text-[10px] text-muted-foreground text-center mt-3 leading-relaxed">
                  Prices are estimates. Our sales team will confirm final pricing.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}