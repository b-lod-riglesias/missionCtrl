"use client";

import { Clock } from "lucide-react";

interface Activity {
  id: number;
  bot: string;
  action: string;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-card border border-border rounded-lg divide-y divide-border">
      {activities.map((activity) => (
        <div key={activity.id} className="p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-border rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock size={14} className="text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{activity.action}</p>
            <p className="text-xs text-gray-500">{activity.bot}</p>
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0">{activity.time}</span>
        </div>
      ))}
    </div>
  );
}
