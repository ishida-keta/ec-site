import { Link } from 'react-router';
import { CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function OrderCompletePage() {
  const orderNumber = Math.floor(Math.random() * 900000) + 100000;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-8" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-4xl tracking-tight mb-4">ご注文ありがとうございます</h1>
        <p className="text-gray-600 mb-8">
          ご注文が完了しました。<br />
          ご登録のメールアドレスに確認メールをお送りしました。
        </p>

        <div className="bg-gray-50 p-8 mb-12 inline-block">
          <p className="text-sm text-gray-600 mb-2">注文番号</p>
          <p className="text-3xl tracking-wider">{orderNumber}</p>
        </div>

        <div className="space-y-4 text-sm text-gray-700 mb-12">
          <p>商品の発送準備ができ次第、発送通知メールをお送りいたします。</p>
          <p>お届けまで今しばらくお待ちください。</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/mypage"
            className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
          >
            注文履歴を見る
          </Link>
          <Link
            to="/"
            className="inline-block border border-black text-black px-8 py-3 hover:bg-black hover:text-white transition-colors"
          >
            ショッピングを続ける
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
