'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const categoryName = product.category?.name ?? '';
  const imageUrl = product.imageUrl ?? '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/products/${product.id}`} className="group block">
        <div className="aspect-square overflow-hidden bg-gray-100 mb-4">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>
        <h3 className="mb-1 group-hover:opacity-60 transition-opacity">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{categoryName}</p>
        <p className="font-medium">¥{product.price.toLocaleString()}</p>
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-red-600 mt-1">残り{product.stock}点</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-gray-500 mt-1">在庫なし</p>
        )}
      </Link>
    </motion.div>
  );
}
