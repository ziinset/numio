"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calculator, LayoutDashboard, History } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Belajar",
      href: "/",
      icon: Calculator,
    },
    {
      label: "Progress",
      href: "/progress",
      icon: LayoutDashboard,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
              <Calculator className="h-6 w-6" />
            </div>
            <span className="inline-block font-bold text-xl tracking-tight">Numio</span>
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-full border border-orange-100 dark:border-orange-900/50">
            <span className="text-sm font-bold">0</span>
            <span className="text-xs font-semibold uppercase tracking-wider">🔥 Streak</span>
          </div>
        </div>
      </div>
    </header>
  );
}
