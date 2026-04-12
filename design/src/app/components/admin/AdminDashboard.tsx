import { Outlet, Link, useLocation } from 'react-router';
import { Package, ShoppingBag, Users, BarChart3 } from 'lucide-react';

export function AdminDashboard() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/admin" className="text-xl tracking-tight">
                管理画面
              </Link>
              <nav className="hidden md:flex gap-6 text-sm">
                <Link
                  to="/admin/products"
                  className={`${
                    isActive('/admin/products')
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  商品管理
                </Link>
                <Link
                  to="/admin/orders"
                  className={`${
                    isActive('/admin/orders')
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  注文管理
                </Link>
              </nav>
            </div>
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-white"
            >
              ストアに戻る
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {location.pathname === '/admin' && (
          <div>
            <h1 className="text-3xl tracking-tight mb-8">ダッシュボード</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-3xl mb-1">248</p>
                <p className="text-sm text-gray-600">総商品数</p>
              </div>
              <div className="bg-white p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-3xl mb-1">1,247</p>
                <p className="text-sm text-gray-600">総注文数</p>
              </div>
              <div className="bg-white p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-3xl mb-1">892</p>
                <p className="text-sm text-gray-600">登録ユーザー数</p>
              </div>
              <div className="bg-white p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-3xl mb-1">¥3.2M</p>
                <p className="text-sm text-gray-600">今月の売上</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Link
                to="/admin/products"
                className="bg-white p-8 border border-gray-200 hover:border-black transition-colors"
              >
                <Package className="w-12 h-12 mb-4" />
                <h2 className="text-2xl mb-2">商品管理</h2>
                <p className="text-gray-600">
                  商品の登録、編集、削除、在庫管理
                </p>
              </Link>
              <Link
                to="/admin/orders"
                className="bg-white p-8 border border-gray-200 hover:border-black transition-colors"
              >
                <ShoppingBag className="w-12 h-12 mb-4" />
                <h2 className="text-2xl mb-2">注文管理</h2>
                <p className="text-gray-600">
                  注文一覧の確認、発送ステータスの更新
                </p>
              </Link>
            </div>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}
