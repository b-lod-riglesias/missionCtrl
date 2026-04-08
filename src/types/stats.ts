export interface StatsDataPoint {
  timestamp: string;
  value: number;
}

export interface BotStatsSummary {
  id: string;
  name: string;
  requests: StatsDataPoint[];
  errors: StatsDataPoint[];
  responseTime: StatsDataPoint[];
  uptime: number;
}

export interface DailyStats {
  date: string;
  totalRequests: number;
  totalErrors: number;
  avgResponseTime: number;
  peakRequests: number;
}

export interface SystemStats {
  totalRequestsToday: number;
  totalErrorsToday: number;
  avgResponseTime: number;
  peakConcurrentBots: number;
  uptime: number;
}
