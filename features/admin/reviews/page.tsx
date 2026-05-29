"use client";

import React from "react";
import { Flag, MessageSquare, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getAdminReviews } from "../api";

export default function AdminReviewsFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: getAdminReviews,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Reviews"
          description="A moderation queue with scores, comments, and action state so reviews feel like a real workbench."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              3 reviews
            </Badge>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Avg rating</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[0]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Pending reply</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[1]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Published</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[2]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Moderation queue</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="h-5 w-5 text-primary" />
              Review inbox
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.reviews?.map((review) => (
              <div
                key={review.author}
                className="rounded-2xl border border-border bg-background/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{review.author}</div>
                    <div className="mt-2 flex items-center gap-1 text-amber-400">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {review.note}
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {review.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Controls</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Flag className="h-5 w-5 text-primary" />
              Moderation actions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Approve, reply, and escalate directly from this queue once the API
            is wired.
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
