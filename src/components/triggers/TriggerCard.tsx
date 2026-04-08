"use client";

import { useState } from "react";
import { Zap, Edit2, Trash2, Play, Pause, MoreVertical } from "lucide-react";
import { clsx } from "clsx";
import type { Trigger } from "@/types/trigger";

interface TriggerCardProps {
  trigger: Trigger;
  onEdit: (trigger: Trigger) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const statusConfig = {
  active: { color: "bg-success", textColor: "text-success", label: "Activo" },
  inactive: { color: "bg-gray-500", textColor: "text-gray-400", label: "Inactivo" },
  error: { color: "bg-error", textColor: "text-error", label: "Error" },
};

const conditionLabels: Record<string, string> = {
  bot_status: "Estado del bot",
  message_contains: "Mensaje contiene",
  keyword: "Keyword",
  schedule: "Programación",
  webhook: "Webhook",
};

const actionLabels: Record<string, string> = {
  send_message: "Enviar mensaje",
  run_command: "Ejecutar comando",
  notify: "Notificar",
  webhook: "Llamar webhook",
  bot_action: "Acción en bot",
};

export default function TriggerCard({ trigger, onEdit, onDelete, onToggle }: TriggerCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const config = statusConfig[trigger.status];

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center", config.color + "/20")}>
            <Zap size={20} className={config.textColor} />
          </div>
          <div>
            <h3 className="font-medium">{trigger.name}</h3>
            <span className={clsx("text-xs font-medium", config.textColor)}>{config.label}</span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded hover:bg-border transition-colors"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-xl z-10 py-1 min-w-[140px]">
              <button
                onClick={() => { onEdit(trigger); setMenuOpen(false); }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-border flex items-center gap-2"
              >
                <Edit2 size={14} />
                Editar
              </button>
              <button
                onClick={() => { onToggle(trigger.id); setMenuOpen(false); }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-border flex items-center gap-2"
              >
                {trigger.status === "active" ? <Pause size={14} /> : <Play size={14} />}
                {trigger.status === "active" ? "Desactivar" : "Activar"}
              </button>
              <button
                onClick={() => { onDelete(trigger.id); setMenuOpen(false); }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-border flex items-center gap-2 text-error"
              >
                <Trash2 size={14} />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {trigger.description && (
        <p className="text-sm text-gray-400 mb-3">{trigger.description}</p>
      )}

      <div className="flex gap-4 text-xs text-gray-500">
        <div>
          <span className="text-gray-400">Condición: </span>
          {conditionLabels[trigger.condition.type] || trigger.condition.type}
        </div>
        <div>
          <span className="text-gray-400">→ </span>
          {actionLabels[trigger.action.type] || trigger.action.type}
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border text-xs text-gray-500">
        <span>Ejecuciones: {trigger.triggerCount}</span>
        {trigger.lastTriggered && <span>Última: {trigger.lastTriggered}</span>}
      </div>
    </div>
  );
}
