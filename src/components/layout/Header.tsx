"use client";

import { Bell, Search, Terminal, Menu, Settings2 } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
  title?: string;
}

export default function Header({ onToggleSidebar, title = "SYNTHETIC SENTINEL" }: HeaderProps) {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-background flex items-center justify-between px-6 z-30">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-black text-primary-fixed drop-shadow-[0_0_8px_rgba(0,245,255,0.4)] font-headline tracking-tighter uppercase">
          {title}
        </h1>
        <div className="hidden lg:flex items-center bg-surface-container-low px-3 py-1 gap-2 border border-outline-variant/20">
          <Search size={14} className="text-on-surface-variant" />
          <input
            type="text"
            placeholder="QUERY_SYSTEM_NODE..."
            className="bg-transparent border-none focus:ring-0 text-xs text-on-surface w-48 font-label uppercase placeholder:text-outline-variant/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary-fixed transition-all">
            <Settings2 size={18} />
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary-fixed transition-all">
            <Bell size={18} />
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary-fixed transition-all">
            <Terminal size={18} />
          </button>
        </div>
        <button
          onClick={onToggleSidebar}
          className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary-fixed transition-all lg:hidden"
        >
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
}
