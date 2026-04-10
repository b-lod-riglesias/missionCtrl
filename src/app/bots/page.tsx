"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import BotDetail from "@/components/bots/BotDetail";
import { useBotsStore } from "@/store/bots";
import type { Bot } from "@/types/bot";
import { RefreshCw, Plus, Search, Filter } from "lucide-react";

export default function BotsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Bot["status"] | "all">("all");
  const [detailBot, setDetailBot] = useState<Bot | null>(null);

  const {
    bots,
    botStats,
    loading,
    error,
    fetchBots,
    fetchGatewayStatus,
    selectBot,
    startBot,
    stopBot,
    restartBot,
    clearError,
  } = useBotsStore();

  useEffect(() => {
    fetchBots();
    fetchGatewayStatus();

    const interval = setInterval(() => {
      fetchBots();
      fetchGatewayStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchBots, fetchGatewayStatus]);

  const filteredBots = bots.filter((bot) => {
    const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || bot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onlineBots = filteredBots.filter((b) => b.status === "online" || b.status === "busy");
  const offlineBots = filteredBots.filter((b) => b.status === "offline" || b.status === "starting" || b.status === "stopping");

  const handleSelectBot = (bot: Bot) => {
    selectBot(bot);
    setDetailBot(bot);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="OPENCLAW FLEET" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-primary-fixed font-headline uppercase tracking-widest">
                  OpenClaw Fleet
                </h1>
                <p className="text-sm text-on-surface-variant mt-1">
                  Manage and monitor all registered OpenClaws
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchBots()}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 bg-surface-container border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 font-label text-xs font-bold uppercase tracking-widest"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  REFRESH
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary-fixed text-on-primary-fixed font-bold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                  <Plus size={16} />
                  REGISTER AGENT
                </button>
              </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-surface-container-low p-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Total Agents</p>
                <p className="text-3xl font-black text-primary-fixed font-headline">{bots.length}</p>
              </div>
              <div className="bg-surface-container-low p-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Online</p>
                <p className="text-3xl font-black text-secondary font-headline">
                  {bots.filter((b) => b.status === "online" || b.status === "busy").length}
                </p>
              </div>
              <div className="bg-surface-container-low p-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Offline</p>
                <p className="text-3xl font-black text-error font-headline">
                  {bots.filter((b) => b.status === "offline").length}
                </p>
              </div>
              <div className="bg-surface-container-low p-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Processing</p>
                <p className="text-3xl font-black text-tertiary-fixed-dim font-headline">
                  {bots.filter((b) => b.status === "starting" || b.status === "stopping").length}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:border-primary-fixed transition-colors font-label uppercase placeholder:text-outline-variant/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-on-surface-variant" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Bot["status"] | "all")}
                  className="bg-surface-container-low border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:border-primary-fixed font-label"
                >
                  <option value="all">ALL STATUS</option>
                  <option value="online">ONLINE</option>
                  <option value="offline">OFFLINE</option>
                  <option value="busy">BUSY</option>
                  <option value="starting">STARTING</option>
                  <option value="stopping">STOPPING</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-error-container border border-error/20 rounded p-4 mb-6 flex items-center justify-between">
                <p className="text-error text-sm font-label">{error}</p>
                <button onClick={clearError} className="text-error hover:text-error/80 font-label">
                  ✕
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && bots.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <RefreshCw size={32} className="animate-spin text-primary-fixed" />
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredBots.length === 0 && (
              <div className="text-center py-20">
                <p className="text-on-surface-variant">No agents found</p>
              </div>
            )}

            {/* Online first */}
            {onlineBots.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-secondary font-headline uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  Active ({onlineBots.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {onlineBots.map((bot) => (
                    <div
                      key={bot.id}
                      onClick={() => handleSelectBot(bot)}
                      className="bg-surface-container-low p-4 hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/50 hover:border-primary-fixed/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-surface-container flex items-center justify-center">
                          <span className="text-secondary font-headline font-bold text-sm">OC</span>
                        </div>
                        <span className={`text-[10px] font-bold font-label px-2 py-1 ${
                          bot.status === "online" ? "bg-secondary/20 text-secondary" :
                          bot.status === "busy" ? "bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim" :
                          "bg-primary-fixed/20 text-primary-fixed"
                        }`}>
                          {bot.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-headline font-bold text-sm uppercase mb-1">{bot.name}</h3>
                      <p className="text-[10px] text-on-surface-variant font-mono">ID: {bot.id}</p>
                      <p className="text-[10px] text-on-surface-variant mt-1">Last activity: {bot.lastActivity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offline */}
            {offlineBots.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-error font-headline uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-error rounded-full" />
                  Inactive ({offlineBots.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {offlineBots.map((bot) => (
                    <div
                      key={bot.id}
                      onClick={() => handleSelectBot(bot)}
                      className="bg-surface-container-low p-4 hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/50 hover:border-primary-fixed/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-surface-container flex items-center justify-center">
                          <span className="text-on-surface-variant font-headline font-bold text-sm">OC</span>
                        </div>
                        <span className="text-[10px] font-bold font-label px-2 py-1 bg-error/20 text-error">
                          {bot.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-headline font-bold text-sm uppercase mb-1">{bot.name}</h3>
                      <p className="text-[10px] text-on-surface-variant font-mono">ID: {bot.id}</p>
                      <p className="text-[10px] text-on-surface-variant mt-1">Last activity: {bot.lastActivity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {detailBot && (
        <BotDetail
          bot={detailBot}
          stats={botStats[detailBot.id]}
          onClose={() => setDetailBot(null)}
          onStart={(id) => startBot(id)}
          onStop={(id) => stopBot(id)}
          onRestart={(id) => restartBot(id)}
        />
      )}
    </div>
  );
}
