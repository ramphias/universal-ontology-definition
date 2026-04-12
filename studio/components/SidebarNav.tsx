"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarNav() {
  const pathname = usePathname();

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
    </nav>
  );
}
