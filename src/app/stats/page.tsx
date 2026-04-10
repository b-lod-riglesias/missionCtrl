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

const mockHourlyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, "0")}:00`,
  requests: Math.floor(Math.random() * 200) + 50,
  errors: Math.floor(Math.random() * 10),
}));

const mockDailyData = [
  { day: "MON", requests: 2450, errors: 23 },
  { day: "TUE", requests: 3120, errors: 31 },
  { day: "WED", requests: 2890, errors: 18 },
  { day: "THU", requests: 3450, errors: 42 },
  { day: "FRI", requests: 2980, errors: 27 },
  { day: "SAT", requests: 1230, errors: 8 },
  { day: "SUN", requests: 980, errors: 5 },
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
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="SYSTEM ANALYTICS" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-primary-fixed font-headline uppercase tracking-widest">
                  System Analytics
                </h1>
                <p className="text-sm text-on-surface-variant mt-1">
                  Fleet performance metrics and monitoring
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-surface-container-low border border-outline-variant overflow-hidden">
                  <button
                    onClick={() => setSelectedPeriod("24h")}
                    className={`px-3 py-2 text-[10px] font-bold font-label uppercase tracking-widest ${
                      selectedPeriod === "24h"
                        ? "bg-primary-fixed text-on-primary-fixed"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    24H
                  </button>
                  <button
                    onClick={() => setSelectedPeriod("7d")}
                    className={`px-3 py-2 text-[10px] font-bold font-label uppercase tracking-widest ${
                      selectedPeriod === "7d"
                        ? "bg-primary-fixed text-on-primary-fixed"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    7 DAYS
                  </button>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 bg-surface-container border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 font-label text-xs font-bold uppercase tracking-widest"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  REFRESH
                </button>
              </div>
            </div>

            {/* Stats overview */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-surface-container-low p-4">
                <div className="flex items-center gap-2 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">
                  <Activity size={16} className="text-secondary" />
                  Total Requests
                </div>
                <p className="text-3xl font-black text-primary-fixed font-headline">
                  {totalRequests.toLocaleString()}
                </p>
                <p className="text-[10px] text-secondary font-bold mt-1">↑ 12% VS YESTERDAY</p>
              </div>
              <div className="bg-surface-container-low p-4">
                <div className="flex items-center gap-2 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">
                  <Cpu size={16} className="text-error" />
                  Errors
                </div>
                <p className="text-3xl font-black text-error font-headline">{totalErrors}</p>
                <p className="text-[10px] text-secondary font-bold mt-1">↓ 8% VS YESTERDAY</p>
              </div>
              <div className="bg-surface-container-low p-4">
                <div className="flex items-center gap-2 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">
                  <Clock size={16} className="text-tertiary-fixed-dim" />
                  Avg Response
                </div>
                <p className="text-3xl font-black text-tertiary-fixed-dim font-headline">{avgResponseTime}ms</p>
                <p className="text-[10px] text-on-surface-variant mt-1">→ STABLE</p>
              </div>
              <div className="bg-surface-container-low p-4">
                <div className="flex items-center gap-2 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">
                  <TrendingUp size={16} className="text-secondary" />
                  Uptime
                </div>
                <p className="text-3xl font-black text-secondary font-headline">{uptime.toFixed(1)}%</p>
                <p className="text-[10px] text-on-surface-variant mt-1">LAST 24H</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-surface-container-low p-4">
                <h3 className="font-headline font-bold text-sm uppercase tracking-widest mb-4 text-primary-fixed">
                  Requests Per Hour
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockHourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3a494a" />
                      <XAxis dataKey="time" stroke="#849495" fontSize={12} />
                      <YAxis stroke="#849495" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1c2026",
                          border: "1px solid #3a494a",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="requests"
                        stroke="#00f5ff"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="errors"
                        stroke="#ff4ab4"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-[10px] font-label">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-primary-fixed" />
                    <span className="text-on-surface-variant">REQUESTS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-error" />
                    <span className="text-on-surface-variant">ERRORS</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-4">
                <h3 className="font-headline font-bold text-sm uppercase tracking-widest mb-4 text-primary-fixed">
                  Weekly Summary
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockDailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3a494a" />
                      <XAxis dataKey="day" stroke="#849495" fontSize={12} />
                      <YAxis stroke="#849495" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1c2026",
                          border: "1px solid #3a494a",
                          fontSize: "12px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="requests" fill="#00f5ff" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="errors" fill="#ff4ab4" radius={[0, 0, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Agent performance table */}
            <div className="bg-surface-container-low p-4">
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest mb-4 text-primary-fixed">
                Agent Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-label">
                  <thead>
                    <tr className="text-on-surface-variant border-b border-outline-variant text-[10px] font-bold uppercase tracking-widest">
                      <th className="text-left py-3 px-4">AGENT</th>
                      <th className="text-right py-3 px-4">REQUESTS TODAY</th>
                      <th className="text-right py-3 px-4">ERRORS</th>
                      <th className="text-right py-3 px-4">RESPONSE TIME</th>
                      <th className="text-right py-3 px-4">UPTIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bots.map((bot) => {
                      const requests = Math.floor(Math.random() * 500);
                      const errors = Math.floor(Math.random() * 10);
                      const responseTime = Math.floor(Math.random() * 400) + 50;
                      return (
                        <tr key={bot.id} className="border-b border-outline-variant/50 hover:bg-surface-container">
                          <td className="py-3 px-4 font-bold text-primary-fixed uppercase">{bot.name}</td>
                          <td className="text-right py-3 px-4 font-mono">{requests}</td>
                          <td className="text-right py-3 px-4 font-mono text-error">{errors}</td>
                          <td className="text-right py-3 px-4 font-mono text-tertiary-fixed-dim">{responseTime}ms</td>
                          <td className="text-right py-3 px-4 font-mono text-secondary">
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
