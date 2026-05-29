import React from "react";

type FeaturePageProps = {
  children: React.ReactNode;
};

type FeatureHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

type FeatureEmptyStateProps = {
  title: string;
  description: string;
};

type FeatureCardProps = {
  children: React.ReactNode;
};

export function FeaturePage({ children }: FeaturePageProps) {
  return <div className="space-y-6">{children}</div>;
}

export function FeatureHeader({
  title,
  description,
  actions,
}: FeatureHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function FeatureEmptyState({
  title,
  description,
}: FeatureEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function FeatureCard({ children }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      {children}
    </div>
  );
}
