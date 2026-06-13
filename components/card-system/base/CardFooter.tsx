import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const footerVariants = cva(
  "flex items-center gap-2",
  {
    variants: {
      spacing: {
        sm: "gap-2 p-3",
        md: "gap-3 p-4",
        lg: "gap-4 p-6",
        none: "gap-2",
      },
      position: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        "space-between": "justify-between",
      },
      divider: {
        true: "border-t",
        false: "",
      },
    },
    defaultVariants: {
      spacing: "md",
      position: "start",
      divider: true,
    },
  }
)

export interface CardFooterProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof footerVariants> {
  asChild?: boolean
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, spacing, position, divider, asChild = false, children, ...props }, ref) => {
    return (
      <div
        data-slot="card-footer"
        className={cn(footerVariants({ spacing, position, divider }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardFooter.displayName = "CardFooter"

export { CardFooter, footerVariants }
