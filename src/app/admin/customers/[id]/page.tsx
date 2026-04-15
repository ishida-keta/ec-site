'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { fulfillmentStatusLabel } from '@/lib/orderLabels';
import { genderLabel } from '@/lib/profileLabels';
import type { Gender } from '@prisma/client';

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { name: string };
};

type OrderRow = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

type CustomerDetail = {
  id: string;
  name: string | null;
  email: string;
  gender: Gender;
  prefecture: string | null;
  createdAt: string;
  orders: OrderRow[];
};

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const [data, setData] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/admin/customers/${id}`)
      .then(async res => {
        if (res.status === 404) {
          setError('顧客が見つかりません');
          setData(null);
          return;
        }
        if (!res.ok) throw new Error('failed');
        const json = await res.json();
        setData(json);
      })
      .catch(() => {
        setError('読み込みに失敗しました');
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500">読み込み中...</div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          顧客一覧に戻る
        </Link>
        <p className="text-red-600">{error ?? '不明なエラー'}</p>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        顧客一覧に戻る
      </Link>

      <h1 className="text-2xl sm:text-3xl tracking-tight mb-2">顧客詳細</h1>
      <p className="text-sm text-gray-600 mb-8">会員情報と注文履歴です。</p>

      <section className="bg-white border border-gray-200 p-4 sm:p-6 mb-8">
        <h2 className="font-medium mb-4">アカウント</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <dt className="text-gray-500">お名前</dt>
            <dd className="mt-0.5">{data.name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">メール</dt>
            <dd className="mt-0.5 break-all">{data.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">性別</dt>
            <dd className="mt-0.5">{genderLabel[data.gender]}</dd>
          </div>
          <div>
            <dt className="text-gray-500">都道府県（プロフィール）</dt>
            <dd className="mt-0.5">{data.prefecture ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">登録日</dt>
            <dd className="mt-0.5">
              {new Date(data.createdAt).toLocaleString('ja-JP')}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-gray-500 mt-4">
          注文の更新・発送ステータスは{' '}
          <Link href="/admin/orders" className="underline">
            注文管理
          </Link>
          から行えます（メール・注文IDで検索）。
        </p>
      </section>

      <section>
        <h2 className="font-medium mb-4">注文履歴（{data.orders.length}件）</h2>
        {data.orders.length === 0 ? (
          <p className="text-gray-500 text-sm">まだ注文がありません。</p>
        ) : (
          <div className="space-y-4">
            {data.orders.map(order => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 p-4 text-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-xs text-gray-500">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span>
                      {new Date(order.createdAt).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-gray-100">
                      {fulfillmentStatusLabel[order.status] ?? order.status}
                    </span>
                    <span className="font-medium tabular-nums">
                      ¥{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <ul className="space-y-1 text-gray-700 border-t border-gray-100 pt-3">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between gap-4">
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="tabular-nums shrink-0">
                        ¥{(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
