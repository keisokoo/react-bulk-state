import { Draft, produce } from 'immer'
import { debounce, get, set } from 'lodash-es'
import equal from 'fast-deep-equal'
import { useCallback, useEffect, useRef, useState } from 'react'

export type BulkStateReturnType<T extends object> = ReturnType<typeof useBulkState<T>>;

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

function propsToPreviousCallback<T, K>(x: unknown): x is (a: T, b: K) => T {
  return x !== undefined && typeof x === 'function' && x instanceof Function
}

const useBulkState = <T extends object>(initialValue: T) => {
  const initialValueRef = useRef(initialValue)
  const [value, set_value] = useState<T>(initialValueRef.current)
  const [savedValue, set_savedValue] = useState<T>(initialValueRef.current)
  const [isMatched, setIsMatched] = useState(true);

  useEffect(() => {
    const debouncedCheck = debounce(() => {
      setIsMatched(equal(value, savedValue));
    }, 300);
    debouncedCheck();
    return () => debouncedCheck.cancel();
  }, [value, savedValue]);

  const initValue = useCallback((next?: T | ((prev: T) => T)) => {
    if (!next) {
      set_value(initialValue)
      set_savedValue(initialValue)
    } else {
      if (typeof next === 'function') {
        set_value((prev) => next(prev))
        set_savedValue((prev) => next(prev))
      } else {
        set_value(next)
        set_savedValue(next)
      }
    }
  }, [])

  const saveCurrentValue = useCallback(() => {
    set_value(currentValue => {
      const nextState = produce(currentValue, () => { });
      set_savedValue(nextState);
      return nextState;
    });
  }, []);

  const restoreToSaved = useCallback(() => {
    set_value(savedValue)
  }, [savedValue])

  const restoreToInit = useCallback(() => {
    set_value(produce(initialValueRef.current, () => { }))
  }, [])

  const restoreByKeyNames = useCallback((keyNames: (keyof T)[]) => {
    set_value(currentValue => produce(currentValue, draft => {
      keyNames.forEach(keyName => {
        (draft as T)[keyName] = initialValueRef.current[keyName];
      });
    }));
  }, [])


  const handleValues = useCallback((next: T | ((prev: T) => T)) => {
    if (typeof next === 'function') {
      set_value((prev) => next(prev))
    } else {
      set_value(next)
    }
  }, [])

  const handleByPath = useCallback(
    <K extends DeepKeyOf<T>>(target: K, value: ValueOfDeepKey<T, K> | ((current: ValueOfDeepKey<T, K>, prev: T) => ValueOfDeepKey<T, K>), callBack?: (changedDraft: Draft<T>) => Draft<T>) => {
      set_value((prev) => produce(prev, (draft) => {
        let cloned = { ...draft }
        if (typeof value === 'function' && propsToPreviousCallback(value)) {
          cloned = set(draft, target, value(get(draft, target), prev))
        } else {
          cloned = set(draft, target, value)
        }
        if (callBack) {
          callBack(cloned)
        }
        draft = cloned
      }))
    },
    []
  )
  const handleByDraft = useCallback(
    (callback: (draft: Draft<T>) => void) => {
      set_value((prev) => produce(prev, (draft) => {
        callback(draft)
      }))
    },
    []
  )

  const handleByKeyName = useCallback(
    <K extends keyof T>(
      target: K,
      value: T[K] | ((current: T[K], prev: T) => T[K]),
      callBack?: (next: T) => T
    ) => {
      set_value((prev) => {
        let next = produce(prev, () => { })
        if (typeof value === 'function' && propsToPreviousCallback(value)) {
          next = { ...next, [target]: value(prev[target], prev) }
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

  return {
    value,
    savedValue,
    isMatched,
    saveCurrentValue,
    initValue,
    handleByPath,
    handleValues,
    handleByDraft,
    handleByKeyName,
    restoreToInit,
    restoreToSaved,
    restoreByKeyNames,
  }
}
export default useBulkState