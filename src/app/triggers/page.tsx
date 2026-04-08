"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import TriggerCard from "@/components/triggers/TriggerCard";
import TriggerEditor from "@/components/triggers/TriggerEditor";
import { useTriggersStore } from "@/store/triggers";
import { useBotsStore } from "@/store/bots";
import type { Trigger } from "@/types/trigger";
import { Plus, RefreshCw, Search, Filter, Zap } from "lucide-react";

export default function TriggersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Trigger["status"] | "all">("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | undefined>();

  const {
    triggers,
    stats,
    loading,
    error,
    fetchTriggers,
    createTrigger,
    updateTrigger,
    deleteTrigger,
    toggleTrigger,
  } = useTriggersStore();

  const { bots, fetchBots } = useBotsStore();

  useEffect(() => {
    fetchTriggers();
    fetchBots();
  }, [fetchTriggers, fetchBots]);

  const filteredTriggers = triggers.filter((trigger) => {
    const matchesSearch =
      trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trigger.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || trigger.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSave = async (triggerData: Partial<Trigger>) => {
    if (editingTrigger) {
      await updateTrigger(editingTrigger.id, triggerData);
    } else {
      await createTrigger(triggerData);
    }
  };

  const handleEdit = (trigger: Trigger) => {
    setEditingTrigger(trigger);
    setEditorOpen(true);
  };

  const handleClose = () => {
    setEditorOpen(false);
    setEditingTrigger(undefined);
  };

  const botOptions = bots.map((b) => ({ id: b.id, name: b.name }));

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
                <h1 className="text-2xl font-semibold">Triggers</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Automatiza acciones entre tus OpenClaws
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchTriggers()}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-border transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  Actualizar
                </button>
                <button
                  onClick={() => setEditorOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
                >
                  <Plus size={16} />
                  Nuevo Trigger
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">Activos</p>
                <p className="text-3xl font-bold text-success">{stats.active}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">Inactivos</p>
                <p className="text-3xl font-bold text-gray-400">{stats.inactive}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">Errores</p>
                <p className="text-3xl font-bold text-error">{stats.errors}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-gray-400 text-sm">Ejecuciones hoy</p>
                <p className="text-3xl font-bold text-accent">{stats.triggersToday}</p>
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
                  placeholder="Buscar triggers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Trigger["status"] | "all")}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>

            {/* Loading */}
            {loading && triggers.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <RefreshCw size={32} className="animate-spin text-accent" />
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredTriggers.length === 0 && (
              <div className="text-center py-20">
                <Zap size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 mb-2">No se encontraron triggers</p>
                <button
                  onClick={() => setEditorOpen(true)}
                  className="text-accent hover:underline"
                >
                  Crear el primero
                </button>
              </div>
            )}

            {/* Triggers grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTriggers.map((trigger) => (
                <TriggerCard
                  key={trigger.id}
                  trigger={trigger}
                  onEdit={handleEdit}
                  onDelete={deleteTrigger}
                  onToggle={toggleTrigger}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Editor modal */}
      {editorOpen && (
        <TriggerEditor
          trigger={editingTrigger}
          onSave={handleSave}
          onClose={handleClose}
          bots={botOptions}
        />
      )}
    </div>
  );
}
