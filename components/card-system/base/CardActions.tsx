import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CardAction {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  variant?: "default" | "primary" | "destructive" | "ghost" | "outline" | "secondary"
  disabled?: boolean
}

const actionsVariants = cva(
  "flex items-center",
  {
    variants: {
      orientation: {
        horizontal: "flex-row gap-2",
        vertical: "flex-col gap-1",
      },
      spacing: {
        sm: "gap-1",
        md: "gap-2",
        lg: "gap-3",
      },
      position: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        "space-between": "justify-between",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      spacing: "md",
      position: "end",
    },
  }
)

export interface CardActionsProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof actionsVariants> {
  actions: CardAction[]
  buttonSize?: "sm" | "default" | "lg" | "icon"
  asChild?: boolean
}

const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(
  ({ className, actions, orientation, position, buttonSize = "sm", asChild = false, ...props }, ref) => {
    const buttonSizeMap = {
      sm: "sm",
      default: "default",
      lg: "lg",
      icon: "icon",
    } as const

    return (
      <div
        data-slot="card-actions"
        className={cn(actionsVariants({ orientation, position }), className)}
        ref={ref}
        {...props}
      >
        {actions.map((action, index) => {
          const buttonVariant = action.variant === "primary" ? "default" : action.variant

          return (
            <Button
              key={index}
              size={buttonSizeMap[buttonSize]}
              variant={buttonVariant}
              onClick={action.onClick}
              disabled={action.disabled}
              className="gap-1.5"
            >
              {action.icon && <span className="shrink-0">{action.icon}</span>}
              {action.label}
            </Button>
          )
        })}
      </div>
    )
  }
)
CardActions.displayName = "CardActions"

export { CardActions, actionsVariants }
