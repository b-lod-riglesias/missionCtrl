"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import BotCard from "@/components/bots/BotCard";
import ActivityFeed from "@/components/bots/ActivityFeed";

const mockBots = [
  { id: "incidencias", name: "Incidencias Bot", status: "online" as const, lastActivity: "Hace 2 min", uptime: "99.8%" },
  { id: "stock", name: "Stock Bot", status: "online" as const, lastActivity: "Hace 5 min", uptime: "99.2%" },
  { id: "rrhh", name: "RRHH Bot", status: "offline" as const, lastActivity: "Hace 1h", uptime: "—" },
  { id: "compras", name: "Compras Bot", status: "busy" as const, lastActivity: "Ahora", uptime: "98.5%" },
];

const mockActivity = [
  { id: 1, bot: "Incidencias Bot", action: "Nueva incidencia asignada", time: "Hace 2 min" },
  { id: 2, bot: "Stock Bot", action: "Alerta de stock bajo: Harina", time: "Hace 5 min" },
  { id: 3, bot: "Incidencias Bot", action: "Incidencia resuelta #342", time: "Hace 10 min" },
  { id: 4, bot: "Compras Bot", action: "Pedido automático realizado", time: "Hace 15 min" },
];

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

            {/* Stats summary */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">OpenClaws activos</p>
                <p className="text-3xl font-bold text-success">3</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">Incidencias hoy</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">Uptime medio</p>
                <p className="text-3xl font-bold text-success">99.2%</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">Alertas</p>
                <p className="text-3xl font-bold text-warning">2</p>
              </div>
            </div>

            {/* Bots grid */}
            <h2 className="text-lg font-medium mb-4">OpenClaws</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {mockBots.map((bot) => (
                <BotCard key={bot.id} bot={bot} />
              ))}
            </div>

            {/* Activity feed */}
            <h2 className="text-lg font-medium mb-4">Actividad reciente</h2>
            <ActivityFeed activities={mockActivity} />
          </div>
        </main>
      </div>
    </div>
  );
}
