'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { JAPAN_PREFECTURES } from '@/lib/japanPrefectures';

interface CustomerRow {
  id: string;
  name: string | null;
  email: string;
  gender: string;
  prefecture: string | null;
  createdAt: string;
  _count: { orders: number };
}

interface ApiResponse {
  users: CustomerRow[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

type SortKey = 'createdAt' | 'name' | 'email' | 'orderCount';
type SortOrder = 'asc' | 'desc';

const GENDER_LABELS: Record<string, string> = {
  MALE: '男性', FEMALE: '女性', UNKNOWN: '未設定',
};

const LIMIT_OPTIONS = [20, 50, 100];

function SortIcon({ col, sortBy, sortOrder }: { col: SortKey; sortBy: SortKey; sortOrder: SortOrder }) {
  if (col !== sortBy) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />;
  return sortOrder === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-black" />
    : <ChevronDown className="w-3.5 h-3.5 text-black" />;
}

export default function AdminCustomersPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // フィルター
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [gender, setGender] = useState('');
  const [hasOrders, setHasOrders] = useState('');

  // ソート・ページ
  const [sortBy, setSortBy] = useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(prefecture && { prefecture }),
        ...(gender && { gender }),
        ...(hasOrders && { hasOrders }),
        sortBy,
        sortOrder,
        page: String(page),
        limit: String(limit),
      });
      const res = await fetch(`/api/admin/customers?${params}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError('顧客情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [search, prefecture, gender, hasOrders, sortBy, sortOrder, page, limit]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  // 検索入力はデバウンス
  const handleInputChange = (v: string) => {
    setInputValue(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(v);
      setPage(1);
    }, 400);
  };

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  const handleSort = (col: SortKey) => {
    if (sortBy === col) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const activeFilters = [
    search && { label: `検索: ${search}`, clear: () => { setSearch(''); setInputValue(''); setPage(1); } },
    prefecture && { label: prefecture, clear: () => handleFilterChange(setPrefecture)('') },
    gender && { label: GENDER_LABELS[gender] ?? gender, clear: () => handleFilterChange(setGender)('') },
    hasOrders && { label: hasOrders === 'yes' ? '注文あり' : '注文なし', clear: () => handleFilterChange(setHasOrders)('') },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const resetAll = () => {
    setSearch(''); setInputValue(''); setPrefecture(''); setGender(''); setHasOrders('');
    setSortBy('createdAt'); setSortOrder('desc'); setPage(1);
  };

  const thClass = (col: SortKey) =>
    `px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer select-none hover:bg-gray-100 whitespace-nowrap`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl tracking-tight">顧客管理</h1>
        <p className="text-sm text-gray-500 mt-1">会員（お客様）のみ表示。管理者アカウントは除外しています。</p>
      </div>

      {/* フィルターパネル */}
      <div className="bg-white border border-gray-200 p-4 sm:p-6 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* テキスト検索 */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="名前・メールで検索..."
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* 都道府県 */}
          <select
            value={prefecture}
            onChange={e => handleFilterChange(setPrefecture)(e.target.value)}
            className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">都道府県 すべて</option>
            {JAPAN_PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* 性別 */}
          <select
            value={gender}
            onChange={e => handleFilterChange(setGender)(e.target.value)}
            className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">性別 すべて</option>
            <option value="MALE">男性</option>
            <option value="FEMALE">女性</option>
            <option value="UNKNOWN">未設定</option>
          </select>

          {/* 注文有無 */}
          <select
            value={hasOrders}
            onChange={e => handleFilterChange(setHasOrders)(e.target.value)}
            className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">注文 すべて</option>
            <option value="yes">注文あり</option>
            <option value="no">注文なし</option>
          </select>
        </div>

        {/* アクティブフィルタチップ */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-gray-400">絞り込み中:</span>
            {activeFilters.map(f => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-xs rounded"
              >
                {f.label}
                <button onClick={f.clear}><X className="w-3 h-3 text-gray-500 hover:text-black" /></button>
              </span>
            ))}
            <button onClick={resetAll} className="text-xs text-blue-600 hover:underline ml-1">すべてリセット</button>
          </div>
        )}
      </div>

      {/* 件数・ページサイズ */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-sm text-gray-500">
          {loading ? '読み込み中...' : `全 ${data?.total ?? 0} 件`}
          {data && data.totalPages > 1 && ` (${page} / ${data.totalPages} ページ)`}
        </p>
        <select
          value={limit}
          onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
          className="px-2 py-1 border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-black"
        >
          {LIMIT_OPTIONS.map(n => <option key={n} value={n}>{n}件表示</option>)}
        </select>
      </div>

      {/* テーブル */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {error ? (
          <div className="flex items-center justify-center h-40 text-red-500 text-sm">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className={thClass('name')} onClick={() => handleSort('name')}>
                    <span className="flex items-center gap-1">名前 <SortIcon col="name" sortBy={sortBy} sortOrder={sortOrder} /></span>
                  </th>
                  <th className={thClass('email')} onClick={() => handleSort('email')}>
                    <span className="flex items-center gap-1">メール <SortIcon col="email" sortBy={sortBy} sortOrder={sortOrder} /></span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap">性別</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap">都道府県</th>
                  <th className={thClass('orderCount')} onClick={() => handleSort('orderCount')}>
                    <span className="flex items-center gap-1">注文数 <SortIcon col="orderCount" sortBy={sortBy} sortOrder={sortOrder} /></span>
                  </th>
                  <th className={thClass('createdAt')} onClick={() => handleSort('createdAt')}>
                    <span className="flex items-center gap-1">登録日 <SortIcon col="createdAt" sortBy={sortBy} sortOrder={sortOrder} /></span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : data?.users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                      該当する顧客がいません
                    </td>
                  </tr>
                ) : (
                  data?.users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">{user.name ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{GENDER_LABELS[user.gender] ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{user.prefecture ?? '—'}</td>
                      <td className="px-4 py-3 text-sm tabular-nums">
                        {user._count.orders > 0
                          ? <span className="font-medium">{user._count.orders}</span>
                          : <span className="text-gray-300">0</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          href={`/admin/customers/${user.id}`}
                          className="text-sm text-black underline underline-offset-2 hover:opacity-70"
                        >
                          詳細・注文
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ページネーション */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 border border-gray-300 disabled:opacity-30 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: data.totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === data.totalPages || Math.abs(p - page) <= 2)
            .reduce<(number | '...')[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === '...' ? (
                <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-8 h-8 text-sm border ${page === p ? 'bg-black text-white border-black' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              )
            )}
          <button
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="p-1.5 border border-gray-300 disabled:opacity-30 hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
