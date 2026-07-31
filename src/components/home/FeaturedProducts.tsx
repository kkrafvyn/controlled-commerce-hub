import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useProducts, ProductWithDetails } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductQuickView } from '@/components/products/ProductQuickView';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types';
import { toConsumerProduct } from '@/lib/product-adapters';

// Adapter to convert DB product to the format expected by ProductCard
function toProductCardFormat(product: ProductWithDetails): Product {
  return toConsumerProduct(product);
}

export function FeaturedProducts() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 4) || [];
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <section className="bg-card py-10 sm:py-16">
      <div className="container px-3 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold font-serif text-foreground sm:text-3xl">
              Featured Products
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Handpicked items from our best sellers
            </p>
          </div>
          <Link to="/products">
            <Button variant="ghost" className="group w-full justify-between sm:w-auto">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/70 bg-background p-4">
                  <Skeleton className="mb-4 aspect-square w-full rounded-2xl" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))
            : featuredProducts.map((product) => {
                const cardProduct = toProductCardFormat(product);
                return (
                  <ProductCard 
                    key={product.id} 
                    product={cardProduct}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                );
              })}
        </div>

        {!isLoading && featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available yet.</p>
          </div>
        )}

        {/* Quick View Modal */}
        <ProductQuickView
          product={quickViewProduct}
          open={!!quickViewProduct}
          onOpenChange={(open) => !open && setQuickViewProduct(null)}
        />
      </div>
    </section>
  );
}
