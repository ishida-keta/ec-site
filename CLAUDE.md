# ECサイト

## プロジェクト概要
学習・ポートフォリオ目的のBtoC型ECプラットフォーム。

## 技術スタック
- Framework: Next.js 14+ (App Router) + TypeScript
- Styling: Tailwind CSS
- ORM: Prisma
- DB: Supabase (PostgreSQL)
- Auth: NextAuth.js (Auth.js v5)
- Payment: Stripe
- Storage: Supabase Storage
- Deploy: Vercel

## ディレクトリ構成
```
src/
├── app/           # App Router pages & layouts
├── components/    # 再利用コンポーネント
├── lib/           # ユーティリティ・設定
└── types/         # 型定義
prisma/
└── schema.prisma  # DBスキーマ
docs/              # 設計ドキュメント
```

## 開発コマンド
- `npm run dev` — 開発サーバー起動
- `npx prisma studio` — DB GUI
- `npx prisma db push` — スキーマをDBに反映
- `DATABASE_URL="$DIRECT_URL" npx prisma db push --accept-data-loss` — Supabase direct接続で反映（poolerで詰まる場合）
- `npx prisma generate` — Prismaクライアント生成

### Prisma P2022（カラムが存在しない）が出たら

- **意味**: `prisma/schema.prisma` にはあるが、**接続先 PostgreSQL にまだカラムがない**（アプリと DB の定義がズレている）。
- **なぜ繰り返しやすいか**:
  - `git pull` でスキーマファイルは更新されるが、**リモート DB（Supabase）は自動では変わらない**。誰かが `db push` / migrate を実行するまでカラムは増えない。
  - シェルに `.env.local` が読み込まれておらず `DIRECT_URL` が空 → `db push` が別 DB に向いたり失敗したりする。
- **対応（毎回これでよい）**:
  ```bash
  cd /path/to/ec-site
  set -a; source .env.local; set +a
  DATABASE_URL="$DIRECT_URL" npx prisma db push
  npx prisma generate   # 念のため
  ```
  その後 `npm run dev` を再起動。
- **習慣**: `git pull` したあと `prisma/schema.prisma` に差分があれば、**その日のうちに**上記を実行する。
- `stripe listen --forward-to localhost:3000/api/webhooks/stripe` — ローカルWebhook検証（表示された `whsec_...` を `STRIPE_WEBHOOK_SECRET` に設定）。**dev サーバーのポート**（例: `3001`）に合わせて URL を変えること。

## 環境変数（.env.local）
```
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=        # 本番・Preview の絶対 URL。開発でポートがずれても Checkout の戻り先は API が Origin を優先する。
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## ドキュメント同期ルール（必須）

実装変更時は、影響するドキュメントを**同じコミットで必ず更新**する。

| 変更内容 | 更新が必要なドキュメント |
|---------|----------------------|
| ページ追加・削除・パス変更 | `docs/screen-flow.md` |
| 機能の追加・変更・削除・ステータス更新 | `docs/feature-list.md` |
| テーブル・カラム・Enum の変更 | `docs/db-design.md` + `prisma/schema.prisma` |
| APIエンドポイントの追加・変更・削除 | `docs/api-design.md` |
| 画面レイアウトの大幅変更 | `docs/wireframe.md` |
| 作業履歴・マイルストーンの記録 | `docs/work-log.md` |
| 設計課題・拡張バックログの追加・消化 | `docs/design-backlog.md` |

- ドキュメントの `最終更新:` 日付も合わせて更新すること
- 実装だけ変えてドキュメントを放置しない

## Git運用
- 作業前: git pull
- 作業後: git add . && git commit -m "{変更内容}" && git push
