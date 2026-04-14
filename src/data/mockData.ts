// 注意: 商品データは Supabase DB に移行済み。mockProducts は削除して良い。
// mockOrders は admin/orders ページが DB 連携されるまでの暫定データ。

interface MockOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface MockShippingAddress {
  name: string;
  zipCode: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: MockOrderItem[];
  shippingAddress: MockShippingAddress;
}

export const mockOrders: Order[] = [
  {
    id: 1001,
    userId: 1,
    totalAmount: 75400,
    status: 'delivered',
    createdAt: '2026-03-15T10:30:00',
    items: [
      { productId: 1, productName: 'プレミアムワイヤレスヘッドフォン', quantity: 1, price: 29800 },
      { productId: 2, productName: 'スマートウォッチ Pro', quantity: 1, price: 45000 },
    ],
    shippingAddress: {
      name: '山田太郎',
      zipCode: '150-0001',
      city: '東京都渋谷区',
      address: '神宮前1-2-3',
      phone: '03-1234-5678',
      email: 'yamada@example.com',
    },
  },
  {
    id: 1002,
    userId: 1,
    totalAmount: 12800,
    status: 'shipped',
    createdAt: '2026-04-01T14:20:00',
    items: [
      { productId: 3, productName: 'ミニマルバックパック', quantity: 1, price: 12800 },
    ],
    shippingAddress: {
      name: '山田太郎',
      zipCode: '150-0001',
      city: '東京都渋谷区',
      address: '神宮前1-2-3',
      phone: '03-1234-5678',
      email: 'yamada@example.com',
    },
  },
  {
    id: 1003,
    userId: 1,
    totalAmount: 24500,
    status: 'processing',
    createdAt: '2026-04-10T09:15:00',
    items: [
      { productId: 4, productName: 'ポータブルスピーカー', quantity: 1, price: 8900 },
      { productId: 5, productName: 'デザイナーズサングラス', quantity: 1, price: 15600 },
    ],
    shippingAddress: {
      name: '山田太郎',
      zipCode: '150-0001',
      city: '東京都渋谷区',
      address: '神宮前1-2-3',
      phone: '03-1234-5678',
      email: 'yamada@example.com',
    },
  },
];

export const statusLabel: Record<string, string> = {
  pending: '注文確認中',
  processing: '処理中',
  shipped: '発送済み',
  delivered: '配送完了',
  cancelled: 'キャンセル',
};

export const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};
