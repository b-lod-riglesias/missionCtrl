"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Receipt, ClipboardList, History, Settings2, InspectionPanel } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/", label: "Fleet Overview", icon: Bot, stitchSrc: "fleet_overview" },
  { href: "/stitch/inter_agent_logs", label: "Inter-Agent Logs", icon: Receipt, stitchSrc: "inter_agent_logs" },
  { href: "/stitch/protocol_backlog", label: "Protocol Backlog", icon: ClipboardList, stitchSrc: "protocol_backlog" },
  { href: "/stitch/task_board", label: "Task Board", icon: History, stitchSrc: "task_board" },
  { href: "/bots", label: "OpenClaws", icon: InspectionPanel, stitchSrc: null },
  { href: "/stitch/agent_config", label: "Agent Config", icon: Settings2, stitchSrc: "agent_config" },
];

export default function Sidebar({ open }: { open: boolean }) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40 bg-surface-container-low border-r border-outline-variant/10">
      {/* Logo */}
      <div className="p-6 border-b border-outline-variant/10">
        <div className="flex items-center gap-3 mb-2">
          <Settings2 size={20} className="text-primary-fixed" />
          <span className="text-lg font-black text-primary uppercase tracking-widest font-headline">
            MISSION_CTRL
          </span>
        </div>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
          V2.0.4-STABLE
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, stitchSrc }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-4 px-6 py-4 font-label text-xs font-bold uppercase tracking-widest transition-colors",
                isActive
                  ? "bg-surface-container text-primary-fixed border-l-4 border-primary-fixed"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-primary-fixed"
              )}
            >
              <Icon size={18} style={{ fontVariationSettings: "FILL 1" } as React.CSSProperties} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 bg-surface-container-lowest">
        <button className="w-full py-3 bg-primary-fixed text-on-primary-fixed font-bold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
          NEW MISSION
        </button>
        <div className="mt-4 space-y-2">
          <Link href="#" className="flex items-center gap-3 py-2 text-on-surface-variant hover:text-primary-fixed text-[10px] uppercase font-bold tracking-widest">
            <History size={14} />
            System Diagnostics
          </Link>
          <Link href="#" className="flex items-center gap-3 py-2 text-on-surface-variant hover:text-primary-fixed text-[10px] uppercase font-bold tracking-widest">
            <Settings2 size={14} />
            Support
          </Link>
        </div>
      </div>
    </aside>
  );
}
