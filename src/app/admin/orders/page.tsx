'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

// Prisma OrderStatus（大文字）に対応したラベル・カラー
const statusLabel: Record<string, string> = {
  PENDING: '注文確認中',
  PROCESSING: '処理中',
  PAID: '支払い済み',
  SHIPPED: '発送済み',
  DELIVERED: '配送完了',
  CANCELLED: 'キャンセル',
};

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  PAID: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { name: string };
};

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  shippingName: string;
  shippingZip: string;
  shippingAddress: string;
  shippingPhone: string;
  createdAt: string;
  items: OrderItem[];
  user: { name: string | null; email: string | null } | null;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = search
        ? `/api/admin/orders?search=${encodeURIComponent(search)}`
        : '/api/admin/orders';
      const res = await fetch(url);
      if (!res.ok) throw new Error('注文の取得に失敗しました');
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 検索はEnterキーまたはボタンで実行
  const handleSearch = () => {
    fetchOrders(searchTerm || undefined);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('ステータスの更新に失敗しました');
      const updated: Order = await res.json();
      setOrders(prev =>
        prev.map(order => (order.id === orderId ? updated : order))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : '更新に失敗しました');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl tracking-tight mb-8">注文管理</h1>

      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="注文ID・お名前・メールで検索..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2 pl-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 transition-colors"
          >
            検索
          </button>
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(''); fetchOrders(); }}
              className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
            >
              リセット
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-500">読み込み中...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-12 text-gray-500">注文が見つかりません</div>
      )}

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-gray-200"
          >
            <div
              className="p-6 cursor-pointer hover:bg-gray-50"
              onClick={() =>
                setExpandedOrder(expandedOrder === order.id ? null : order.id)
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="font-medium">
                      注文番号: #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <span
                      className={`px-3 py-1 text-xs ${
                        statusColor[order.status] ?? 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      注文日:{' '}
                      {new Date(order.createdAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p>顧客名: {order.shippingName}</p>
                    <p>商品数: {order.items.length}点</p>
                  </div>
                </div>
                <div className="text-right mr-6">
                  <p className="text-2xl mb-1">
                    ¥{order.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">合計金額</p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedOrder === order.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-4">注文商品</h3>
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.product.name} × {item.quantity}
                          </span>
                          <span>
                            ¥{(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">配送先情報</h3>
                    <div className="text-sm space-y-2 text-gray-700">
                      <p>氏名: {order.shippingName}</p>
                      <p>郵便番号: {order.shippingZip}</p>
                      <p>住所: {order.shippingAddress}</p>
                      <p>電話番号: {order.shippingPhone}</p>
                    </div>
                    {order.user && (
                      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                        <p>アカウント: {order.user.name ?? '—'}</p>
                        <p>{order.user.email}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="block text-sm mb-2">ステータスを更新</label>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  >
                    <option value="PENDING">注文確認中</option>
                    <option value="PROCESSING">処理中</option>
                    <option value="PAID">支払い済み</option>
                    <option value="SHIPPED">発送済み</option>
                    <option value="DELIVERED">配送完了</option>
                    <option value="CANCELLED">キャンセル</option>
                  </select>
                  {updatingId === order.id && (
                    <span className="ml-3 text-sm text-gray-500">更新中...</span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
