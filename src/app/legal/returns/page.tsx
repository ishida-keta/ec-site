import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '返品・契約解除について | EC STORE',
  description: '返品、クーリングオフ、返金について（特定商取引法等の概要）',
}

export default function LegalReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl tracking-tight mb-2">返品・契約解除・返金について</h1>
      <p className="text-sm text-gray-500 mb-10">最終更新: 2026年4月15日</p>

      <div className="space-y-8 text-gray-800 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. 適用される法令</h2>
          <p>
            通信販売（インターネット通販）については、<strong>特定商取引法</strong>、
            <strong>民法</strong>（契約不適合責任・消費者契約法等）などが適用されます。
            本ページは学習・ポートフォリオ用サイトのため、一般的な説明にとどまります。
            個別の権利義務の有無は、ご契約内容・到着書面・商品の性質により異なります。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. クーリングオフ（無条件解除）の期間</h2>
          <p>
            特定商取引法上、一定の通信販売では、事業者から交付を受けた<strong>書面の到達した日から8日を経過するまでの間</strong>に、
            消費者は<strong>クーリングオフ</strong>（無条件での契約解除）を行うことができます（法定の要件・除外事由あり）。
            インターネット通販では、書面の交付方法・表示内容により起算日が異なる場合があります。
          </p>
          <p className="mt-3">
            <strong>申出期限</strong>は法令の定める期間に従ってください。
            申出は、当ストアが案内する連絡手段（マイページからのお問い合わせ等）にて受け付けます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. 返金額について</h2>
          <p>
            クーリングオフや契約不適合に基づく解除・返品が認められる場合の<strong>返金額・範囲</strong>は、
            <strong>法令の定めるところによります</strong>。本サイトは、法令で定められた基準に従い、
            商品代金・送料の払い戻し等を行います。運営者が独自の割引ルールで返金額を減額するものではありません。
          </p>
          <p className="mt-3 text-sm text-gray-600">
            ※ クーリングオフにおいて、お客様の責めに帰すべき事由により商品の価値が減少した場合など、
            法令上返金額が調整されることがあります。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. 開封済み商品・使用済み商品</h2>
          <p>
            クーリングオフでは、お客様が<strong>使用により商品の価値を著しく減少させた場合</strong>など、
            法令上契約を解除できないことがあります。返品をご希望の際は、可能な範囲で<strong>開封前の状態</strong>でご返送ください。
            管理者は注文ごとに「開封前」「開封済」等の確認状況を記録し、法令に照らして対応します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. 会計・返金処理のステータス</h2>
          <p>
            注文データ上では、<strong>会計（売上計上）の状態</strong>および<strong>返品・返金の進捗</strong>を管理します。
            返金実行後は「返金完了」等の状態に更新され、返金額は<strong>決済事業者・銀行の処理</strong>に従います。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. 詳細・お問い合わせ</h2>
          <p>
            消費者庁の公開情報や、商品到着時に同封・表示される説明書面もあわせてご確認ください。
            本サイトに関する返品のご相談は、
            <Link href="/mypage" className="underline hover:text-gray-600">マイページ</Link>
            からお問い合わせください（デモ環境のため、実際の連絡先は運営で設定してください）。
          </p>
        </section>
      </div>

      <p className="mt-12 text-sm">
        <Link href="/" className="text-gray-600 underline hover:text-gray-900">トップへ戻る</Link>
      </p>
    </div>
  )
}
