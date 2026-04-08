export type BotStatus = "online" | "offline" | "busy" | "starting" | "stopping";

export interface Bot {
  id: string;
  name: string;
  status: BotStatus;
  lastActivity: string;
  uptime: string;
  description?: string;
  version?: string;
  memory?: number;
  cpu?: number;
  channels?: string[];
  config?: Record<string, unknown>;
}

export interface BotStats {
  id: string;
  requestsToday: number;
  errorsToday: number;
  avgResponseTime: number;
  uptime: number;
}

export interface GatewayStatus {
  version: string;
  uptime: number;
  botsOnline: number;
  botsTotal: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
