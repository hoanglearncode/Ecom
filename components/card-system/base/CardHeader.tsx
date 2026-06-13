import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

const headerVariants = cva(
  "flex items-start gap-3",
  {
    variants: {
      layout: {
        default: "flex-row",
        vertical: "flex-col",
      },
      spacing: {
        sm: "gap-2 p-3",
        md: "gap-3 p-4",
        lg: "gap-4 p-6",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
      },
    },
    defaultVariants: {
      layout: "default",
      spacing: "md",
      align: "start",
    },
  }
)

export interface CardHeaderProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof headerVariants> {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  action?: React.ReactNode
  avatar?: React.ReactNode
  asChild?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      className,
      title,
      subtitle,
      icon,
      badge,
      action,
      avatar,
      layout,
      spacing,
      align,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        {avatar && (
          <div className="shrink-0" data-slot="card-avatar">
            {avatar}
          </div>
        )}

        <div className="flex-1 min-w-0" data-slot="card-header-content">
          <div className="flex items-center gap-2">
            {icon && <div className="shrink-0 text-muted-foreground">{icon}</div>}
            {title && (
              <h3 className="font-semibold leading-none truncate" data-slot="card-title">
                {title}
              </h3>
            )}
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1 truncate" data-slot="card-subtitle">
              {subtitle}
            </p>
          )}
          {children}
        </div>

        {action && (
          <div className="shrink-0" data-slot="card-action">
            {action}
          </div>
        )}
      </>
    )

    if (asChild) {
      return (
        <Slot ref={ref} className={cn(headerVariants({ layout, spacing, align }), className)} {...props}>
          {content}
        </Slot>
      )
    }

    return (
      <div
        data-slot="card-header"
        className={cn(headerVariants({ layout, spacing, align }), className)}
        ref={ref}
        {...props}
      >
        {content}
      </div>
    )
  }
)
CardHeader.displayName = "CardHeader"

export { CardHeader, headerVariants }
