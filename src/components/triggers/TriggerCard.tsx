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
  active: { bgColor: "bg-secondary/20", textColor: "text-secondary", label: "ACTIVE" },
  inactive: { bgColor: "bg-outline-variant/20", textColor: "text-on-surface-variant", label: "INACTIVE" },
  error: { bgColor: "bg-error/20", textColor: "text-error", label: "ERROR" },
};

const conditionLabels: Record<string, string> = {
  bot_status: "BOT STATUS",
  message_contains: "MSG CONTAINS",
  keyword: "KEYWORD",
  schedule: "SCHEDULE",
  webhook: "WEBHOOK",
};

const actionLabels: Record<string, string> = {
  send_message: "SEND MSG",
  run_command: "RUN CMD",
  notify: "NOTIFY",
  webhook: "WEBHOOK",
  bot_action: "BOT ACTION",
};

export default function TriggerCard({ trigger, onEdit, onDelete, onToggle }: TriggerCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const config = statusConfig[trigger.status];

  return (
    <div className="bg-surface-container-low border border-outline-variant/50 rounded p-4 hover:border-primary-fixed/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={clsx("w-10 h-10 rounded flex items-center justify-center", config.bgColor)}>
            <Zap size={20} className={config.textColor} />
          </div>
          <div>
            <h3 className="font-headline font-bold text-sm uppercase">{trigger.name}</h3>
            <span className={clsx("text-[10px] font-bold font-label", config.textColor)}>{config.label}</span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded hover:bg-surface-container transition-colors"
          >
            <MoreVertical size={16} className="text-on-surface-variant" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 bg-surface-container border border-outline-variant rounded shadow-xl z-10 py-1 min-w-[140px]">
              <button
                onClick={() => { onEdit(trigger); setMenuOpen(false); }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-surface-container-high flex items-center gap-2 font-label uppercase tracking-widest"
              >
                <Edit2 size={14} />
                EDIT
              </button>
              <button
                onClick={() => { onToggle(trigger.id); setMenuOpen(false); }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-surface-container-high flex items-center gap-2 font-label uppercase tracking-widest"
              >
                {trigger.status === "active" ? <Pause size={14} /> : <Play size={14} />}
                {trigger.status === "active" ? "DEACTIVATE" : "ACTIVATE"}
              </button>
              <button
                onClick={() => { onDelete(trigger.id); setMenuOpen(false); }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-surface-container-high flex items-center gap-2 text-error font-label uppercase tracking-widest"
              >
                <Trash2 size={14} />
                DELETE
              </button>
            </div>
          )}
        </div>
      </div>

      {trigger.description && (
        <p className="text-sm text-on-surface-variant mb-3">{trigger.description}</p>
      )}

      <div className="flex gap-4 text-[10px] font-label text-on-surface-variant">
        <div>
          <span className="text-outline">COND: </span>
          {conditionLabels[trigger.condition.type] || trigger.condition.type}
        </div>
        <div>
          <span className="text-outline">→ </span>
          {actionLabels[trigger.action.type] || trigger.action.type}
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-outline-variant/50 text-[10px] font-mono text-on-surface-variant">
        <span>EXECUTED: {trigger.triggerCount}</span>
        {trigger.lastTriggered && <span>LAST: {trigger.lastTriggered}</span>}
      </div>
    </div>
  );
}
