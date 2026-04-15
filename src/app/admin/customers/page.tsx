'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface CustomerRow {
  id: string;
  name: string | null;
  email: string;
  gender: string;
  prefecture: string | null;
  createdAt: string;
  _count: { orders: number };
}

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<CustomerRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async (search: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/admin/customers${params}`);
      if (!res.ok) throw new Error('取得に失敗しました');
      const data = await res.json();
      setUsers(data);
    } catch {
      setError('顧客情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers('');
  }, []);

  const handleSearch = () => {
    setSearchTerm(inputValue);
    fetchCustomers(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl tracking-tight">顧客管理</h1>
        <p className="text-sm text-gray-600 mt-1">
          会員（お客様）のみ表示します。管理者アカウントは「従業員」として別管理予定のためここには出ません。
        </p>
      </div>

      <div className="bg-white border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="名前またはメールで検索..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 pl-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors text-sm"
          >
            検索
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">名前</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">メール</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">注文数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">登録日</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{user.name ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 break-all">{user.email}</td>
                    <td className="px-4 py-3 text-sm tabular-nums">{user._count.orders}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/customers/${user.id}`}
                        className="text-sm text-black underline underline-offset-2 hover:opacity-70"
                      >
                        詳細・注文
                      </Link>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                      {searchTerm ? '該当する顧客がいません' : '顧客がいません'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
