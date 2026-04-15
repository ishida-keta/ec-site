import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
          <Link href="/legal/returns" className="hover:text-gray-900 underline-offset-4 hover:underline">
            返品・契約解除について
          </Link>
        </nav>
        <p className="text-sm text-gray-500 text-center">© 2026 EC STORE. All rights reserved.</p>
      </div>
    </footer>
  );
}
