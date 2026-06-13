import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const contentVariants = cva(
  "flex-1",
  {
    variants: {
      spacing: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        none: "",
      },
      lines: {
        1: "line-clamp-1",
        2: "line-clamp-2",
        3: "line-clamp-3",
        4: "line-clamp-4",
        5: "line-clamp-5",
        none: "",
      },
      scrollable: {
        true: "overflow-y-auto",
        false: "",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      spacing: "md",
      lines: "none",
      scrollable: false,
      align: "left",
    },
  }
)

export interface CardContentProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof contentVariants> {
  asChild?: boolean
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, spacing, lines, scrollable, align, asChild = false, children, ...props }, ref) => {
    return (
      <div
        data-slot="card-content"
        className={cn(contentVariants({ spacing, lines, scrollable, align }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardContent.displayName = "CardContent"

export { CardContent, contentVariants }
