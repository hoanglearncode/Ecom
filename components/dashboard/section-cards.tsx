import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardMetric = {
  label: string;
  value: string;
  change?: string;
};

const fallbackMetrics: DashboardMetric[] = [
  { label: "Total Revenue", value: "$1,250.00", change: "+12.5%" },
  { label: "New Customers", value: "1,234", change: "-20%" },
  { label: "Active Accounts", value: "45,678", change: "+12.5%" },
  { label: "Growth Rate", value: "4.5%", change: "+4.5%" },
];

const metricNotes = [
  {
    title: "Trending up this month",
    detail: "Based on the current mock product catalog",
  },
  {
    title: "Customer activity in mock data",
    detail: "Seeded from the system dashboard dataset",
  },
  {
    title: "Active catalog coverage",
    detail: "Reflects live mock products and inventory",
  },
  {
    title: "Growth from the mock feed",
    detail: "Updated from the current admin snapshot",
  },
];

export function SectionCards({
  metrics = fallbackMetrics,
}: {
  metrics?: DashboardMetric[];
}) {
  const cards = metrics.slice(0, 4).map((metric, index) => ({
    ...metric,
    ...metricNotes[index],
  }));

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((metric, index) => (
        <Card key={metric.label} className="@container/card">
          <CardHeader>
            <CardDescription>{metric.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metric.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {index === 1 ? <IconTrendingDown /> : <IconTrendingUp />}
                {metric.change ?? "+0%"}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {metricNotes[index]?.title} <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {metricNotes[index]?.detail}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
