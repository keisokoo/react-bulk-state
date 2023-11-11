/**
 * This is useBulkState's ReturnType. For using this to component's props,
 * you can use like this:
 * `type Props = { foo: BulkStateReturnType<typeof yourInitialValue> }`
 * `const YourComponent = ({foo}: Props) => {
 *  const { bulkState, setByPath } = foo;
 *  return <div onClick={() => setByPath('bar', 'baz')}>{bulkState.bar}</div>}`
 */
export type BulkStateReturnType<T extends object> = ReturnType<typeof useBulkState<T>>;
export type SetBulkState<T> = (next: T | ((prev: T) => T)) => void;
export type SetByPath<T> = <K extends DeepKeyOf<T>>(target: K, data: ValueOfDeepKey<T, K> | ((current: ValueOfDeepKey<T, K>, prev: T) => ValueOfDeepKey<T, K>), recipe?: ((changedValue: T) => void) | undefined) => void;
export type RestoreByKeyNames<T> = (keyNames: (keyof T)[]) => void;
export type SetByImmer<T> = (recipe: (draft: T) => void) => void;
export type InitValue<T> = (next?: T | ((prev: T) => T)) => void;
type DeepKeyOf<T> = T extends object ? {
    [K in Extract<keyof T, string>]: K | `${K}.${DeepKeyOf<T[K]>}`;
}[Extract<keyof T, string>] : never;
type ValueOfDeepKey<T, K extends string> = K extends `${infer K1}.${infer K2}` ? K1 extends keyof T ? ValueOfDeepKey<T[K1], K2> : never : K extends keyof T ? T[K] : never;
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
declare const useBulkState: <T extends object>(initialValue: T) => readonly [T, {
    readonly savedValue: T;
    readonly isMatched: boolean;
    readonly saveCurrentValue: () => void;
    readonly initValue: (next?: T | ((prev: T) => T) | undefined) => void;
    readonly setBulkState: (next: T | ((prev: T) => T)) => void;
    readonly setByPath: <K extends DeepKeyOf<T>>(target: K, data: ValueOfDeepKey<T, K> | ((current: ValueOfDeepKey<T, K>, prev: T) => ValueOfDeepKey<T, K>), recipe?: ((changedValue: T) => void) | undefined) => void;
    readonly setByImmer: (recipe: (draft: T) => void) => void;
    readonly restoreToInit: () => void;
    readonly restoreToSaved: () => void;
    readonly restoreByKeyNames: (keyNames: (keyof T)[]) => void;
}];
export default useBulkState;
