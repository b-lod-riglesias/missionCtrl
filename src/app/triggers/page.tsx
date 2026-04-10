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
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="TRIGGER PROTOCOL" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-primary-fixed font-headline uppercase tracking-widest">
                  Trigger Protocol
                </h1>
                <p className="text-sm text-on-surface-variant mt-1">
                  Automate actions between your OpenClaws agents
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchTriggers()}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 bg-surface-container border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 font-label text-xs font-bold uppercase tracking-widest"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  REFRESH
                </button>
                <button
                  onClick={() => setEditorOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-primary-fixed text-on-primary-fixed font-bold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all"
                >
                  <Plus size={16} />
                  NEW TRIGGER
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4 mb-8">
              <div className="bg-surface-container-low p-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Total</p>
                <p className="text-3xl font-black text-primary-fixed font-headline">{stats.total}</p>
              </div>
              <div className="bg-surface-container-low p-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Active</p>
                <p className="text-3xl font-black text-secondary font-headline">{stats.active}</p>
              </div>
              <div className="bg-surface-container-low p-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Inactive</p>
                <p className="text-3xl font-black text-on-surface-variant font-headline">{stats.inactive}</p>
              </div>
              <div className="bg-surface-container-low p-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Errors</p>
                <p className="text-3xl font-black text-error font-headline">{stats.errors}</p>
              </div>
              <div className="bg-surface-container-low p-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Exec Today</p>
                <p className="text-3xl font-black text-tertiary-fixed-dim font-headline">{stats.triggersToday}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search triggers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:border-primary-fixed transition-colors font-label uppercase placeholder:text-outline-variant/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-on-surface-variant" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Trigger["status"] | "all")}
                  className="bg-surface-container-low border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:border-primary-fixed font-label"
                >
                  <option value="all">ALL STATUS</option>
                  <option value="active">ACTIVE</option>
                  <option value="inactive">INACTIVE</option>
                  <option value="error">ERROR</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-error-container border border-error/20 rounded p-4 mb-6">
                <p className="text-error text-sm font-label">{error}</p>
              </div>
            )}

            {/* Loading */}
            {loading && triggers.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <RefreshCw size={32} className="animate-spin text-primary-fixed" />
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredTriggers.length === 0 && (
              <div className="text-center py-20">
                <Zap size={48} className="mx-auto text-outline-variant mb-4" />
                <p className="text-on-surface-variant mb-2">No triggers found</p>
                <button
                  onClick={() => setEditorOpen(true)}
                  className="text-primary-fixed hover:underline font-label text-sm uppercase tracking-widest"
                >
                  CREATE FIRST TRIGGER
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
