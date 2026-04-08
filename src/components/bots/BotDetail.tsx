"use client";

import { X, Bot as BotIcon, Activity, Cpu, MemoryStick, Clock, Play, Square, RotateCcw } from "lucide-react";
import type { Bot, BotStats } from "@/types/bot";
import { clsx } from "clsx";

interface BotDetailProps {
  bot: Bot;
  stats?: BotStats;
  onClose: () => void;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onRestart: (id: string) => void;
}

const statusConfig: Record<Bot["status"], { color: string; bgColor: string; label: string }> = {
  online: { color: "text-success", bgColor: "bg-success/20", label: "Online" },
  offline: { color: "text-error", bgColor: "bg-error/20", label: "Offline" },
  busy: { color: "text-warning", bgColor: "bg-warning/20", label: "Ocupado" },
  starting: { color: "text-blue-400", bgColor: "bg-blue-400/20", label: "Iniciando..." },
  stopping: { color: "text-orange-400", bgColor: "bg-orange-400/20", label: "Deteniendo..." },
};

export default function BotDetail({
  bot,
  stats,
  onClose,
  onStart,
  onStop,
  onRestart,
}: BotDetailProps) {
  const config = statusConfig[bot.status];
  const isActionDisabled = bot.status === "starting" || bot.status === "stopping";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <BotIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{bot.name}</h2>
              <span className={clsx("text-sm font-medium", config.color)}>
                {config.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-border transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Actions */}
        <div className="p-6 border-b border-border flex gap-3">
          {bot.status === "offline" ? (
            <button
              onClick={() => onStart(bot.id)}
              disabled={isActionDisabled}
              className="flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors disabled:opacity-50"
            >
              <Play size={18} />
              Iniciar
            </button>
          ) : (
            <button
              onClick={() => onStop(bot.id)}
              disabled={isActionDisabled}
              className="flex items-center gap-2 px-4 py-2 bg-error/20 text-error rounded-lg hover:bg-error/30 transition-colors disabled:opacity-50"
            >
              <Square size={18} />
              Detener
            </button>
          )}
          <button
            onClick={() => onRestart(bot.id)}
            disabled={isActionDisabled || bot.status === "offline"}
            className="flex items-center gap-2 px-4 py-2 bg-warning/20 text-warning rounded-lg hover:bg-warning/30 transition-colors disabled:opacity-50"
          >
            <RotateCcw size={18} />
            Reiniciar
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Estadísticas de hoy</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-background rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Activity size={14} />
                  Peticiones
                </div>
                <p className="text-2xl font-bold">{stats.requestsToday}</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Cpu size={14} />
                  Errores
                </div>
                <p className="text-2xl font-bold text-error">{stats.errorsToday}</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Clock size={14} />
                  Tiempo resp.
                </div>
                <p className="text-2xl font-bold">{stats.avgResponseTime}ms</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <MemoryStick size={14} />
                  Uptime
                </div>
                <p className="text-2xl font-bold text-success">{stats.uptime.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Información</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">ID</span>
              <span className="font-mono text-sm">{bot.id}</span>
            </div>
            {bot.version && (
              <div className="flex justify-between">
                <span className="text-gray-400">Versión</span>
                <span>{bot.version}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Última actividad</span>
              <span>{bot.lastActivity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Uptime total</span>
              <span>{bot.uptime}</span>
            </div>
            {bot.description && (
              <div className="pt-3 border-t border-border">
                <span className="text-gray-400 text-sm">Descripción</span>
                <p className="mt-1 text-sm">{bot.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
