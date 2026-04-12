import { Link, useNavigate } from 'react-router';
import { useCart } from '../store/cartStore';
import { Minus, Plus, X } from 'lucide-react';
import { motion } from 'motion/react';

export function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  const subtotal = total();
  const shipping = subtotal >= 5000 ? 0 : 500;
  const totalAmount = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-3xl tracking-tight mb-4">カートは空です</h1>
        <p className="text-gray-600 mb-8">商品を追加してください</p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
        >
          ショッピングを続ける
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl tracking-tight mb-12">カート</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-6 pb-6 border-b border-gray-200"
            >
              <Link
                to={`/products/${item.id}`}
                className="w-32 h-32 flex-shrink-0 bg-gray-100"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between mb-2">
                  <Link
                    to={`/products/${item.id}`}
                    className="hover:opacity-60 transition-opacity"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  ¥{item.price.toLocaleString()}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-medium">
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 sticky top-24">
            <h2 className="text-xl mb-6">注文サマリー</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">小計</span>
                <span>¥{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">配送料</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">無料</span>
                  ) : (
                    `¥${shipping}`
                  )}
                </span>
              </div>
              {subtotal < 5000 && (
                <p className="text-xs text-gray-600">
                  ¥{(5000 - subtotal).toLocaleString()}以上のご購入で送料無料
                </p>
              )}
            </div>

            <div className="flex justify-between mb-6">
              <span className="text-lg">合計</span>
              <span className="text-2xl">¥{totalAmount.toLocaleString()}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors mb-4"
            >
              購入手続きへ
            </button>

            <Link
              to="/"
              className="block text-center text-sm text-gray-600 hover:text-black"
            >
              ショッピングを続ける
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
