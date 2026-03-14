"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/tours", label: "투어 관리" },
  { href: "/admin/reservations", label: "예약 관리" },
];

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // login page should not use admin layout shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col bg-slate-800 min-h-screen">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-lg font-bold text-white">셔틀투어 관리</h1>
        </div>
        <SidebarNav pathname={pathname} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetContent side="left" className="w-60 p-0 bg-slate-800 border-slate-700">
                <div className="p-4 border-b border-slate-700">
                  <h1 className="text-lg font-bold text-white">셔틀투어 관리</h1>
                </div>
                <SidebarNav
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <span className="text-sm font-medium text-slate-600">관리자</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            로그아웃
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-slate-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
