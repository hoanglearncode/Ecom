"use client"

import * as React from "react"
import {
  useDraggable,
  useDroppable,
  UseDraggableArguments,
  UseDroppableArguments,
} from "@dnd-kit/core"

export interface UseCardDragOptions extends Partial<UseDraggableArguments> {
  id: string
  disabled?: boolean
}

export interface UseCardDropOptions extends Partial<UseDroppableArguments> {
  id: string
  disabled?: boolean
  onDrop?: (data: { id: string; activeId?: string }) => void
}

export function useCardDrag(options: UseCardDragOptions) {
  const { id, disabled = false, ...dragOptions } = options

  const draggable = useDraggable({
    id,
    disabled,
    ...dragOptions,
  })

  return {
    ...draggable,
    isDragging: draggable.isDragging,
  }
}

export function useCardDrop(options: UseCardDropOptions) {
  const { id, disabled = false, onDrop, ...dropOptions } = options
  const { setNodeRef, isOver, active } = useDroppable({
    id,
    disabled,
    ...dropOptions,
  })

  React.useEffect(() => {
    if (isOver && !disabled && active) {
      onDrop?.({ id, activeId: active.id as string })
    }
  }, [isOver, disabled, active, id, onDrop])

  return {
    setNodeRef,
    isOver,
    active,
  }
}
