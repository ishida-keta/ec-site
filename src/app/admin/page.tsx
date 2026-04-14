import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Package, ShoppingBag, Users, BarChart3, LayoutDashboard } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    redirect('/')
  }

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [productCount, orderCount, userCount, revenueAgg] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        status: { not: 'CANCELLED' },
      },
      _sum: { totalAmount: true },
    }),
  ])

  const monthRevenue = revenueAgg._sum.totalAmount ?? 0

  const stats = [
    { icon: Package, value: String(productCount), label: '登録商品数' },
    { icon: ShoppingBag, value: String(orderCount), label: '総注文数' },
    { icon: Users, value: String(userCount), label: '一般会員数' },
    {
      icon: BarChart3,
      value: `¥${monthRevenue.toLocaleString()}`,
      label: '今月の売上（概算）',
    },
  ]

  const sections = [
    {
      href: '/admin/products',
      icon: Package,
      title: '商品管理',
      desc: '登録・編集・削除、公開設定、在庫',
    },
    {
      href: '/admin/orders',
      icon: ShoppingBag,
      title: '注文管理',
      desc: '全注文の参照・検索・ステータス更新',
    },
    {
      href: '/admin/users',
      icon: Users,
      title: 'ユーザー管理',
      desc: '会員一覧・検索',
    },
  ] as const

  return (
    <div>
      <div className="flex items-start gap-3 mb-8">
        <LayoutDashboard className="w-9 h-9 shrink-0 mt-1" />
        <div>
          <h1 className="text-3xl tracking-tight">管理ダッシュボード</h1>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            ECサイトの運営に必要な商品・注文・会員をここからまとめて管理します。ストア画面（購入・マイページ等）は管理者アカウントでは利用できません。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="bg-white p-6 border border-gray-200">
            <Icon className="w-8 h-8 text-gray-400 mb-4" />
            <p className="text-2xl md:text-3xl mb-1 tabular-nums">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-medium mb-4">管理メニュー</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white p-8 border border-gray-200 hover:border-black transition-colors"
          >
            <Icon className="w-12 h-12 mb-4" />
            <h3 className="text-xl mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-4 bg-gray-100 border border-gray-200 text-sm text-gray-600">
        <p className="font-medium text-gray-800 mb-1">今後の拡張候補</p>
        <p>
          カテゴリ管理・クーポン・分析レポートなどは未実装です。必要に応じてメニューを追加してください。
        </p>
      </div>
    </div>
  )
}
