"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Moon,
  Lightbulb,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", labelAr: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/transactions", labelAr: "المعاملات", icon: ArrowLeftRight },
  { href: "/goals", labelAr: "الأهداف", icon: Target },
  { href: "/zakat", labelAr: "الزكاة", icon: Moon },
  { href: "/insights", labelAr: "رؤى وتحليلات", icon: Lightbulb },
];

/**
 * Desktop sidebar navigation.
 * Fixed on the right side (RTL) with brand logo + nav links.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col h-screen w-60 fixed start-0 top-0 z-40 bg-white/80 backdrop-blur-xl border-e border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-sukuk-green flex items-center justify-center text-white font-heading font-bold text-sm">
          ص
        </div>
        <div>
          <p className="font-heading font-bold text-sm text-foreground">فكة</p>
          <p className="text-[11px] text-muted-foreground">استثمر فكتك</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="relative block">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 rounded-xl bg-sukuk-green-muted"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150",
                  isActive
                    ? "text-sukuk-green font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.labelAr}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[11px] text-muted-foreground text-center">
          متوافق مع أحكام الشريعة ✓
        </p>
      </div>
    </aside>
  );
}
