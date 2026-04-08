export type TriggerStatus = "active" | "inactive" | "error";

export interface TriggerCondition {
  type: "bot_status" | "message_contains" | "keyword" | "schedule" | "webhook";
  operator?: "equals" | "contains" | "starts_with" | "ends_with";
  value: string;
  botId?: string;
}

export interface TriggerAction {
  type: "send_message" | "run_command" | "notify" | "webhook" | "bot_action";
  targetBotId?: string;
  template?: string;
  params?: Record<string, unknown>;
}

export interface Trigger {
  id: string;
  name: string;
  description?: string;
  status: TriggerStatus;
  condition: TriggerCondition;
  action: TriggerAction;
  createdAt: string;
  updatedAt: string;
  lastTriggered?: string;
  triggerCount: number;
}

export interface TriggerStats {
  total: number;
  active: number;
  inactive: number;
  errors: number;
  triggersToday: number;
}
