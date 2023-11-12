/**
 * This is useBulkState's ReturnType. For using this to component's props,
 * you can use like this:
 * `type Props = { foo: BulkStateReturnType<typeof yourInitialValue> }`
 * `const YourComponent = ({foo}: Props) => {
 *  const [state, { setState }] = foo;
 *  return <div onClick={() => setState('bar', 'baz')}>{state.bar}</div>}`
 */
export type BulkStateReturnType<T extends object> = ReturnType<typeof useBulkState<T>>;
export type SetByPath<T> = <K extends DeepKeyOf<T>>(target: K, data: ValueOfDeepKey<T, K> | ((current: ValueOfDeepKey<T, K>, prev: T) => ValueOfDeepKey<T, K>), recipe?: ((changedValue: T) => void) | undefined) => void;
export type RestoreByKeyNames<T> = (keyNames: (keyof T)[]) => void;
export type SetByImmer<T> = (recipe: (draft: T) => void) => void;
export type InitBulkState<T> = (next?: T | ((prev: T) => T)) => void;
type DeepKeyOf<T> = T extends object ? {
    [K in Extract<keyof T, string>]: K | `${K}.${DeepKeyOf<T[K]>}`;
}[Extract<keyof T, string>] : never;
type ValueOfDeepKey<T, K extends string> = K extends `${infer K1}.${infer K2}` ? K1 extends keyof T ? ValueOfDeepKey<T[K1], K2> : never : K extends keyof T ? T[K] : never;
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
declare const useBulkState: <T extends object>(initialValue: T) => {
    state: T;
    setState: <K extends DeepKeyOf<T>>(target: K, data: ValueOfDeepKey<T, K> | ((current: ValueOfDeepKey<T, K>, prev: T) => ValueOfDeepKey<T, K>), recipe?: ((changedValue: T) => void) | undefined) => void;
    savedState: T;
    isMatched: boolean;
    saveCurrentValue: () => void;
    init: (next?: T | ((prev: T) => T) | undefined) => void;
    setBulkState: (next: T | ((prev: T) => T)) => void;
    setByImmer: (recipe: (draft: T) => void) => void;
    restoreToInit: () => void;
    restoreToSaved: () => void;
    restoreByKeyNames: (keyNames: (keyof T)[]) => void;
};
export default useBulkState;
