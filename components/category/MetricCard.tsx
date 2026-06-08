import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  icon: Icon,
  loading,
  accent,
}: {
  label: string;
  value: string | number;
  icon: any;
  loading?: boolean;
  accent?: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide">
          <Icon className={cn("h-3.5 w-3.5","text-muted-foreground")} />
          {label}
        </CardDescription>
        {loading ? (
          <Skeleton className="h-9 w-20" />
        ) : (
          <CardTitle className="text-3xl font-semibold tabular-nums">
            {value}
          </CardTitle>
        )}
      </CardHeader>
    </Card>
  );
}