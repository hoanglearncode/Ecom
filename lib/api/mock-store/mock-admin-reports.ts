import type { AdminReportsData } from "@/features/admin/types";

// ─── Extended types ───────────────────────────────────────────────────────────

export type ReportStatus = "Ready" | "Updated" | "New" | "Draft";
export type ReportCategory = "Sales" | "Fulfillment" | "Customers" | "Returns" | "Finance" | "Marketing";

export interface ReportItem {
  id: string;
  title: string;
  note: string;
  status: ReportStatus;
  category: ReportCategory;
  lastRun: string;
  frequency: string;
  rowCount?: string;
  owner?: string;
  tags?: string[];
}

export interface ScheduledExport {
  name: string;
  destination: string;
  schedule: string;
  format: "CSV" | "XLSX" | "JSON" | "PDF";
  lastSent: string;
  status: "Active" | "Paused" | "Failed";
}

export interface AdminReportsDataExtended extends AdminReportsData {
  reports: ReportItem[];
  scheduledExports: ScheduledExport[];
  recentActivity: Array<{ title: string; time: string; type: "export" | "view" | "schedule" }>;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export const mockReports: ReportItem[] = [
  {
    id: "rpt_001",
    title: "Sales Performance",
    note: "Revenue, units sold, margin by product and channel",
    status: "Ready",
    category: "Sales",
    lastRun: "Today, 06:00",
    frequency: "Daily",
    rowCount: "1,234 rows",
    owner: "Auto",
    tags: ["revenue", "margin"],
  },
  {
    id: "rpt_002",
    title: "Fulfillment Report",
    note: "Pick, pack, ship timings with carrier breakdown",
    status: "Updated",
    category: "Fulfillment",
    lastRun: "Today, 06:30",
    frequency: "Daily",
    rowCount: "842 rows",
    owner: "Auto",
    tags: ["shipping", "carrier"],
  },
  {
    id: "rpt_003",
    title: "Customer Cohort Analysis",
    note: "Repeat rate, LTV, and retention by acquisition month",
    status: "New",
    category: "Customers",
    lastRun: "Yesterday, 23:00",
    frequency: "Weekly",
    rowCount: "4,281 rows",
    owner: "Analytics",
    tags: ["ltv", "retention", "cohort"],
  },
  {
    id: "rpt_004",
    title: "Returns & Refunds Analysis",
    note: "Return reasons, product-level rates, refund amounts",
    status: "Ready",
    category: "Returns",
    lastRun: "May 30, 08:00",
    frequency: "Weekly",
    rowCount: "317 rows",
    owner: "Ops",
    tags: ["returns", "refunds"],
  },
  {
    id: "rpt_005",
    title: "P&L Summary",
    note: "Gross margin, COGS, operating expenses and net profit",
    status: "Draft",
    category: "Finance",
    lastRun: "May 28, 14:00",
    frequency: "Monthly",
    rowCount: "—",
    owner: "Finance",
    tags: ["pnl", "cogs", "margin"],
  },
  {
    id: "rpt_006",
    title: "Campaign Attribution",
    note: "Revenue attributed to email, paid social and organic",
    status: "Ready",
    category: "Marketing",
    lastRun: "Today, 07:15",
    frequency: "Daily",
    rowCount: "6,102 rows",
    owner: "Marketing",
    tags: ["attribution", "roas"],
  },
  {
    id: "rpt_007",
    title: "Inventory Turnover",
    note: "Days on hand, sell-through rate, dead stock flags",
    status: "Updated",
    category: "Fulfillment",
    lastRun: "Yesterday, 06:00",
    frequency: "Weekly",
    rowCount: "48 SKUs",
    owner: "Ops",
    tags: ["stock", "turnover"],
  },
  {
    id: "rpt_008",
    title: "VIP Customer Spend",
    note: "Top 128 customers — spend, frequency, category mix",
    status: "Ready",
    category: "Customers",
    lastRun: "May 29, 10:00",
    frequency: "Weekly",
    rowCount: "128 rows",
    owner: "CRM",
    tags: ["vip", "spend"],
  },
];

// ─── Scheduled exports ────────────────────────────────────────────────────────

export const mockScheduledExports: ScheduledExport[] = [
  {
    name: "Daily sales digest",
    destination: "finance@company.com",
    schedule: "Every day at 07:00",
    format: "XLSX",
    lastSent: "Today, 07:01",
    status: "Active",
  },
  {
    name: "Weekly cohort dump",
    destination: "Google Sheets",
    schedule: "Every Monday at 08:00",
    format: "CSV",
    lastSent: "May 27, 08:02",
    status: "Active",
  },
  {
    name: "Monthly P&L",
    destination: "ops@company.com",
    schedule: "1st of month at 09:00",
    format: "PDF",
    lastSent: "May 1, 09:03",
    status: "Paused",
  },
  {
    name: "Fulfillment feed",
    destination: "3PL Webhook",
    schedule: "Every day at 06:30",
    format: "JSON",
    lastSent: "Today, 06:31",
    status: "Failed",
  },
];

// ─── Recent activity ──────────────────────────────────────────────────────────

export const mockReportActivity = [
  { title: "Sales Performance exported as XLSX", time: "Today, 08:14", type: "export" as const },
  { title: "Customer Cohort viewed by Analytics team", time: "Today, 07:42", type: "view" as const },
  { title: "Campaign Attribution scheduled — daily 07:15", time: "Yesterday, 16:30", type: "schedule" as const },
  { title: "Returns Analysis exported as CSV", time: "Yesterday, 11:05", type: "export" as const },
  { title: "P&L Summary opened in draft mode", time: "May 28, 14:03", type: "view" as const },
];

// ─── AdminReportsData (matches existing type + API shape) ─────────────────────

export const mockAdminReports: AdminReportsDataExtended = {
  metrics: [
    { label: "Revenue", value: "$128.4k" },
    { label: "Margin", value: "34.8%" },
    { label: "Exports", value: "12" },
  ],
  reports: mockReports,
  scheduledExports: mockScheduledExports,
  recentActivity: mockReportActivity,
  actions: ["Export CSV", "Compare periods"],
};