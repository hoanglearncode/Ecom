"use client"

import * as React from "react"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { Card, CardProps } from "./Card"

export interface DraggableCardProps extends Omit<CardProps, "onDragEnd"> {
  id: string
  index?: number
  onDragEnd?: (data: { id: string; overId?: string }) => void
  disabled?: boolean
  handle?: "drag-handle" | "whole-card"
  sortable?: boolean
  dragOverlay?: React.ReactNode
}

const DraggableCard = React.forwardRef<HTMLDivElement, DraggableCardProps>(
  (
    {
      id,
      index = 0,
      onDragEnd,
      disabled = false,
      handle = "whole-card",
      sortable = true,
      dragOverlay,
      children,
      className,
      variant = "default",
      size = "md",
      interactive = "draggable",
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement>(null)

    // Use sortable if sortable is true, otherwise use draggable
    const sortableResult = sortable
      ? useSortable({
          id,
          disabled,
        })
      : null

    const draggableResult = !sortable
      ? useDraggable({
          id,
          disabled,
        })
      : null

    const attributes = sortableResult?.attributes || draggableResult?.attributes
    const listeners = sortableResult?.listeners || draggableResult?.listeners
    const setNodeRef = sortableResult?.setNodeRef || draggableResult?.setNodeRef
    const transform = sortableResult?.transform || draggableResult?.transform
    const transition = sortableResult?.transition
    const isDragging = sortableResult?.isDragging || draggableResult?.isDragging

    const style = {
      transform: CSS.Transform.toString(transform || { x: 0, y: 0, scaleX: 1, scaleY: 1 }),
      transition: transition || undefined,
    }

    // Clone listeners based on handle type
    const dragListeners = handle === "whole-card" ? listeners : undefined

    React.useImperativeHandle(ref, () => cardRef.current!)

    return (
      <div
        ref={(node) => {
          if (setNodeRef) setNodeRef(node)
          if (cardRef) {
            cardRef.current = node
          }
        }}
        style={style}
        className={cn(isDragging && "opacity-50", "relative")}
        {...attributes}
        {...dragListeners}
      >
        <Card
          variant={variant}
          size={size}
          interactive={interactive}
          className={cn(
            handle === "drag-handle" && "cursor-default",
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </div>
    )
  }
)
DraggableCard.displayName = "DraggableCard"

export { DraggableCard }
