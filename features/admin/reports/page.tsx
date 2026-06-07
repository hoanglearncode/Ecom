"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  TrendingUp,
  BarChart2,
  Users,
  RotateCcw,
  DollarSign,
  Megaphone,
  Boxes,
  Download,
  GitCompare,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileEdit,
  Sparkles,
  Calendar,
  Mail,
  Webhook,
  Sheet,
  AlertCircle,
  PauseCircle,
  Play,
  Eye,
  Search,
  RefreshCw,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { getAdminReports } from "../api";
import type { ReportCategory } from "@/lib/api/mock-store/mock-admin-reports";
import type { AdminReport } from "@/features/admin/types";

// ─── Config maps ──────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  ReportCategory,
  { Icon: React.ElementType; iconBg: string; iconColor: string }
> = {
  Sales: {
    Icon: TrendingUp,
    iconBg: "bg-emerald-50 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  Fulfillment: {
    Icon: Boxes,
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  Customers: {
    Icon: Users,
    iconBg: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  Returns: {
    Icon: RotateCcw,
    iconBg: "bg-amber-50 dark:bg-amber-950",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  Finance: {
    Icon: DollarSign,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  Marketing: {
    Icon: Megaphone,
    iconBg: "bg-pink-50 dark:bg-pink-950",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
};

const STATUS_CONFIG: Record<
  string,
  { Icon: React.ElementType; badgeClass: string; label: string }
> = {
  Ready: {
    Icon: CheckCircle2,
    label: "Ready",
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  },
  Updated: {
    Icon: Sparkles,
    label: "Updated",
    badgeClass:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
  },
  New: {
    Icon: Sparkles,
    label: "New",
    badgeClass:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
  },
  Draft: {
    Icon: FileEdit,
    label: "Draft",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
};

const EXPORT_STATUS_CONFIG: Record<
  ScheduledExport["status"],
  { Icon: React.ElementType; className: string; label: string }
> = {
  Active: {
    Icon: CheckCircle2,
    label: "Active",
    className:
      "text-emerald-700 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-950",
  },
  Paused: {
    Icon: PauseCircle,
    label: "Paused",
    className:
      "text-amber-700 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-950",
  },
  Failed: {
    Icon: AlertCircle,
    label: "Failed",
    className:
      "text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950",
  },
};

const FORMAT_COLOR: Record<ScheduledExport["format"], string> = {
  CSV: "text-emerald-600",
  XLSX: "text-blue-600",
  JSON: "text-amber-600",
  PDF: "text-red-600",
};

const DESTINATION_ICON: (dest: string) => React.ElementType = (dest) => {
  if (dest.includes("@")) return Mail;
  if (dest.toLowerCase().includes("sheet")) return Sheet;
  if (dest.toLowerCase().includes("webhook")) return Webhook;
  return Download;
};

const ACTIVITY_ICON: Record<string, React.ElementType> = {
  export: Download,
  view: Eye,
  schedule: Calendar,
};

const ALL_CATEGORIES: (ReportCategory | "All")[] = [
  "All", "Sales", "Fulfillment", "Customers", "Returns", "Finance", "Marketing",
];

// ─── Metric cards ─────────────────────────────────────────────────────────────

function MetricCards({
  metrics,
  totalReports,
  scheduledCount,
}: {
  metrics: Array<{ label: string; value: string; change?: string }>;
  totalReports: number;
  scheduledCount: number;
}) {
  const enriched = [
    ...metrics,
    { label: "Reports", value: String(totalReports), change: undefined },
    { label: "Scheduled", value: String(scheduledCount), change: undefined },
  ];

  const ICONS: Record<string, { Icon: React.ElementType; iconBg: string; iconColor: string }> = {
    Revenue: { Icon: TrendingUp, iconBg: "bg-emerald-50 dark:bg-emerald-950", iconColor: "text-emerald-600 dark:text-emerald-400" },
    Margin: { Icon: BarChart2, iconBg: "bg-blue-50 dark:bg-blue-950", iconColor: "text-blue-600 dark:text-blue-400" },
    Exports: { Icon: Download, iconBg: "bg-muted", iconColor: "text-muted-foreground" },
    Reports: { Icon: FileText, iconBg: "bg-muted", iconColor: "text-muted-foreground" },
    Scheduled: { Icon: Calendar, iconBg: "bg-purple-50 dark:bg-purple-950", iconColor: "text-purple-600 dark:text-purple-400" },
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {enriched.map((m) => {
        const cfg = ICONS[m.label] ?? ICONS.Exports;
        const isUp = m.change?.startsWith("+");
        const isDown = m.change?.startsWith("-");
        return (
          <Card key={m.label} className="bg-muted/40">
            <CardHeader className="pb-1">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs font-medium uppercase tracking-wider">
                  {m.label}
                </CardDescription>
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", cfg.iconBg)}>
                  <cfg.Icon className={cn("h-3.5 w-3.5", cfg.iconColor)} />
                </div>
              </div>
              <CardTitle className="text-3xl">{m.value}</CardTitle>
              {m.change && (
                <p className={cn("text-xs font-medium", isUp && "text-emerald-600", isDown && "text-red-500", !isUp && !isDown && "text-muted-foreground")}>
                  {m.change}
                </p>
              )}
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Single report row ────────────────────────────────────────────────────────

function ReportRow({ report }: { report: AdminReport }) {
  const cat = report.category ? CATEGORY_CONFIG[report.category as ReportCategory] : null;
  const st = STATUS_CONFIG[report.status] || STATUS_CONFIG.Ready;
  const CatIcon = cat?.Icon || FileText;
  const StIcon = st.Icon;

  return (
    <div className="group flex cursor-pointer items-center gap-3 border-b px-5 py-3.5 transition-colors last:border-0 hover:bg-muted/50">
      {/* Category icon */}
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", cat.iconBg)}>
        <CatIcon className={cn("h-4 w-4", cat.iconColor)} />
      </div>

      {/* Title + meta */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium leading-snug">{report.title}</p>
          {report.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="hidden rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{report.note}</p>
      </div>

      {/* Frequency + last run */}
      <div className="hidden shrink-0 text-right lg:block">
        <p className="text-xs font-medium text-muted-foreground">{report.frequency}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{report.lastRun}</p>
      </div>

      {/* Row count */}
      <div className="hidden w-20 shrink-0 text-right xl:block">
        <span className="font-mono text-xs text-muted-foreground">{report.rowCount}</span>
      </div>

      {/* Status badge */}
      <Badge variant="outline" className={cn("shrink-0 gap-1 rounded-full text-xs", st.badgeClass)}>
        <StIcon className="h-3 w-3" />
        {st.label}
      </Badge>

      {/* Hover actions */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Download className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

// ─── Scheduled exports table ──────────────────────────────────────────────────

function ScheduledExportsTable({ exports }: { exports: ScheduledExport[] }) {
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Scheduled exports
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <RefreshCw className="h-3 w-3" />
            Add schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-3 border-b bg-muted/40 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Name</span>
          <span>Destination</span>
          <span>Format</span>
          <span className="hidden sm:block">Last sent</span>
          <span>Status</span>
        </div>

        {exports.map((ex, idx) => {
          const DestIcon = DESTINATION_ICON(ex.destination);
          const stCfg = EXPORT_STATUS_CONFIG[ex.status];
          const StIcon = stCfg.Icon;

          return (
            <div
              key={idx}
              className={cn(
                "grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/50",
                idx < exports.length - 1 && "border-b border-border/40"
              )}
            >
              {/* Name + schedule */}
              <div className="min-w-0">
                <p className="truncate font-medium">{ex.name}</p>
                <p className="truncate text-xs text-muted-foreground">{ex.schedule}</p>
              </div>

              {/* Destination */}
              <div className="flex items-center gap-1.5 min-w-0">
                <DestIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-xs text-muted-foreground">{ex.destination}</span>
              </div>

              {/* Format pill */}
              <span className={cn("font-mono text-xs font-semibold", FORMAT_COLOR[ex.format])}>
                {ex.format}
              </span>

              {/* Last sent */}
              <span className="hidden text-xs text-muted-foreground sm:block whitespace-nowrap">
                {ex.lastSent}
              </span>

              {/* Status badge */}
              <Badge variant="outline" className={cn("gap-1 rounded-full text-xs", stCfg.className)}>
                <StIcon className="h-3 w-3" />
                {stCfg.label}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── Activity feed ─────────────────────────────────────────────────────────────

function ActivityFeed({ activity }: { activity: Array<{ title: string; time: string; type: "export" | "view" | "schedule" }> }) {
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Recent activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {activity.map((item, idx) => {
          const Icon = ACTIVITY_ICON[item.type] ?? Eye;
          return (
            <div
              key={idx}
              className={cn(
                "flex items-start gap-3 px-5 py-3",
                idx < activity.length - 1 && "border-b border-border/40"
              )}
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminReportsFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: getAdminReports,
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | "All">("All");

  const reports: AdminReport[] = data?.reports ?? [];
  const metrics = data?.metrics ?? [];
  const scheduledExports = data?.scheduledExports ?? [];
  const recentActivity = data?.recentActivity ?? [];

  const filtered = useMemo(() => {
    let rows = reports;
    if (categoryFilter !== "All") rows = rows.filter((r) => r.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.note.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.includes(q))
      );
    }
    return rows;
  }, [reports, categoryFilter, search]);

  const categoryCounts = useMemo(() => {
    const map: Partial<Record<ReportCategory | "All", number>> = { All: reports.length };
    reports.forEach((r) => {
      map[r.category] = (map[r.category] ?? 0) + 1;
    });
    return map;
  }, [reports]);

  return (
    <FeatureShell>
      <div className="space-y-6">
        {/* Header */}
        <FeatureHeader
          title="Reports"
          description="Report library, scheduled exports and recent export activity."
          actions={
            <div className="flex items-center gap-2">
              <Badge className="gap-1.5 rounded-full px-3 py-1" variant="secondary">
                <FileText className="h-3 w-3" />
                {reports.length} reports
              </Badge>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" />
                Export all
              </Button>
            </div>
          }
        />

        {/* Metrics */}
        <MetricCards
          metrics={metrics}
          totalReports={reports.length}
          scheduledCount={scheduledExports.length}
        />

        {/* Report library */}
        <Card>
          <CardHeader className="border-b pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Report library
              </CardTitle>
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reports…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
            </div>

            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ALL_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat] ?? 0;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      categoryFilter === cat
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-transparent text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {cat}
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      categoryFilter === cat ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>

          {/* Column headers */}
          <div className="grid grid-cols-[2fr_auto_auto_auto_auto] items-center gap-3 border-b bg-muted/40 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span>Report</span>
            <span className="hidden lg:block">Frequency</span>
            <span className="hidden xl:block">Rows</span>
            <span>Status</span>
            <span className="w-16" />
          </div>

          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                No reports match your search
              </p>
            ) : (
              filtered.map((report) => (
                <ReportRow key={report.id} report={report} />
              ))
            )}
          </CardContent>

          {filtered.length > 0 && (
            <div className="border-t px-5 py-2.5">
              <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of {reports.length} reports
              </p>
            </div>
          )}
        </Card>

        {/* Scheduled exports + Activity — side by side */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ScheduledExportsTable exports={scheduledExports} />
          </div>
          <ActivityFeed activity={recentActivity} />
        </div>
      </div>
    </FeatureShell>
  );
}