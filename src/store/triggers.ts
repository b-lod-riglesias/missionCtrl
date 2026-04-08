import { create } from "zustand";
import type { Trigger, TriggerStats } from "@/types/trigger";

interface TriggersState {
  triggers: Trigger[];
  stats: TriggerStats;
  loading: boolean;
  error: string | null;

  // Actions
  fetchTriggers: () => Promise<void>;
  createTrigger: (trigger: Partial<Trigger>) => Promise<boolean>;
  updateTrigger: (id: string, trigger: Partial<Trigger>) => Promise<boolean>;
  deleteTrigger: (id: string) => Promise<boolean>;
  toggleTrigger: (id: string) => void;
}

const mockTriggers: Trigger[] = [
  {
    id: "1",
    name: "Alerta stock bajo",
    description: "Notifica cuando el stock de cualquier producto baja del umbral",
    status: "active",
    condition: { type: "keyword", value: "stock_bajo", botId: "stock" },
    action: { type: "notify", template: "⚠️ Stock bajo: {{producto}}" },
    createdAt: "2026-04-01",
    updatedAt: "2026-04-08",
    lastTriggered: "Hace 5 min",
    triggerCount: 23,
  },
  {
    id: "2",
    name: "Bot offline",
    description: "Activa cuando un bot se desconecta",
    status: "active",
    condition: { type: "bot_status", value: "offline", botId: "rrhh" },
    action: { type: "notify", template: "🔴 {{botName}} está offline" },
    createdAt: "2026-04-02",
    updatedAt: "2026-04-08",
    lastTriggered: "Hace 1h",
    triggerCount: 5,
  },
  {
    id: "3",
    name: "Incidencia crítica",
    description: "Escala incidencias críticas a compras",
    status: "inactive",
    condition: { type: "keyword", value: "crítico", botId: "incidencias" },
    action: { type: "bot_action", targetBotId: "compras", template: "Nueva incidencia crítica" },
    createdAt: "2026-04-03",
    updatedAt: "2026-04-06",
    triggerCount: 2,
  },
];

export const useTriggersStore = create<TriggersState>((set, get) => ({
  triggers: [],
  stats: { total: 0, active: 0, inactive: 0, errors: 0, triggersToday: 0 },
  loading: false,
  error: null,

  fetchTriggers: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 500));
      set({
        triggers: mockTriggers,
        stats: {
          total: mockTriggers.length,
          active: mockTriggers.filter((t) => t.status === "active").length,
          inactive: mockTriggers.filter((t) => t.status === "inactive").length,
          errors: mockTriggers.filter((t) => t.status === "error").length,
          triggersToday: mockTriggers.reduce((acc, t) => acc + t.triggerCount, 0),
        },
        loading: false,
      });
    } catch {
      set({ error: "Failed to fetch triggers", loading: false });
    }
  },

  createTrigger: async (trigger) => {
    const newTrigger: Trigger = {
      id: Date.now().toString(),
      ...trigger,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggerCount: 0,
    } as Trigger;

    set((state) => ({
      triggers: [...state.triggers, newTrigger],
    }));
    return true;
  },

  updateTrigger: async (id, updates) => {
    set((state) => ({
      triggers: state.triggers.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    }));
    return true;
  },

  deleteTrigger: async (id) => {
    set((state) => ({
      triggers: state.triggers.filter((t) => t.id !== id),
    }));
    return true;
  },

  toggleTrigger: (id) => {
    set((state) => ({
      triggers: state.triggers.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "active" ? "inactive" : "active", updatedAt: new Date().toISOString() }
          : t
      ),
    }));
  },
}));
