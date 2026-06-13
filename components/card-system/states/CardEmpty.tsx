import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const emptyVariants = cva(
  "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/30",
  {
    variants: {
      size: {
        sm: "p-6 gap-3",
        md: "p-8 gap-4",
        lg: "p-12 gap-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface CardEmptyProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof emptyVariants> {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
  }
}

const CardEmpty = React.forwardRef<HTMLDivElement, CardEmptyProps>(
  ({ className, size, icon, title = "No data", description, action, ...props }, ref) => {
    return (
      <div
        data-slot="card-empty"
        className={cn(emptyVariants({ size }), className)}
        ref={ref}
        {...props}
      >
        {icon || (
          <svg
            className="w-12 h-12 text-muted-foreground/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}

        <div className="text-center space-y-1">
          <p className="font-medium text-foreground">{title}</p>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        {action && (
          <Button variant="outline" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    )
  }
)
CardEmpty.displayName = "CardEmpty"

export { CardEmpty, emptyVariants }
