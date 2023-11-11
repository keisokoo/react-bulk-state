import { produce } from 'immer'
import { debounce, get, set } from 'lodash-es'
import equal from 'fast-deep-equal'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * This is useBulkState's ReturnType. For using this to component's props, 
 * you can use like this: 
 * `type Props = { foo: BulkStateReturnType<typeof yourInitialValue> }`
 * `const YourComponent = ({foo}: Props) => { 
 *  const { bulkState, setByPath } = foo;
 *  return <div onClick={() => setByPath('bar', 'baz')}>{bulkState.bar}</div>}`
 */
export type BulkStateReturnType<T extends object> = ReturnType<typeof useBulkState<T>>;
export type SetBulkState<T> = (next: T | ((prev: T) => T)) => void
export type SetByPath<T> = <K extends DeepKeyOf<T>>(target: K, data: ValueOfDeepKey<T, K> | ((current: ValueOfDeepKey<T, K>, prev: T) => ValueOfDeepKey<T, K>), recipe?: ((changedValue: T) => void) | undefined) => void
export type RestoreByKeyNames<T> = (keyNames: (keyof T)[]) => void
export type SetByImmer<T> = (recipe: (draft: T) => void) => void
export type InitValue<T> = (next?: T | ((prev: T) => T)) => void

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
/**
 * useBulkState is a react hook that can be used in the same way as useState. 
 * But it has some additional features.
 * @example
 * const { bulkState, setByPath } = useBulkState({ foo: 'bar' })
 * return <div onClick={() => setByPath('foo', 'baz')}>{bulkState.foo}</div>
 * @example
 * const { bulkState, setByPath } = useBulkState({ foo: { bar: { baz: 'hello' }} })
 * return <div onClick={() => setByPath('foo.bar.baz', (current) => current + ' world!')}>{bulkState.foo.bar.baz}</div>
 * 
 */
const useBulkState = <T extends object>(initialValue: T) => {
  const initialValueRef = useRef(initialValue)
  const [bulkState, set_bulkState] = useState<T>(initialValueRef.current)
  const [savedValue, set_savedValue] = useState<T>(initialValueRef.current)
  const [isMatched, setIsMatched] = useState(true);

  useEffect(() => {
    const debouncedCheck = debounce(() => {
      setIsMatched(equal(bulkState, savedValue));
    }, 300);
    debouncedCheck();
    return () => debouncedCheck.cancel();
  }, [bulkState, savedValue]);

  const initValue = useCallback((next?: T | ((prev: T) => T)) => {
    if (!next) {
      set_bulkState(initialValue)
      set_savedValue(initialValue)
    } else {
      if (typeof next === 'function') {
        set_bulkState((prev) => next(prev))
        set_savedValue((prev) => next(prev))
      } else {
        set_bulkState(next)
        set_savedValue(next)
      }
    }
  }, [])

  const saveCurrentValue = useCallback(() => {
    set_bulkState(currentValue => {
      const savingValue = produce(currentValue, () => { });
      set_savedValue(savingValue);
      return currentValue;
    });
  }, []);

  const restoreToSaved = useCallback(() => {
    set_bulkState(savedValue)
  }, [savedValue])

  const restoreToInit = useCallback(() => {
    set_bulkState(produce(initialValueRef.current, () => { }))
  }, [])

  const restoreByKeyNames = useCallback((keyNames: (keyof T)[]) => {
    set_bulkState(currentValue => produce(currentValue, draft => {
      keyNames.forEach(keyName => {
        (draft as T)[keyName] = initialValueRef.current[keyName];
      });
    }));
  }, [])


  const setBulkState = useCallback((next: T | ((prev: T) => T)) => {
    if (typeof next === 'function') {
      set_bulkState((prev) => next(prev))
    } else {
      set_bulkState(next)
    }
  }, [])

  const setByPath = useCallback(
    <K extends DeepKeyOf<T>>(target: K, data: ValueOfDeepKey<T, K> | ((current: ValueOfDeepKey<T, K>, prev: T) => ValueOfDeepKey<T, K>), recipe?: (changedValue: T) => void) => {
      set_bulkState((prev) => {
        let changedValue = produce(prev, (draft) => {
          if (typeof data === 'function' && propsToPreviousCallback(data)) {
            set(draft, target, data(get(draft, target), prev))
          } else {
            set(draft, target, data)
          }
        })
        if (recipe) {
          changedValue = produce(changedValue, recipe)
        }
        return changedValue
      })
    },
    []
  )
  const setByImmer = useCallback(
    (recipe: (draft: T) => void) => {
      set_bulkState((prev) => produce(prev, recipe))
    },
    []
  )


  return [bulkState, {
    savedValue,
    isMatched,
    saveCurrentValue,
    initValue,
    setBulkState,
    setByPath,
    setByImmer,
    restoreToInit,
    restoreToSaved,
    restoreByKeyNames,
  }] as const
}
export default useBulkState