'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('パスワードが一致しません')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || '登録に失敗しました')
      setLoading(false)
      return
    }

    // 登録成功後、自動ログイン
    await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    router.push('/mypage')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-24">
      <h1 className="text-4xl tracking-tight mb-12 text-center">新規登録</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm mb-2">お名前</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">メールアドレス</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">パスワード（8文字以上）</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">パスワード（確認）</label>
          <input
            type="password"
            required
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          {loading ? '登録中...' : 'アカウントを作成する'}
        </button>
        <p className="text-sm text-center text-gray-600">
          既にアカウントをお持ちの方は
          <Link href="/login" className="underline ml-1">ログイン</Link>
        </p>
      </form>
    </div>
  )
}
