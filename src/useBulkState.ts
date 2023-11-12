import { produce } from 'immer'
import { debounce, get, set } from 'lodash-es'
import equal from 'fast-deep-equal'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * This is useBulkState's ReturnType. For using this to component's props, 
 * you can use like this: 
 * `type Props = { foo: BulkStateReturnType<typeof yourInitialValue> }`
 * `const YourComponent = ({foo}: Props) => { 
 *  const [state, { setState }] = foo;
 *  return <div onClick={() => setState('bar', 'baz')}>{state.bar}</div>}`
 */
export type BulkStateReturnType<T extends object> = ReturnType<typeof useBulkState<T>>;
export type SetByPath<T> = <K extends DeepKeyOf<T>>(target: K, data: ValueOfDeepKey<T, K> | ((current: ValueOfDeepKey<T, K>, prev: T) => ValueOfDeepKey<T, K>), recipe?: ((changedValue: T) => void) | undefined) => void
export type RestoreByKeyNames<T> = (keyNames: (keyof T)[]) => void
export type SetByImmer<T> = (recipe: (draft: T) => void) => void
export type InitBulkState<T> = (next?: T | ((prev: T) => T)) => void

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
 * const [state, { setState }] = useBulkState({ foo: 'bar' })
 * return <div onClick={() => setState('foo', 'baz')}>{state.foo}</div>
 * @example
 * const [state, { setState }] = useBulkState({ foo: { bar: { baz: 'hello' }} })
 * return <div onClick={() => setState('foo.bar.baz', (current) => current + ' world!')}>{state.foo.bar.baz}</div>
 * 
 */
const useBulkState = <T extends object>(initialValue: T) => {
  const initialValueRef = useRef(initialValue)
  const [state, set_state] = useState<T>(initialValueRef.current)
  const [savedState, set_savedState] = useState<T>(initialValueRef.current)
  const [isMatched, setIsMatched] = useState(true);

  useEffect(() => {
    const debouncedCheck = debounce(() => {
      setIsMatched(equal(state, savedState));
    }, 300);
    debouncedCheck();
    return () => debouncedCheck.cancel();
  }, [state, savedState]);

  const init = useCallback((next?: T | ((prev: T) => T)) => {
    if (!next) {
      set_state(initialValue)
      set_savedState(initialValue)
    } else {
      if (typeof next === 'function') {
        set_state((prev) => next(prev))
        set_savedState((prev) => next(prev))
      } else {
        set_state(next)
        set_savedState(next)
      }
    }
  }, [])

  const saveCurrentValue = useCallback(() => {
    set_state(currentValue => {
      const savingValue = produce(currentValue, () => { });
      set_savedState(savingValue);
      return currentValue;
    });
  }, []);

  const restoreToSaved = useCallback(() => {
    set_state(savedState)
  }, [savedState])

  const restoreToInit = useCallback(() => {
    set_state(produce(initialValueRef.current, () => { }))
  }, [])

  const restoreByKeyNames = useCallback((keyNames: (keyof T)[]) => {
    set_state(currentValue => produce(currentValue, draft => {
      keyNames.forEach(keyName => {
        (draft as T)[keyName] = initialValueRef.current[keyName];
      });
    }));
  }, [])


  const setBulkState = useCallback((next: T | ((prev: T) => T)) => {
    if (typeof next === 'function') {
      set_state((prev) => next(prev))
    } else {
      set_state(next)
    }
  }, [])

  const setState = useCallback(
    <K extends DeepKeyOf<T>>(target: K, data: ValueOfDeepKey<T, K> | ((current: ValueOfDeepKey<T, K>, prev: T) => ValueOfDeepKey<T, K>), recipe?: (changedValue: T) => void) => {
      set_state((prev) => {
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
      set_state((prev) => produce(prev, recipe))
    },
    []
  )

  return {
    state,
    setState,
    savedState,
    isMatched,
    saveCurrentValue,
    init,
    setBulkState,
    setByImmer,
    restoreToInit,
    restoreToSaved,
    restoreByKeyNames,
  }
}
export default useBulkState