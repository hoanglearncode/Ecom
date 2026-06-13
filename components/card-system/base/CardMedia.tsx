import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Image from "next/image"

const mediaVariants = cva(
  "relative overflow-hidden bg-muted",
  {
    variants: {
      aspectRatio: {
        "1:1": "aspect-square",
        "4:3": "aspect-[4/3]",
        "16:9": "aspect-video",
        "3:4": "aspect-[3/4]",
        "cover": "aspect-auto",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      aspectRatio: "1:1",
      radius: "md",
    },
  }
)

const overlayVariants = cva(
  "absolute inset-0 flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-t from-black/60 to-transparent",
        dark: "bg-black/40",
        light: "bg-white/40",
        none: "",
      },
      position: {
        top: "items-start",
        center: "items-center",
        bottom: "items-end",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "bottom",
    },
  }
)

export interface CardMediaProps
  extends Omit<React.ComponentProps<"div">, "aspectRatio">,
    VariantProps<typeof mediaVariants> {
  src?: string
  alt?: string
  overlay?: React.ReactNode
  overlayVariant?: VariantProps<typeof overlayVariants>["variant"]
  overlayPosition?: VariantProps<typeof overlayVariants>["position"]
  objectFit?: "cover" | "contain" | "fill"
  fallback?: React.ReactNode
  asChild?: boolean
}

const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  (
    {
      className,
      src,
      alt,
      aspectRatio,
      radius,
      overlay,
      overlayVariant = "default",
      overlayPosition = "bottom",
      objectFit = "cover",
      fallback,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false)

    const handleError = () => {
      setImageError(true)
    }

    const content = (
      <>
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt || ""}
            fill
            className={cn("transition-transform duration-300 group-hover:scale-105", {
              "object-cover": objectFit === "cover",
              "object-contain": objectFit === "contain",
              "object-fill": objectFit === "fill",
            })}
            onError={handleError}
          />
        ) : (
          fallback || (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )
        )}

        {overlay && (
          <div className={cn(overlayVariants({ variant: overlayVariant, position: overlayPosition }))}>
            {overlay}
          </div>
        )}
      </>
    )

    if (asChild) {
      return <div ref={ref} className={cn(mediaVariants({ aspectRatio, radius }), className)} {...props}>{content}</div>
    }

    return (
      <div
        data-slot="card-media"
        className={cn(mediaVariants({ aspectRatio, radius }), className)}
        ref={ref}
        {...props}
      >
        {content}
      </div>
    )
  }
)
CardMedia.displayName = "CardMedia"

export { CardMedia, mediaVariants, overlayVariants }
