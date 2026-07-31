import { useMemo } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { useProducts, type ProductWithDetails } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { trackRecommendationEvent } from '@/lib/recommendationEvents';
import type { Product } from '@/types';
import { toConsumerProduct } from '@/lib/product-adapters';

interface RecommendedProductsSectionProps {
  title: string;
  description?: string;
  seedProductIds: string[];
  excludeProductIds?: string[];
  limit?: number;
}

interface CardProduct extends Product {
  isReadyNow?: boolean;
}

function toCardProduct(product: ProductWithDetails): CardProduct {
  const totalStock = product.variants.reduce((sum, variant) => sum + Math.max(0, variant.stock || 0), 0);

  return {
    ...toConsumerProduct(product),
    isReadyNow: totalStock > 0,
  };
}

export function RecommendedProductsSection({
  title,
  description,
  seedProductIds,
  excludeProductIds = [],
  limit = 4,
}: RecommendedProductsSectionProps) {
  const { data: products, isLoading } = useProducts();
  const { user } = useAuth();

  const recommendations = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }

    const excluded = new Set(excludeProductIds);
    const seeds = products.filter((product) => seedProductIds.includes(product.id));
    const seedCategories = new Set(seeds.map((product) => product.category_id).filter(Boolean));
    const seedGroupBuy = seeds.some((product) => product.is_group_buy_eligible);
    const seedFreeShipping = seeds.some((product) => product.is_free_shipping);

    const scored = products
      .filter((product) => !excluded.has(product.id))
      .map((product) => {
        const availableStock = product.variants.reduce(
          (sum, variant) => sum + Math.max(0, variant.stock || 0),
          0,
        );

        let score = 0;

        if (seedCategories.size > 0 && product.category_id && seedCategories.has(product.category_id)) {
          score += 8;
        }

        if (seedGroupBuy && product.is_group_buy_eligible) {
          score += 3;
        } else if (product.is_group_buy_eligible) {
          score += 1;
        }

        if (seedFreeShipping && product.is_free_shipping) {
          score += 2;
        } else if (product.is_free_shipping) {
          score += 1;
        }

        if (product.is_flash_deal) {
          score += 2;
        }

        if (availableStock > 0) {
          score += 2;
        }

        score += Math.min(5, Number(product.rating) || 0);
        score += Math.min(3, (product.review_count || 0) / 20);
        score += Math.min(18, product.recommendation_score / 10);
        score += Math.min(8, product.recommendation_cart_count);
        score += Math.min(10, product.recommendation_order_count * 2);
        score += Math.min(12, product.recommendation_revenue_score / 500);

        return { product, score };
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, limit)
      .map(({ product }) => toCardProduct(product));

    return scored;
  }, [excludeProductIds, limit, products, seedProductIds]);

  if (!isLoading && recommendations.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-border py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {recommendations.map((product) => (
            <div
              key={product.id}
              onClick={() =>
                trackRecommendationEvent({
                  productId: product.id,
                  userId: user?.id,
                  eventType: 'recommendation_click',
                  source: title,
                  weight: 2,
                })
              }
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
