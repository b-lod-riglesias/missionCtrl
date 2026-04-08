"use client";

import { useState } from "react";
import { X, Plus, Zap, ArrowRight, Trash2 } from "lucide-react";
import type { Trigger, TriggerCondition, TriggerAction } from "@/types/trigger";

interface TriggerEditorProps {
  trigger?: Trigger;
  onSave: (trigger: Partial<Trigger>) => void;
  onClose: () => void;
  bots: { id: string; name: string }[];
}

const conditionTypes = [
  { value: "bot_status", label: "Estado del bot" },
  { value: "message_contains", label: "Mensaje contiene" },
  { value: "keyword", label: "Keyword" },
  { value: "schedule", label: "Programación" },
  { value: "webhook", label: "Webhook" },
];

const actionTypes = [
  { value: "send_message", label: "Enviar mensaje" },
  { value: "run_command", label: "Ejecutar comando" },
  { value: "notify", label: "Notificar" },
  { value: "webhook", label: "Llamar webhook" },
  { value: "bot_action", label: "Acción en bot" },
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
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">
            {trigger ? "Editar Trigger" : "Nuevo Trigger"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-border transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nombre del trigger
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej: Alerta stock bajo"
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Descripción (opcional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Qué hace este trigger..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Condition */}
          <div className="bg-background rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Zap size={16} className="text-warning" />
              <span>CONDICIÓN</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipo</label>
                <select
                  value={conditionType}
                  onChange={(e) => setConditionType(e.target.value as TriggerCondition["type"])}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
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
                  <label className="block text-sm text-gray-400 mb-2">Bot</label>
                  <select
                    value={conditionBotId}
                    onChange={(e) => setConditionBotId(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
                  >
                    <option value="">Seleccionar bot...</option>
                    {bots.map((bot) => (
                      <option key={bot.id} value={bot.id}>
                        {bot.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(conditionType !== "bot_status" && conditionType !== "schedule") && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Valor</label>
                  <input
                    type="text"
                    value={conditionValue}
                    onChange={(e) => setConditionValue(e.target.value)}
                    placeholder="Valor a comparar..."
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight size={24} className="text-gray-600" />
          </div>

          {/* Action */}
          <div className="bg-background rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Zap size={16} className="text-accent" />
              <span>ACCIÓN</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipo</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as TriggerAction["type"])}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
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
                  <label className="block text-sm text-gray-400 mb-2">Bot destino</label>
                  <select
                    value={actionBotId}
                    onChange={(e) => setActionBotId(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent"
                  >
                    <option value="">Seleccionar bot...</option>
                    {bots.map((bot) => (
                      <option key={bot.id} value={bot.id}>
                        {bot.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {(actionType === "send_message" || actionType === "notify") && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Mensaje / Plantilla</label>
                <textarea
                  value={actionTemplate}
                  onChange={(e) => setActionTemplate(e.target.value)}
                  placeholder="¡Alerta! Stock bajo en {{producto}}"
                  rows={2}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-accent resize-none"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-border transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
            >
              {trigger ? "Guardar cambios" : "Crear trigger"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
