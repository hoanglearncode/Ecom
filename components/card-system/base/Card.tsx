  import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border shadow-sm",
        outlined: "border-2 bg-background",
        elevated: "border-0 shadow-md",
        flat: "border-0 bg-muted/50 shadow-none",
        glass: "border-0 bg-background/80 backdrop-blur-md shadow-sm",
      },
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      interactive: {
        none: "",
        hover: "hover:shadow-md hover:border-primary/20 cursor-pointer",
        clickable: "hover:shadow-md active:scale-[0.98] cursor-pointer",
        draggable: "cursor-move hover:shadow-md",
      },
      selected: {
        true: "ring-2 ring-primary ring-offset-2 ring-offset-background",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "glass",
        interactive: "hover",
        className: "hover:bg-background/90",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: "none",
      selected: false,
      fullWidth: false,
    },
  }
)

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
  loading?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive, selected, fullWidth, loading, asChild = false, children, ...props }, ref) => {
    const cardClassName = cn(cardVariants({ variant, size, interactive, selected, fullWidth }), className)

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(cardClassName, (children as React.ReactElement<any>).props.className),
        ref,
      } as any)
    }

    return (
      <div
        data-slot="card"
        data-variant={variant}
        data-interactive={interactive}
        aria-busy={loading}
        className={cardClassName}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

export { Card, cardVariants }
