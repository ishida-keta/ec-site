import { useState } from 'react';
import { Link } from 'react-router';
import { mockOrders } from '../data/mockData';
import { Package, User, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

const statusLabel = {
  pending: '注文確認中',
  processing: '処理中',
  shipped: '発送済み',
  delivered: '配送完了',
  cancelled: 'キャンセル',
};

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export function MyPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl tracking-tight mb-12">マイページ</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeTab === 'orders'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Package className="w-5 h-5" />
              注文履歴
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeTab === 'profile'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <User className="w-5 h-5" />
              プロフィール
            </button>
            <Link
              to="/login"
              className="w-full flex items-center gap-3 px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              ログアウト
            </Link>
          </nav>
        </aside>

        <main className="lg:col-span-3">
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl mb-8">注文履歴</h2>
              <div className="space-y-6">
                {mockOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          注文日: {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                        </p>
                        <p className="text-sm text-gray-600">
                          注文番号: #{order.id}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs ${
                          statusColor[order.status]
                        }`}
                      >
                        {statusLabel[order.status]}
                      </span>
                    </div>

                    <div className="space-y-4 mb-6">
                      {order.items.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.productName} × {item.quantity}
                          </span>
                          <span>¥{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        配送先: {order.shippingAddress.zipCode}{' '}
                        {order.shippingAddress.address}
                      </div>
                      <div className="text-lg">
                        合計: ¥{order.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl mb-8">プロフィール</h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 p-6"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2">お名前</label>
                    <input
                      type="text"
                      defaultValue="山田太郎"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">メールアドレス</label>
                    <input
                      type="email"
                      defaultValue="yamada@example.com"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">電話番号</label>
                    <input
                      type="tel"
                      defaultValue="03-1234-5678"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">郵便番号</label>
                    <input
                      type="text"
                      defaultValue="150-0001"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">住所</label>
                    <input
                      type="text"
                      defaultValue="東京都渋谷区神宮前1-2-3"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <button className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors">
                    保存する
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
