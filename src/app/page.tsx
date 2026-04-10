"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useBotsStore } from "@/store/bots";
import { Activity, Cpu, Clock, TrendingUp, Plus, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { bots, fetchBots, fetchGatewayStatus, gatewayStatus } = useBotsStore();

  useEffect(() => {
    fetchBots();
    fetchGatewayStatus();
  }, [fetchBots, fetchGatewayStatus]);

  const onlineBots = bots.filter((b) => b.status === "online" || b.status === "busy");
  const totalRequests = Math.floor(Math.random() * 500) + 200;
  const uptime = gatewayStatus?.uptime ? (gatewayStatus.uptime / 86400) * 100 : 99.2;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="FLEET OVERVIEW" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Telemetry Row */}
            <div className="grid grid-cols-12 gap-6 mb-6">
              {/* Stats cards */}
              <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-container-low p-4">
                  <div className="flex items-center gap-2 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">
                    <Activity size={16} className="text-secondary" />
                    Active Missions
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-primary-fixed font-headline">{onlineBots.length}</span>
                    <span className="text-[10px] text-secondary font-bold">+12% LOAD</span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-4">
                  <div className="flex items-center gap-2 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">
                    <AlertTriangle size={16} className="text-error" />
                    Critical Alerts
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-error font-headline">0</span>
                    <span className="text-[10px] text-error font-bold animate-pulse">ALL SYSTEMS NOMINAL</span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-4">
                  <div className="flex items-center gap-2 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-2">
                    <Cpu size={16} className="text-tertiary-fixed-dim" />
                    Fleet Utilization
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-tertiary-fixed-dim font-headline">
                      {Math.round((onlineBots.length / Math.max(bots.length, 1)) * 100)}%
                    </span>
                    <div className="w-full h-1 bg-surface-container flex-1 mb-2">
                      <div
                        className="h-full bg-secondary"
                        style={{ width: `${Math.round((onlineBots.length / Math.max(bots.length, 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* System status */}
              <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary-fixed-dim tracking-widest uppercase font-label">Neural Sync Pulse</span>
                    <span className="text-xs text-on-surface font-mono">0x4F92-BUFFER_STABLE</span>
                  </div>
                  <span className="text-secondary font-bold text-sm">●</span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-secondary">SYSTEM ONLINE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Registry */}
            <div className="bg-surface-container-low p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary-fixed">
                  Agent Registry
                </h3>
                <span className="text-[10px] font-mono text-secondary">
                  ACTIVE: {onlineBots.length} / TOTAL: {bots.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {bots.map((bot) => (
                  <Link
                    key={bot.id}
                    href="/bots"
                    className="bg-surface-container-lowest p-3 flex items-center gap-4 hover:bg-surface-container transition-colors border border-outline-variant/30"
                  >
                    <div className="relative w-10 h-10 bg-surface-container flex items-center justify-center shrink-0">
                      <span className="font-headline font-bold text-sm text-secondary">OC</span>
                      <div
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-surface-container-lowest ${
                          bot.status === "online" ? "bg-secondary" :
                          bot.status === "busy" ? "bg-tertiary-fixed-dim" :
                          "bg-error"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-black font-headline truncate uppercase">{bot.name}</h5>
                      <p className="text-[10px] font-mono text-on-surface-variant truncate">
                        STATE: {bot.status === "online" ? "ACTIVE" : bot.status === "busy" ? "PROCESSING" : "OFFLINE"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/bots"
                className="bg-surface-container-low p-4 hover:bg-surface-container transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-fixed/20 rounded flex items-center justify-center">
                    <span className="text-primary-fixed font-headline font-bold">01</span>
                  </div>
                  <h4 className="font-headline font-bold text-sm uppercase">OpenClaw Fleet</h4>
                </div>
                <p className="text-xs text-on-surface-variant">Manage and monitor all registered OpenClaws agents</p>
                <div className="mt-3 text-[10px] font-bold text-primary-fixed uppercase tracking-widest group-hover:underline">
                  ACCESS →
                </div>
              </Link>

              <Link
                href="/triggers"
                className="bg-surface-container-low p-4 hover:bg-surface-container transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded flex items-center justify-center">
                    <span className="text-secondary font-headline font-bold">02</span>
                  </div>
                  <h4 className="font-headline font-bold text-sm uppercase">Trigger Protocol</h4>
                </div>
                <p className="text-xs text-on-surface-variant">Automate actions between OpenClaws agents</p>
                <div className="mt-3 text-[10px] font-bold text-secondary uppercase tracking-widest group-hover:underline">
                  CONFIGURE →
                </div>
              </Link>

              <Link
                href="/stats"
                className="bg-surface-container-low p-4 hover:bg-surface-container transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-tertiary-fixed-dim/20 rounded flex items-center justify-center">
                    <span className="text-tertiary-fixed-dim font-headline font-bold">03</span>
                  </div>
                  <h4 className="font-headline font-bold text-sm uppercase">System Analytics</h4>
                </div>
                <p className="text-xs text-on-surface-variant">Fleet performance metrics and monitoring</p>
                <div className="mt-3 text-[10px] font-bold text-tertiary-fixed-dim uppercase tracking-widest group-hover:underline">
                  VIEW METRICS →
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
