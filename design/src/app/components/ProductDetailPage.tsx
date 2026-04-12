import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { mockProducts } from '../data/mockData';
import { useCart } from '../store/cartStore';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = mockProducts.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl mb-4">商品が見つかりません</h2>
        <Link to="/" className="text-gray-600 hover:text-black">
          トップページに戻る
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    toast.success(`${product.name} をカートに追加しました`);
  };

  const relatedProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square bg-gray-100"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
            <h1 className="text-4xl tracking-tight mb-6">{product.name}</h1>
            <p className="text-3xl mb-8">¥{product.price.toLocaleString()}</p>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <p className="text-sm mb-2">在庫: {product.stock}点</p>
              {product.stock < 10 && product.stock > 0 && (
                <p className="text-sm text-red-600">残りわずか</p>
              )}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                カートに追加
              </button>
            </div>

            <div className="border-t border-gray-200 pt-8 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">配送料</span>
                <span>全国一律 500円（5,000円以上で送料無料）</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">お届け目安</span>
                <span>2-5営業日</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">返品・交換</span>
                <span>商品到着後7日以内</span>
              </div>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl tracking-tight mb-8">関連商品</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`} className="group">
                  <div className="aspect-square bg-gray-100 mb-3 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-sm mb-1 group-hover:opacity-60 transition-opacity">
                    {p.name}
                  </h3>
                  <p className="text-sm">¥{p.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
