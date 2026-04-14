import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { ProductFilter } from './ProductFilter';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  categorySlug?: string;
}

export async function ProductGrid({ categorySlug }: ProductGridProps) {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        published: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h2 className="text-4xl tracking-tight mb-8">商品一覧</h2>
        <Suspense fallback={<div className="h-10" />}>
          <ProductFilter categories={categories} currentSlug={categorySlug} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
