import { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductFilter } from './ProductFilter';
import { ProductCard } from './ProductCard';

const PAGE_SIZE = 12;

interface ProductGridProps {
  categorySlug?: string;
  page?: number;
}

export async function ProductGrid({ categorySlug, page = 1 }: ProductGridProps) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const where = {
    published: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (categorySlug) params.set('category', categorySlug);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return qs ? `/?${qs}` : '/';
  };

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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {currentPage > 1 && (
            <Link
              href={buildHref(currentPage - 1)}
              className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-100 transition-colors"
            >
              前へ
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildHref(p)}
              className={`px-4 py-2 text-sm transition-colors ${
                p === currentPage
                  ? 'bg-black text-white'
                  : 'border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {p}
            </Link>
          ))}

          {currentPage < totalPages && (
            <Link
              href={buildHref(currentPage + 1)}
              className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-100 transition-colors"
            >
              次へ
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
