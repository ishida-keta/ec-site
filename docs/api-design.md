# API設計書

最終更新: 2026-04-14（管理者の一般向けAPI利用制限）

## 概要

Next.js App Router の Route Handlers（`src/app/api/`）で実装。

## 認証

- NextAuth.js のセッションCookieで認証
- 管理者APIは `role: ADMIN` を追加チェック
- **`role: ADMIN` のユーザー**は、会員向けの `GET /api/orders`・`POST /api/checkout/session`・`PUT /api/user/profile` を **403**（利用不可）。注文の参照・更新は `GET/PUT /api/admin/orders` を使用する。

## エンドポイント一覧

### 認証

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| POST | /api/auth/signup | 新規会員登録 ✅ 実装済み | 不要 |
| POST | /api/auth/[...nextauth] | NextAuth.js ハンドラ ✅ 実装済み | - |

### ユーザー（マイページ）

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| PUT | /api/user/profile | プロフィール更新（名前） ✅ 実装済み | 必要（ADMIN は 403） |

### 商品

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| GET | /api/products | 商品一覧（公開商品のみ） | 不要 |
| GET | /api/products/[id] | 商品詳細 | 不要 |

### 注文

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| GET | /api/orders | 自分の注文一覧 ✅ 実装済み | 必要（ADMIN は 403） |
| GET | /api/orders/[id] | 注文詳細 | 必要（本人のみ） |

### 決済（Stripe）

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| POST | /api/checkout/session | Stripe Checkout Session作成 ✅ 実装済み | 必要（ADMIN は 403） |
| GET  | /api/checkout/verify | Stripe Session情報取得 ✅ 実装済み | 不要 |
| POST | /api/webhooks/stripe | Stripe Webhook受信・注文DB保存 ✅ 実装済み | Stripe署名検証 |

### 管理者 API

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| GET | /api/admin/products | 全商品一覧（非公開含む） ✅ 実装済み | ADMIN |
| POST | /api/admin/products | 商品登録 ✅ 実装済み | ADMIN |
| PUT | /api/admin/products/[id] | 商品更新 ✅ 実装済み | ADMIN |
| DELETE | /api/admin/products/[id] | 商品削除 ✅ 実装済み | ADMIN |
| GET | /api/admin/orders | 全注文一覧（`search`: 名前・メール・注文ID 等） ✅ 実装済み | ADMIN |
| PUT | /api/admin/orders/[id] | 注文ステータス更新 ✅ 実装済み | ADMIN |
| GET | /api/admin/users | ユーザー一覧 ✅ 実装済み | ADMIN |

## リクエスト/レスポンス例

### POST /api/orders
```json
// Request
{
  "items": [
    { "productId": "clxxx", "quantity": 2 }
  ],
  "shippingName": "山田 太郎",
  "shippingAddress": "東京都渋谷区xxx",
  "shippingZip": "150-0001"
}

// Response 200
{
  "orderId": "clyyy",
  "totalAmount": 5000
}
```

### POST /api/checkout/session
```json
// Request
{ "orderId": "clyyy" }

// Response 200
{ "url": "https://checkout.stripe.com/..." }
```
