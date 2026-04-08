import { create } from "zustand";
import type { Bot, BotStats, GatewayStatus } from "@/types/bot";
import { gatewayApi } from "@/lib/api";

interface BotsState {
  bots: Bot[];
  selectedBot: Bot | null;
  botStats: Record<string, BotStats>;
  gatewayStatus: GatewayStatus | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchBots: () => Promise<void>;
  fetchBotStats: (id: string) => Promise<void>;
  fetchGatewayStatus: () => Promise<void>;
  selectBot: (bot: Bot | null) => void;
  startBot: (id: string) => Promise<boolean>;
  stopBot: (id: string) => Promise<boolean>;
  restartBot: (id: string) => Promise<boolean>;
  updateBotStatus: (id: string, status: Bot["status"]) => void;
  clearError: () => void;
}

export const useBotsStore = create<BotsState>((set, get) => ({
  bots: [],
  selectedBot: null,
  botStats: {},
  gatewayStatus: null,
  loading: false,
  error: null,

  fetchBots: async () => {
    set({ loading: true, error: null });
    try {
      const bots = await gatewayApi.getBots();
      set({ bots, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch bots", loading: false });
    }
  },

  fetchBotStats: async (id: string) => {
    try {
      const stats = await gatewayApi.getBotStats(id);
      if (stats) {
        set((state) => ({
          botStats: { ...state.botStats, [id]: stats },
        }));
      }
    } catch {
      // Silently fail for stats
    }
  },

  fetchGatewayStatus: async () => {
    try {
      const status = await gatewayApi.getGatewayStatus();
      set({ gatewayStatus: status });
    } catch {
      // Silently fail
    }
  },

  selectBot: (bot) => {
    set({ selectedBot: bot });
    if (bot) {
      get().fetchBotStats(bot.id);
    }
  },

  startBot: async (id: string) => {
    // Optimistic update
    set((state) => ({
      bots: state.bots.map((b) =>
        b.id === id ? { ...b, status: "starting" } : b
      ),
    }));

    const success = await gatewayApi.startBot(id);
    if (success) {
      set((state) => ({
        bots: state.bots.map((b) =>
          b.id === id ? { ...b, status: "online" } : b
        ),
      }));
    } else {
      // Revert on failure
      set((state) => ({
        bots: state.bots.map((b) =>
          b.id === id ? { ...b, status: "offline" } : b
        ),
        error: `Failed to start bot ${id}`,
      }));
    }
    return success;
  },

  stopBot: async (id: string) => {
    // Optimistic update
    set((state) => ({
      bots: state.bots.map((b) =>
        b.id === id ? { ...b, status: "stopping" } : b
      ),
    }));

    const success = await gatewayApi.stopBot(id);
    if (success) {
      set((state) => ({
        bots: state.bots.map((b) =>
          b.id === id ? { ...b, status: "offline" } : b
        ),
      }));
    } else {
      // Revert on failure
      set((state) => ({
        bots: state.bots.map((b) =>
          b.id === id ? { ...b, status: "online" } : b
        ),
        error: `Failed to stop bot ${id}`,
      }));
    }
    return success;
  },

  restartBot: async (id: string) => {
    // Optimistic update
    set((state) => ({
      bots: state.bots.map((b) =>
        b.id === id ? { ...b, status: "starting" } : b
      ),
    }));

    const success = await gatewayApi.restartBot(id);
    if (success) {
      set((state) => ({
        bots: state.bots.map((b) =>
          b.id === id ? { ...b, status: "online" } : b
        ),
      }));
    } else {
      // Revert on failure
      set((state) => ({
        bots: state.bots.map((b) =>
          b.id === id ? { ...b, status: "offline" } : b
        ),
        error: `Failed to restart bot ${id}`,
      }));
    }
    return success;
  },

  updateBotStatus: (id, status) => {
    set((state) => ({
      bots: state.bots.map((b) =>
        b.id === id ? { ...b, status } : b
      ),
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));
