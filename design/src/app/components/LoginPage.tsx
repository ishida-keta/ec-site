import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';

export function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/mypage');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl tracking-tight mb-2">
            {isLogin ? 'ログイン' : '新規登録'}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? 'アカウントにログインしてください'
              : 'アカウントを作成してください'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm mb-2">お名前</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-2">メールアドレス</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">パスワード</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>ログイン状態を保持</span>
              </label>
              <a href="#" className="text-gray-600 hover:text-black">
                パスワードを忘れた方
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
          >
            {isLogin ? 'ログイン' : '新規登録'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? 'アカウントをお持ちでない方は' : 'すでにアカウントをお持ちの方は'}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 hover:underline"
            >
              {isLogin ? '新規登録' : 'ログイン'}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-600 text-center mt-8">
          ※ この画面はデモです。実際の認証は行われません。
        </p>

        <Link
          to="/"
          className="block text-center text-sm text-gray-600 hover:text-black mt-6"
        >
          トップページに戻る
        </Link>
      </motion.div>
    </div>
  );
}
