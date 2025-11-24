import { useState, useCallback, useRef, useEffect } from 'react'

type HistoryState<T> = {
  past: T[]
  present: T
  future: T[]
}

type UseHistoryReturn<T> = {
  value: T
  setValue: (value: T) => void
  undo: () => void
  redo: () => void
  reset: (value: T) => void
  canUndo: boolean
  canRedo: boolean
}

const MAX_HISTORY_SIZE = 100

export function useHistory<T>(
  initialValue: T,
  externalValue?: T,
  onExternalChange?: (value: T) => void
): UseHistoryReturn<T> {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialValue,
    future: [],
  })

  const isExternalUpdate = useRef(false)
  const lastExternalValue = useRef(externalValue)

  // Sync with external value (from localStorage)
  useEffect(() => {
    if (
      externalValue !== undefined &&
      externalValue !== lastExternalValue.current &&
      !isExternalUpdate.current
    ) {
      setState({
        past: [],
        present: externalValue,
        future: [],
      })
      lastExternalValue.current = externalValue
    }
    isExternalUpdate.current = false
  }, [externalValue])

  const setValue = useCallback(
    (newValue: T) => {
      setState((prev) => {
        if (prev.present === newValue) return prev
        const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY_SIZE)
        return {
          past: newPast,
          present: newValue,
          future: [],
        }
      })
      isExternalUpdate.current = true
      onExternalChange?.(newValue)
    },
    [onExternalChange]
  )

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.past.length === 0) return prev
      const newPast = prev.past.slice(0, -1)
      const newPresent = prev.past[prev.past.length - 1]
      const newState = {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      }
      isExternalUpdate.current = true
      onExternalChange?.(newPresent)
      return newState
    })
  }, [onExternalChange])

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.future.length === 0) return prev
      const newFuture = prev.future.slice(1)
      const newPresent = prev.future[0]
      const newState = {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      }
      isExternalUpdate.current = true
      onExternalChange?.(newPresent)
      return newState
    })
  }, [onExternalChange])

  const reset = useCallback(
    (value: T) => {
      setState({
        past: [],
        present: value,
        future: [],
      })
      isExternalUpdate.current = true
      onExternalChange?.(value)
    },
    [onExternalChange]
  )

  return {
    value: state.present,
    setValue,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  }
}
