"use client";

import { Bot } from "lucide-react";
import { clsx } from "clsx";

type BotStatus = "online" | "offline" | "busy";

interface Bot {
  id: string;
  name: string;
  status: BotStatus;
  lastActivity: string;
  uptime: string;
}

interface BotCardProps {
  bot: Bot;
}

const statusConfig = {
  online: { color: "bg-success", label: "Online", textColor: "text-success" },
  offline: { color: "bg-error", label: "Offline", textColor: "text-error" },
  busy: { color: "bg-warning", label: "Ocupado", textColor: "text-warning" },
};

export default function BotCard({ bot }: BotCardProps) {
  const config = statusConfig[bot.status];

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-accent transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-border rounded-lg flex items-center justify-center">
          <Bot size={20} />
        </div>
        <div className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", config.textColor)}>
          {config.label}
        </div>
      </div>
      <h3 className="font-medium mb-1">{bot.name}</h3>
      <p className="text-xs text-gray-500">Última actividad: {bot.lastActivity}</p>
      <p className="text-xs text-gray-500">Uptime: {bot.uptime}</p>
    </div>
  );
}
