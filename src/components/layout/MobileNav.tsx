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
  { href: "/dashboard",    labelAr: "رئيسية",    icon: LayoutDashboard },
  { href: "/transactions", labelAr: "معاملات",   icon: ArrowLeftRight },
  { href: "/goals",        labelAr: "أهداف",     icon: Target },
  { href: "/zakat",        labelAr: "زكاة",      icon: Moon },
  { href: "/insights",     labelAr: "رؤى",       icon: Lightbulb },
];

/**
 * Mobile bottom navigation bar (visible on < lg screens).
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-white/90 backdrop-blur-xl border-t border-border">
      <div className="grid grid-cols-5 h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-0.5"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute top-0 w-8 h-0.5 bg-sukuk-green rounded-full"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.6}
                className={cn(
                  "transition-colors duration-150",
                  isActive ? "text-sukuk-green" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-[10px] transition-colors duration-150",
                  isActive
                    ? "text-sukuk-green font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {item.labelAr}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
