type DeepKeyOf<T> = T extends object ? {
    [K in Extract<keyof T, string>]: K | `${K}.${DeepKeyOf<T[K]>}`;
}[Extract<keyof T, string>] : never;
type ValueOfDeepKey<T, K extends string> = K extends `${infer K1}.${infer K2}` ? K1 extends keyof T ? ValueOfDeepKey<T[K1], K2> : never : K extends keyof T ? T[K] : never;
export type HandleByKeyName<T> = <K extends keyof T>(target: K, value: T[K] | ((value: T) => T[K]), callBack?: ((next: T) => T) | undefined) => Promise<void>;
export interface BulkStateProps<T> {
    value: T;
    isMatched: boolean;
    existValue: T;
    handleByKeyName: HandleByKeyName<T>;
    handleValues: (next: T | ((prev: T) => T)) => void;
    pickAndUpdate: <K extends DeepKeyOf<T>>(target: K, value: ValueOfDeepKey<T, K>) => void;
    bulkInit: (value: T) => void;
    returnToOriginal: () => void;
    restoreValues: () => void;
    restoreByKeyNames: (keyNames: (keyof T)[]) => void;
}
declare const useBulkState: <T extends object>(initialValue: T) => BulkStateProps<T>;
export default useBulkState;
