import axios, { AxiosInstance } from "axios";
import type { Bot, BotStats, GatewayStatus, ApiResponse } from "@/types/bot";

const DEFAULT_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:18789";

class GatewayApi {
  private client: AxiosInstance;

  constructor(baseURL: string = DEFAULT_GATEWAY_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("Gateway API error:", error.message);
        return Promise.reject(error);
      }
    );
  }

  // Gateway status
  async getGatewayStatus(): Promise<GatewayStatus> {
    try {
      const response = await this.client.get<ApiResponse<GatewayStatus>>("/api/status");
      return response.data.data;
    } catch {
      // Return mock data if gateway is not available
      return {
        version: "2.x.x",
        uptime: 86400,
        botsOnline: 3,
        botsTotal: 4,
        memoryUsage: 45,
        cpuUsage: 12,
      };
    }
  }

  // List all bots
  async getBots(): Promise<Bot[]> {
    try {
      const response = await this.client.get<ApiResponse<Bot[]>>("/api/bots");
      return response.data.data;
    } catch {
      // Return mock data if gateway is not available
      return [
        { id: "incidencias", name: "Incidencias Bot", status: "online", lastActivity: "Hace 2 min", uptime: "99.8%" },
        { id: "stock", name: "Stock Bot", status: "online", lastActivity: "Hace 5 min", uptime: "99.2%" },
        { id: "rrhh", name: "RRHH Bot", status: "offline", lastActivity: "Hace 1h", uptime: "—" },
        { id: "compras", name: "Compras Bot", status: "busy", lastActivity: "Ahora", uptime: "98.5%" },
      ];
    }
  }

  // Get single bot details
  async getBot(id: string): Promise<Bot | null> {
    try {
      const response = await this.client.get<ApiResponse<Bot>>(`/api/bots/${id}`);
      return response.data.data;
    } catch {
      return null;
    }
  }

  // Get bot stats
  async getBotStats(id: string): Promise<BotStats | null> {
    try {
      const response = await this.client.get<ApiResponse<BotStats>>(`/api/bots/${id}/stats`);
      return response.data.data;
    } catch {
      return {
        id,
        requestsToday: Math.floor(Math.random() * 500),
        errorsToday: Math.floor(Math.random() * 10),
        avgResponseTime: Math.floor(Math.random() * 500) + 50,
        uptime: 99 + Math.random(),
      };
    }
  }

  // Start a bot
  async startBot(id: string): Promise<boolean> {
    try {
      await this.client.post(`/api/bots/${id}/start`);
      return true;
    } catch {
      return false;
    }
  }

  // Stop a bot
  async stopBot(id: string): Promise<boolean> {
    try {
      await this.client.post(`/api/bots/${id}/stop`);
      return true;
    } catch {
      return false;
    }
  }

  // Restart a bot
  async restartBot(id: string): Promise<boolean> {
    try {
      await this.client.post(`/api/bots/${id}/restart`);
      return true;
    } catch {
      return false;
    }
  }

  // Update bot config
  async updateBotConfig(id: string, config: Record<string, unknown>): Promise<boolean> {
    try {
      await this.client.patch(`/api/bots/${id}/config`, config);
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const gatewayApi = new GatewayApi();

export default GatewayApi;
