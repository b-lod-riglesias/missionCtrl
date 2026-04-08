"use client";

import { Bot, Play, Square, RotateCcw, MoreVertical } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import type { Bot as BotType } from "@/types/bot";

type BotStatus = BotType["status"];

interface EnhancedBotCardProps {
  bot: BotType;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onRestart: (id: string) => void;
  onSelect: (bot: BotType) => void;
}

const statusConfig: Record<BotStatus, { color: string; bgColor: string; label: string }> = {
  online: { color: "text-success", bgColor: "bg-success/20", label: "Online" },
  offline: { color: "text-error", bgColor: "bg-error/20", label: "Offline" },
  busy: { color: "text-warning", bgColor: "bg-warning/20", label: "Ocupado" },
  starting: { color: "text-blue-400", bgColor: "bg-blue-400/20", label: "Iniciando..." },
  stopping: { color: "text-orange-400", bgColor: "bg-orange-400/20", label: "Deteniendo..." },
};

export default function EnhancedBotCard({
  bot,
  onStart,
  onStop,
  onRestart,
  onSelect,
}: EnhancedBotCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const config = statusConfig[bot.status];

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setMenuOpen(false);
  };

  const isActionDisabled = bot.status === "starting" || bot.status === "stopping";

  return (
    <div
      className="bg-card border border-border rounded-lg p-4 hover:border-accent transition-all cursor-pointer group"
      onClick={() => onSelect(bot)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-border rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <Bot size={20} />
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded hover:bg-border transition-colors opacity-0 group-hover:opacity-100"
            disabled={isActionDisabled}
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-xl z-10 py-1 min-w-[140px]">
              {bot.status === "offline" ? (
                <button
                  onClick={(e) => handleAction(e, () => onStart(bot.id))}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-border flex items-center gap-2 disabled:opacity-50"
                  disabled={isActionDisabled}
                >
                  <Play size={14} className="text-success" />
                  Iniciar
                </button>
              ) : (
                <button
                  onClick={(e) => handleAction(e, () => onStop(bot.id))}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-border flex items-center gap-2 disabled:opacity-50"
                  disabled={isActionDisabled}
                >
                  <Square size={14} className="text-error" />
                  Detener
                </button>
              )}
              <button
                onClick={(e) => handleAction(e, () => onRestart(bot.id))}
                className="w-full px-3 py-2 text-sm text-left hover:bg-border flex items-center gap-2 disabled:opacity-50"
                disabled={isActionDisabled || bot.status === "offline"}
              >
                <RotateCcw size={14} className="text-warning" />
                Reiniciar
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="font-medium mb-1">{bot.name}</h3>

      <div className="flex items-center gap-2 mb-2">
        <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", config.bgColor, config.color)}>
          {config.label}
        </span>
      </div>

      <p className="text-xs text-gray-500">Última actividad: {bot.lastActivity}</p>
      <p className="text-xs text-gray-500">Uptime: {bot.uptime}</p>

      {bot.channels && bot.channels.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {bot.channels.map((channel) => (
            <span key={channel} className="text-xs px-1.5 py-0.5 bg-border rounded text-gray-400">
              {channel}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
