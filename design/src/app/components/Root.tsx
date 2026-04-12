import { Outlet, Link, useLocation } from 'react-router';
import { ShoppingCart, User, Search } from 'lucide-react';
import { useCart, CartProvider } from '../store/cartStore';
import { useState } from 'react';
import { Toaster } from 'sonner';

function Header() {
  const { items } = useCart();
  const location = useLocation();
  const [isAdmin] = useState(false);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl tracking-tight">
            EC STORE
          </Link>

          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="商品を検索..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm ${
                  location.pathname.startsWith('/admin')
                    ? 'font-medium'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                管理画面
              </Link>
            )}
            <Link
              to="/mypage"
              className="text-gray-600 hover:text-black transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-black transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="tracking-tight mb-4">EC STORE</h3>
            <p className="text-sm text-gray-600">
              高品質な商品をお届けする<br />オンラインストア
            </p>
          </div>
          <div>
            <h4 className="text-sm mb-4">ショッピング</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-black">商品一覧</Link></li>
              <li><Link to="/cart" className="hover:text-black">カート</Link></li>
              <li><Link to="/mypage" className="hover:text-black">マイページ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm mb-4">サポート</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">お問い合わせ</a></li>
              <li><a href="#" className="hover:text-black">配送について</a></li>
              <li><a href="#" className="hover:text-black">返品・交換</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm mb-4">会社情報</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">運営会社</a></li>
              <li><a href="#" className="hover:text-black">プライバシーポリシー</a></li>
              <li><a href="#" className="hover:text-black">利用規約</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          © 2026 EC STORE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function Root() {
  return (
    <CartProvider>
      <RootLayout />
      <Toaster position="bottom-right" />
    </CartProvider>
  );
}
