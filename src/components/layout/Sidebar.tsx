"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Zap,
  BarChart3,
  Settings,
  X,
} from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bots", label: "OpenClaws", icon: Bot },
  { href: "/triggers", label: "Triggers", icon: Zap },
  { href: "/stats", label: "Estadísticas", icon: BarChart3 },
  { href: "/settings", label: "Configuración", icon: Settings },
];

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-lg">🎛️</span>
          </div>
          <span className="font-semibold text-lg">Mission Control</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-white"
                  : "text-gray-400 hover:text-white hover:bg-border"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span>Gateway conectado</span>
        </div>
      </div>
    </aside>
  );
}
