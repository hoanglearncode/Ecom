import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const skeletonVariants = cva(
  "flex flex-col gap-3 rounded-xl border bg-card",
  {
    variants: {
      size: {
        sm: "p-3 gap-2",
        md: "p-4 gap-3",
        lg: "p-6 gap-4",
      },
      hasMedia: {
        true: "",
        false: "",
      },
      hasFooter: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      hasMedia: false,
      hasFooter: false,
    },
  }
)

export interface CardSkeletonProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof skeletonVariants> {
  showAvatar?: boolean
  lines?: number
}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ className, size, hasMedia, hasFooter, showAvatar = false, lines = 3, ...props }, ref) => {
    return (
      <div
        data-slot="card-skeleton"
        className={cn(skeletonVariants({ size, hasMedia, hasFooter }), className)}
        ref={ref}
        {...props}
      >
        {hasMedia && (
          <Skeleton className="w-full aspect-square rounded-md" />
        )}

        <div className="flex flex-col gap-2">
          {showAvatar && <Skeleton className="w-10 h-10 rounded-full" />}

          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <div className="space-y-1.5">
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-full" />
            ))}
          </div>
        </div>

        {hasFooter && (
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
          </div>
        )}
      </div>
    )
  }
)
CardSkeleton.displayName = "CardSkeleton"

export { CardSkeleton, skeletonVariants }
