/**
 * Prisma の注文関連 enum と UI ラベルの対応（サーバー・クライアント共通）
 */

export const fulfillmentStatusLabel: Record<string, string> = {
  PENDING: '注文確認中',
  PROCESSING: '処理中',
  PAID: '支払い済み',
  SHIPPED: '発送済み',
  DELIVERED: '配送完了',
  CANCELLED: 'キャンセル',
}

export const fulfillmentStatusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  PAID: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
}

export const packageConditionLabel: Record<string, string> = {
  UNCONFIRMED: '未確認',
  UNOPENED: '開封前',
  OPENED: '開封済',
}

export const accountingStatusLabel: Record<string, string> = {
  PENDING: '未会計',
  SETTLED: '会計済',
}

export const returnStatusLabel: Record<string, string> = {
  NONE: '返品なし',
  REQUESTED: '返品申請中',
  APPROVED: '返品承認',
  REJECTED: '返品不可',
  REFUNDED: '返金完了',
}
