import { cloneDeep, get, isEqual, set } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'

type DeepKeyOf<T> = T extends object
  ? { [K in Extract<keyof T, string>]: K | `${K}.${DeepKeyOf<T[K]>}` }[Extract<
    keyof T,
    string
  >]
  : never

type ValueOfDeepKey<T, K extends string> = K extends `${infer K1}.${infer K2}`
  ? K1 extends keyof T
  ? ValueOfDeepKey<T[K1], K2>
  : never
  : K extends keyof T
  ? T[K]
  : never

export type HandleByKeyName<T> = <K extends keyof T>(
  target: K,
  value: T[K] | ((value: T) => T[K]),
  callBack?: ((next: T) => T) | undefined
) => Promise<void>

export interface BulkStateProps<T> {
  value: T
  isMatched: boolean
  existValue: T
  handleByKeyName: HandleByKeyName<T>
  handleValues: (next: T | ((prev: T) => T)) => void
  pickAndUpdate: <K extends DeepKeyOf<T>>(
    target: K,
    value: ValueOfDeepKey<T, K>
  ) => void
  bulkInit: (value: T) => void
  returnToOriginal: () => void
  restoreValues: () => void
  restoreByKeyNames: (keyNames: (keyof T)[]) => void
}

function isFunction<T>(x: unknown): x is (value: T) => void {
  return x !== undefined && typeof x === 'function' && x instanceof Function
}

export const useBulkState = <T extends object>(initialValue: T) => {
  const [value, set_value] = useState<T>(cloneDeep({ ...initialValue }))
  const [existValue, set_existValue] = useState<T>(
    cloneDeep({ ...initialValue })
  )
  const bulkInit = useCallback((next: T | ((prev: T) => T)) => {
    if (typeof next === 'function') {
      set_value((prev) => next(prev))
      set_existValue((prev) => next(prev))
    } else {
      set_value(next)
      set_existValue(cloneDeep(next))
    }
  }, [])

  const syncCurrentValue = useCallback(() => {
    set_value((prev) => {
      set_existValue(cloneDeep(prev))
      return prev
    })
  }, [])

  const restoreValues = useCallback(() => {
    set_value(cloneDeep(initialValue))
    set_existValue(cloneDeep(initialValue))
  }, [])

  const restoreByKeyNames = useCallback((keyNames: (keyof T)[]) => {
    set_value((prev) => {
      let cloned = cloneDeep(prev)
      const partialInitial = keyNames.reduce((prev, keyName) => {
        prev[keyName] = get(cloneDeep({ ...initialValue }), keyName)
        return prev
      }, {} as Partial<T>)
      return { ...cloned, ...partialInitial }
    })
  }, [])


  const handleValues = useCallback((next: T | ((prev: T) => T)) => {
    if (typeof next === 'function') {
      set_value((prev) => next(prev))
    } else {
      set_value(next)
    }
  }, [])

  const pickAndUpdate = useCallback(
    <K extends DeepKeyOf<T>>(target: K, value: ValueOfDeepKey<T, K>) => {
      set_value((prev) => cloneDeep({ ...set(prev, target, value) }))
    },
    []
  )

  const handleByKeyName: HandleByKeyName<T> = useCallback(
    async <K extends keyof T>(
      target: K,
      value: T[K] | ((value: T) => T[K]),
      callBack?: (next: T) => T
    ) => {
      set_value((prev) => {
        let next = { ...prev }
        if (typeof value === 'function' && isFunction(value)) {
          next = { ...next, [target]: (value as (value: T) => T[K])(prev) }
        } else {
          next = { ...next, [target]: value }
        }
        if (callBack) {
          return callBack(next)
        } else {
          return next
        }
      })
    },
    []
  )

  const returnToOriginal = useCallback(() => {
    set_value(cloneDeep({ ...existValue }))
  }, [existValue])

  const isMatched = useMemo(() => {
    return isEqual(existValue, value)
  }, [value, existValue])

  return {
    value,
    existValue,
    isMatched,
    syncCurrentValue,
    pickAndUpdate,
    bulkInit,
    handleValues,
    handleByKeyName,
    returnToOriginal,
    restoreValues,
    restoreByKeyNames,
  } as BulkStateProps<T>
}
