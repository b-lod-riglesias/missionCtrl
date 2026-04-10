"use client";

import { useState } from "react";
import { X, Zap, ArrowRight } from "lucide-react";
import type { Trigger, TriggerCondition, TriggerAction } from "@/types/trigger";

interface TriggerEditorProps {
  trigger?: Trigger;
  onSave: (trigger: Partial<Trigger>) => void;
  onClose: () => void;
  bots: { id: string; name: string }[];
}

const conditionTypes = [
  { value: "bot_status", label: "BOT STATUS" },
  { value: "message_contains", label: "MSG CONTAINS" },
  { value: "keyword", label: "KEYWORD" },
  { value: "schedule", label: "SCHEDULE" },
  { value: "webhook", label: "WEBHOOK" },
];

const actionTypes = [
  { value: "send_message", label: "SEND MSG" },
  { value: "run_command", label: "RUN CMD" },
  { value: "notify", label: "NOTIFY" },
  { value: "webhook", label: "WEBHOOK" },
  { value: "bot_action", label: "BOT ACTION" },
];

export default function TriggerEditor({ trigger, onSave, onClose, bots }: TriggerEditorProps) {
  const [name, setName] = useState(trigger?.name || "");
  const [description, setDescription] = useState(trigger?.description || "");
  const [conditionType, setConditionType] = useState<TriggerCondition["type"]>(
    trigger?.condition.type || "bot_status"
  );
  const [conditionValue, setConditionValue] = useState(trigger?.condition.value || "");
  const [conditionBotId, setConditionBotId] = useState(trigger?.condition.botId || "");
  const [actionType, setActionType] = useState<TriggerAction["type"]>(
    trigger?.action.type || "send_message"
  );
  const [actionBotId, setActionBotId] = useState(trigger?.action.targetBotId || "");
  const [actionTemplate, setActionTemplate] = useState(trigger?.action.template || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const condition: TriggerCondition = {
      type: conditionType,
      value: conditionValue,
      botId: conditionBotId || undefined,
    };

    const action: TriggerAction = {
      type: actionType,
      targetBotId: actionBotId || undefined,
      template: actionTemplate || undefined,
    };

    onSave({
      name,
      description,
      condition,
      action,
      status: "active",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-low border border-outline-variant rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 className="text-xl font-black text-primary-fixed font-headline uppercase tracking-widest">
            {trigger ? "EDIT TRIGGER" : "NEW TRIGGER"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-container transition-colors">
            <X size={20} className="text-on-surface-variant" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 font-label">
                Trigger Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ALERT: LOW STOCK"
                required
                className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded focus:outline-none focus:border-primary-fixed font-label uppercase placeholder:text-outline-variant/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 font-label">
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What this trigger does..."
                className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded focus:outline-none focus:border-primary-fixed font-label uppercase placeholder:text-outline-variant/50"
              />
            </div>
          </div>

          {/* Condition */}
          <div className="bg-surface-container rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Zap size={16} className="text-tertiary-fixed-dim" />
              <span className="font-headline uppercase tracking-widest text-tertiary-fixed-dim">CONDITION</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-label">Type</label>
                <select
                  value={conditionType}
                  onChange={(e) => setConditionType(e.target.value as TriggerCondition["type"])}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded focus:outline-none focus:border-primary-fixed font-label"
                >
                  {conditionTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {(conditionType === "bot_status") && (
                <div>
                  <label className="block text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-label">Bot</label>
                  <select
                    value={conditionBotId}
                    onChange={(e) => setConditionBotId(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded focus:outline-none focus:border-primary-fixed font-label"
                  >
                    <option value="">SELECT BOT...</option>
                    {bots.map((bot) => (
                      <option key={bot.id} value={bot.id}>
                        {bot.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(conditionType !== "bot_status" && conditionType !== "schedule") && (
                <div>
                  <label className="block text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-label">Value</label>
                  <input
                    type="text"
                    value={conditionValue}
                    onChange={(e) => setConditionValue(e.target.value)}
                    placeholder="VALUE TO MATCH..."
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded focus:outline-none focus:border-primary-fixed font-label uppercase placeholder:text-outline-variant/50"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight size={24} className="text-outline" />
          </div>

          {/* Action */}
          <div className="bg-surface-container rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Zap size={16} className="text-primary-fixed" />
              <span className="font-headline uppercase tracking-widest text-primary-fixed">ACTION</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-label">Type</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as TriggerAction["type"])}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded focus:outline-none focus:border-primary-fixed font-label"
                >
                  {actionTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {(actionType === "bot_action" || actionType === "send_message") && (
                <div>
                  <label className="block text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-label">Target Bot</label>
                  <select
                    value={actionBotId}
                    onChange={(e) => setActionBotId(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded focus:outline-none focus:border-primary-fixed font-label"
                  >
                    <option value="">SELECT BOT...</option>
                    {bots.map((bot) => (
                      <option key={bot.id} value={bot.id}>
                        {bot.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {(actionType === "send_message" || actionType === "notify") && (
              <div>
                <label className="block text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-label">Message / Template</label>
                <textarea
                  value={actionTemplate}
                  onChange={(e) => setActionTemplate(e.target.value)}
                  placeholder="⚠️ ALERT: Low stock on {{product}}"
                  rows={2}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded focus:outline-none focus:border-primary-fixed font-label resize-none uppercase placeholder:text-outline-variant/50"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline-variant rounded hover:bg-surface-container transition-colors font-label text-xs font-bold uppercase tracking-widest"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-fixed text-on-primary-fixed rounded hover:brightness-110 transition-colors font-label text-xs font-black uppercase tracking-widest"
            >
              {trigger ? "SAVE CHANGES" : "CREATE TRIGGER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
