import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const badgeWrapperVariants = cva(
  "absolute z-10",
  {
    variants: {
      position: {
        "top-left": "top-2 left-2",
        "top-right": "top-2 right-2",
        "bottom-left": "bottom-2 left-2",
        "bottom-right": "bottom-2 right-2",
      },
    },
    defaultVariants: {
      position: "top-right",
    },
  }
)

const badgeVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        success: "bg-green-500 text-white",
        warning: "bg-amber-500 text-white",
        error: "bg-red-500 text-white",
        info: "bg-blue-500 text-white",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border-2 border-foreground",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-1",
        lg: "text-base px-3 py-1.5",
      },
      dot: {
        true: "flex items-center gap-1.5",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      dot: false,
    },
  }
)

export interface CardBadgeProps
  extends Omit<React.ComponentProps<"div">, "variant">,
    VariantProps<typeof badgeWrapperVariants>,
    VariantProps<typeof badgeVariants> {
  label: string
  asChild?: boolean
}

const CardBadge = React.forwardRef<HTMLDivElement, CardBadgeProps>(
  (
    {
      className,
      label,
      position,
      variant = "default",
      size = "sm",
      dot = false,
      asChild = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        data-slot="card-badge"
        className={cn(badgeWrapperVariants({ position }), className)}
        ref={ref}
        {...props}
      >
        <Badge className={cn(badgeVariants({ variant, size, dot }))}>
          {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
          {label}
        </Badge>
      </div>
    )
  }
)
CardBadge.displayName = "CardBadge"

export { CardBadge, badgeVariants, badgeWrapperVariants }
