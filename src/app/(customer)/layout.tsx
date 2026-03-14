import Link from "next/link";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            셔틀투어
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              투어 목록
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-semibold text-gray-800">셔틀투어</p>
              <p className="mt-1 text-sm text-gray-500">
                편리하고 안전한 셔틀 투어 서비스
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <p>문의: 000-0000-0000</p>
              <p>이메일: info@shuttletour.example.com</p>
            </div>
          </div>
          <div className="mt-6 border-t pt-4 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} 셔틀투어. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
