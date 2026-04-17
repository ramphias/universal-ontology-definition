"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { getPendingEditCount } from "@/lib/edit-actions";

export function SidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [pendingCount, setPendingCount] = useState(0);

  const isAdmin = session?.user?.role === "admin";

  // Poll the pending review count every 30s while an admin is signed in.
  useEffect(() => {
    if (!isAdmin) {
      setPendingCount(0);
      return;
    }
    let cancelled = false;
    const refresh = () => {
      getPendingEditCount()
        .then((n) => { if (!cancelled) setPendingCount(n); })
        .catch(() => { /* ignore transient errors */ });
    };
    refresh();
    const timer = setInterval(refresh, 30_000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [isAdmin, pathname]);

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "L0 - Platform", href: "/layer/L0" },
    { name: "L1 - Core", href: "/layer/L1" },
    { name: "L2 - Extensions", href: "/layer/L2" },
    { name: "L3 - Enterprise", href: "/layer/L3" },
  ];

  return (
    <nav className="flex-1 overflow-y-auto p-4 space-y-2 text-sm text-[#A0A0A0]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-md transition-colors group flex items-center justify-between ${
              isActive
                ? "text-white bg-[#333] border-l-2 border-deloitte-green font-medium"
                : "hover:bg-[#333] hover:text-white"
            }`}
          >
            {item.name}
            {!isActive && <span className="opacity-0 group-hover:opacity-100">&rarr;</span>}
          </Link>
        );
      })}

      {isAdmin && (
        <>
          <div className="border-t border-[#333] my-3" />
          <Link
            href="/admin"
            className={`block px-3 py-2 rounded-md transition-colors group flex items-center justify-between ${
              pathname === "/admin"
                ? "text-white bg-[#333] border-l-2 border-red-500 font-medium"
                : "hover:bg-[#333] hover:text-white"
            }`}
          >
            Admin
            {pathname !== "/admin" && <span className="opacity-0 group-hover:opacity-100">&rarr;</span>}
          </Link>
          <Link
            href="/admin/review"
            className={`block px-3 py-2 rounded-md transition-colors group flex items-center justify-between ${
              pathname === "/admin/review"
                ? "text-white bg-[#333] border-l-2 border-red-500 font-medium"
                : "hover:bg-[#333] hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              Review Queue
              {pendingCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 bg-red-500 text-white text-[10px] font-semibold rounded-full">
                  {pendingCount > 99 ? "99+" : pendingCount}
                </span>
              )}
            </span>
            {pathname !== "/admin/review" && pendingCount === 0 && (
              <span className="opacity-0 group-hover:opacity-100">&rarr;</span>
            )}
          </Link>
        </>
      )}
    </nav>
  );
}
