import { useState } from 'react';
import { Link } from 'react-router';
import { mockProducts, categories } from '../data/mockData';
import { motion } from 'motion/react';

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('すべて');

  const filteredProducts =
    selectedCategory === 'すべて'
      ? mockProducts
      : mockProducts.filter((p) => p.category === selectedCategory);

  return (
    <div>
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
            alt="Shop"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-6xl md:text-7xl tracking-tight mb-6">
            YOUR STYLE,<br />OUR QUALITY
          </h1>
          <p className="text-lg mb-8 text-gray-300">
            厳選された高品質な商品をお届けします
          </p>
          <Link
            to="/#products"
            className="inline-block bg-white text-black px-8 py-3 hover:bg-gray-100 transition-colors"
          >
            商品を見る
          </Link>
        </motion.div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-4xl tracking-tight mb-8">商品一覧</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/products/${product.id}`}
                className="group block"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="mb-1 group-hover:opacity-60 transition-opacity">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="font-medium">¥{product.price.toLocaleString()}</p>
                {product.stock < 10 && product.stock > 0 && (
                  <p className="text-xs text-red-600 mt-1">残り{product.stock}点</p>
                )}
                {product.stock === 0 && (
                  <p className="text-xs text-gray-500 mt-1">在庫なし</p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
