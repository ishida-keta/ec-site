import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../store/cartStore';
import { motion } from 'motion/react';

export function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    address: '',
    city: '',
    paymentMethod: 'credit',
  });

  const subtotal = total();
  const shipping = subtotal >= 5000 ? 0 : 500;
  const totalAmount = subtotal + shipping;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    navigate('/order-complete');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl tracking-tight mb-12">購入手続き</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 p-6"
            >
              <h2 className="text-xl mb-6">お客様情報</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">お名前 *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">メールアドレス *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">電話番号 *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 p-6"
            >
              <h2 className="text-xl mb-6">配送先情報</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">郵便番号 *</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    placeholder="123-4567"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">都道府県・市区町村 *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="東京都渋谷区"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">番地・建物名 *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="神宮前1-2-3 〇〇マンション101"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-200 p-6"
            >
              <h2 className="text-xl mb-6">お支払い方法</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-300 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    checked={formData.paymentMethod === 'credit'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>クレジットカード</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-300 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={formData.paymentMethod === 'bank'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>銀行振込</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-300 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>代金引換</span>
                </label>
              </div>
              <p className="text-xs text-gray-600 mt-4">
                ※ この画面はデモです。実際の決済は行われません。
              </p>
            </motion.section>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 p-6 sticky top-24"
            >
              <h2 className="text-xl mb-6">ご注文内容</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-600">数量: {item.quantity}</p>
                      <p className="text-sm mt-1">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-gray-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">小計</span>
                  <span>¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">配送料</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">無料</span>
                    ) : (
                      `¥${shipping}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg">合計</span>
                <span className="text-2xl">¥{totalAmount.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
              >
                注文を確定する
              </button>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}
