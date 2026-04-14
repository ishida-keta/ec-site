'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSession, signIn } from 'next-auth/react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/mypage'
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('メールアドレスまたはパスワードが正しくありません')
      return
    }

    const session = await getSession()
    const role = (session?.user as { role?: string } | undefined)?.role
    const destination = role === 'ADMIN' ? '/admin' : callbackUrl

    router.push(destination)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}
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
        <label className="block text-sm mb-2">パスワード</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
      >
        {loading ? 'ログイン中...' : 'ログイン'}
      </button>
      <p className="text-sm text-center text-gray-600">
        アカウントをお持ちでない方は
        <Link href="/auth/signup" className="underline ml-1">新規登録</Link>
      </p>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-24">
      <h1 className="text-4xl tracking-tight mb-12 text-center">ログイン</h1>
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
