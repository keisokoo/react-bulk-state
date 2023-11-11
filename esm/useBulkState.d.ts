import { Draft } from 'immer';
export type BulkStateReturnType<T extends object> = ReturnType<typeof useBulkState<T>>;
type DeepKeyOf<T> = T extends object ? {
    [K in Extract<keyof T, string>]: K | `${K}.${DeepKeyOf<T[K]>}`;
}[Extract<keyof T, string>] : never;
type ValueOfDeepKey<T, K extends string> = K extends `${infer K1}.${infer K2}` ? K1 extends keyof T ? ValueOfDeepKey<T[K1], K2> : never : K extends keyof T ? T[K] : never;
declare const useBulkState: <T extends object>(initialValue: T) => {
    value: T;
    savedValue: T;
    isMatched: boolean;
    saveCurrentValue: () => void;
    initValue: (next?: T | ((prev: T) => T) | undefined) => void;
    setBulkState: (next: T | ((prev: T) => T)) => void;
    setByPath: <K extends DeepKeyOf<T>>(target: K, value: ValueOfDeepKey<T, K> | ((current: ValueOfDeepKey<T, K>, prev: T) => ValueOfDeepKey<T, K>), callBack?: ((changedDraft: Draft<T>) => Draft<T>) | undefined) => void;
    setByImmer: (recipe: (draft: Draft<T>) => void) => void;
    restoreToInit: () => void;
    restoreToSaved: () => void;
    restoreByKeyNames: (keyNames: (keyof T)[]) => void;
};
export default useBulkState;
