"use client";

import { Bell, Search, Menu } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-border transition-colors"
        >
          <Menu size={18} />
        </button>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-9 pr-4 py-1.5 bg-background border border-border rounded-lg text-sm w-64 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-border transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-medium">
          RI
        </div>
      </div>
    </header>
  );
}
