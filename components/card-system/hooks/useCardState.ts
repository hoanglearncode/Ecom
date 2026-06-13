import * as React from "react"

export type CardState = "idle" | "loading" | "error" | "empty"

export interface UseCardStateOptions {
  initialState?: CardState
  onError?: (error: Error) => void
}

export function useCardState(options: UseCardStateOptions = {}) {
  const { initialState = "idle", onError } = options
  const [state, setState] = React.useState<CardState>(initialState)
  const [error, setError] = React.useState<Error | null>(null)

  const setLoading = React.useCallback(() => setState("loading"), [])
  const setErrorState = React.useCallback(
    (err: Error) => {
      setState("error")
      setError(err)
      onError?.(err)
    },
    [onError]
  )
  const setEmpty = React.useCallback(() => setState("empty"), [])
  const setIdle = React.useCallback(() => {
    setState("idle")
    setError(null)
  }, [])

  const isLoading = state === "loading"
  const isError = state === "error"
  const isEmpty = state === "empty"
  const isIdle = state === "idle"

  return {
    state,
    error,
    isLoading,
    isError,
    isEmpty,
    isIdle,
    setLoading,
    setError: setErrorState,
    setEmpty,
    setIdle,
  }
}
