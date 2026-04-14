'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFilterProps {
  categories: Category[];
  currentSlug?: string;
}

export function ProductFilter({ categories, currentSlug }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      <button
        onClick={() => handleSelect(null)}
        className={`px-4 py-2 whitespace-nowrap transition-colors text-sm ${
          !currentSlug ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        すべて
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.slug)}
          className={`px-4 py-2 whitespace-nowrap transition-colors text-sm ${
            currentSlug === cat.slug ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
