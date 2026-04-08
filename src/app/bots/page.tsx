"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import EnhancedBotCard from "@/components/bots/EnhancedBotCard";
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

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchBots();
      fetchGatewayStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchBots, fetchGatewayStatus]);

  // Filter bots by search and status
  const filteredBots = bots.filter((bot) => {
    const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || bot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group bots by status
  const onlineBots = filteredBots.filter((b) => b.status === "online" || b.status === "busy");
  const offlineBots = filteredBots.filter((b) => b.status === "offline" || b.status === "starting" || b.status === "stopping");

  const handleSelectBot = (bot: Bot) => {
    selectBot(bot);
    setDetailBot(bot);
  };

  const handleStart = async (id: string) => {
    await startBot(id);
  };

  const handleStop = async (id: string) => {
    await stopBot(id);
  };

  const handleRestart = async (id: string) => {
    await restartBot(id);
  };

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
                <h1 className="text-2xl font-semibold">OpenClaws</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Gestiona y monitorea todos tus OpenClaws
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchBots()}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-border transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  Actualizar
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors">
                  <Plus size={16} />
                  Nuevo Bot
                </button>
              </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total bots</p>
                <p className="text-3xl font-bold">{bots.length}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">Online</p>
                <p className="text-3xl font-bold text-success">
                  {bots.filter((b) => b.status === "online" || b.status === "busy").length}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">Offline</p>
                <p className="text-3xl font-bold text-error">
                  {bots.filter((b) => b.status === "offline").length}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">En proceso</p>
                <p className="text-3xl font-bold text-warning">
                  {bots.filter((b) => b.status === "starting" || b.status === "stopping").length}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Buscar por nombre o ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Bot["status"] | "all")}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                >
                  <option value="all">Todos</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="busy">Ocupado</option>
                  <option value="starting">Iniciando</option>
                  <option value="stopping">Deteniendo</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-error/20 border border-error/50 rounded-lg p-4 mb-6 flex items-center justify-between">
                <p className="text-error text-sm">{error}</p>
                <button onClick={clearError} className="text-error hover:text-error/80">
                  ✕
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && bots.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <RefreshCw size={32} className="animate-spin text-accent" />
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredBots.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400">No se encontraron bots</p>
              </div>
            )}

            {/* Bots - Online first */}
            {onlineBots.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-success rounded-full" />
                  Activos ({onlineBots.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {onlineBots.map((bot) => (
                    <EnhancedBotCard
                      key={bot.id}
                      bot={bot}
                      onStart={handleStart}
                      onStop={handleStop}
                      onRestart={handleRestart}
                      onSelect={handleSelectBot}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bots - Offline */}
            {offlineBots.length > 0 && (
              <div>
                <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-error rounded-full" />
                  Inactivos ({offlineBots.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {offlineBots.map((bot) => (
                    <EnhancedBotCard
                      key={bot.id}
                      bot={bot}
                      onStart={handleStart}
                      onStop={handleStop}
                      onRestart={handleRestart}
                      onSelect={handleSelectBot}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Bot detail modal */}
      {detailBot && (
        <BotDetail
          bot={detailBot}
          stats={botStats[detailBot.id]}
          onClose={() => setDetailBot(null)}
          onStart={handleStart}
          onStop={handleStop}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
