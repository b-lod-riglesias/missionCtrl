"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useBotsStore } from "@/store/bots";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { RefreshCw, Activity, Cpu, Clock, TrendingUp } from "lucide-react";

interface ChartDataPoint {
  time: string;
  requests: number;
  errors: number;
}

const mockHourlyData: ChartDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, "0")}:00`,
  requests: Math.floor(Math.random() * 200) + 50,
  errors: Math.floor(Math.random() * 10),
}));

const mockDailyData = [
  { day: "Lun", requests: 2450, errors: 23 },
  { day: "Mar", requests: 3120, errors: 31 },
  { day: "Mié", requests: 2890, errors: 18 },
  { day: "Jue", requests: 3450, errors: 42 },
  { day: "Vie", requests: 2980, errors: 27 },
  { day: "Sáb", requests: 1230, errors: 8 },
  { day: "Dom", requests: 980, errors: 5 },
];

export default function StatsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d">("24h");
  const [loading, setLoading] = useState(false);

  const { bots, fetchBots, fetchGatewayStatus, gatewayStatus } = useBotsStore();

  useEffect(() => {
    fetchBots();
    fetchGatewayStatus();
  }, [fetchBots, fetchGatewayStatus]);

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([fetchBots(), fetchGatewayStatus()]);
    setLoading(false);
  };

  const totalRequests = mockHourlyData.reduce((acc, d) => acc + d.requests, 0);
  const totalErrors = mockHourlyData.reduce((acc, d) => acc + d.errors, 0);
  const avgResponseTime = Math.floor(Math.random() * 300) + 100;
  const uptime = gatewayStatus?.uptime ? (gatewayStatus.uptime / 86400) * 100 : 99.2;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Estadísticas</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Métricas y rendimiento de tus OpenClaws
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-card border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setSelectedPeriod("24h")}
                    className={`px-3 py-2 text-sm ${
                      selectedPeriod === "24h"
                        ? "bg-accent text-white"
                        : "hover:bg-border"
                    }`}
                  >
                    24h
                  </button>
                  <button
                    onClick={() => setSelectedPeriod("7d")}
                    className={`px-3 py-2 text-sm ${
                      selectedPeriod === "7d"
                        ? "bg-accent text-white"
                        : "hover:bg-border"
                    }`}
                  >
                    7 días
                  </button>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-border transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  Actualizar
                </button>
              </div>
            </div>

            {/* Stats overview */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Activity size={16} />
                  Peticiones
                </div>
                <p className="text-3xl font-bold">{totalRequests.toLocaleString()}</p>
                <p className="text-xs text-success mt-1">↑ 12% vs ayer</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Cpu size={16} />
                  Errores
                </div>
                <p className="text-3xl font-bold text-error">{totalErrors}</p>
                <p className="text-xs text-success mt-1">↓ 8% vs ayer</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Clock size={16} />
                  Tiempo resp.
                </div>
                <p className="text-3xl font-bold">{avgResponseTime}ms</p>
                <p className="text-xs text-warning mt-1">→ estable</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <TrendingUp size={16} />
                  Uptime
                </div>
                <p className="text-3xl font-bold text-success">{uptime.toFixed(1)}%</p>
                <p className="text-xs text-gray-400 mt-1">últimas 24h</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Requests chart */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium mb-4">Peticiones por hora</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockHourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="time" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #2a2a2a",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="requests"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="errors"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-accent" />
                    <span className="text-gray-400">Peticiones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-error" />
                    <span className="text-gray-400">Errores</span>
                  </div>
                </div>
              </div>

              {/* Daily chart */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium mb-4">Resumen semanal</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockDailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="day" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #2a2a2a",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="requests" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="errors" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bot stats table */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-medium mb-4">Rendimiento por OpenClaw</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-border">
                      <th className="text-left py-3 px-4">Bot</th>
                      <th className="text-right py-3 px-4">Peticiones hoy</th>
                      <th className="text-right py-3 px-4">Errores</th>
                      <th className="text-right py-3 px-4">Tiempo resp.</th>
                      <th className="text-right py-3 px-4">Uptime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bots.map((bot) => {
                      const requests = Math.floor(Math.random() * 500);
                      const errors = Math.floor(Math.random() * 10);
                      const responseTime = Math.floor(Math.random() * 400) + 50;
                      return (
                        <tr key={bot.id} className="border-b border-border/50 hover:bg-border/30">
                          <td className="py-3 px-4">
                            <span className="font-medium">{bot.name}</span>
                          </td>
                          <td className="text-right py-3 px-4">{requests}</td>
                          <td className="text-right py-3 px-4 text-error">{errors}</td>
                          <td className="text-right py-3 px-4">{responseTime}ms</td>
                          <td className="text-right py-3 px-4 text-success">
                            {bot.status === "online" ? "99.8%" : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
