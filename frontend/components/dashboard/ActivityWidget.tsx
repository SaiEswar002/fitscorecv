import { Clock, FileText, Copy, Archive, Trash2, Download } from "lucide-react";

// ── Activity Widget ───────────────────────────────────────────────────────────
// Gracefully shows "No recent activity" until the activity log feature ships
// in a future phase. The component is pre-wired to accept activity items.

export interface ActivityItem {
  id:        string;
  type:      "created" | "updated" | "duplicated" | "deleted" | "downloaded" | "archived" | "ats_scan" | "job_match";
  label:     string;
  timestamp: string;
}

const ACTIVITY_ICONS: Record<ActivityItem["type"], React.ElementType> = {
  created:    FileText,
  updated:    Clock,
  duplicated: Copy,
  deleted:    Trash2,
  downloaded: Download,
  archived:   Archive,
  ats_scan:   FileText,
  job_match:  FileText,
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1)  return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24)  return `${diffHr}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface Props {
  items?: ActivityItem[];
}

export function ActivityWidget({ items = [] }: Props) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--color-card-bg)",
        border: "1px solid var(--color-card-border)",
      }}
    >
      <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-muted)" }}>
        Recent Activity
      </h3>

      {items.length === 0 ? (
        <div className="py-6 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: "var(--color-muted)" }} />
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>No recent activity</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.slice(0, 8).map(item => {
            const Icon = ACTIVITY_ICONS[item.type];
            return (
              <li key={item.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "var(--color-badge-bg)" }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: "var(--color-cta)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--color-body)" }}>
                    {item.label}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--color-muted)" }}>
                    {fmtTime(item.timestamp)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
