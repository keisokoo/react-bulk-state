export declare const objectKeys: <T extends object, K extends keyof T>(value: T) => K[];
type KeysMapping<T, K extends {
    [key: string]: (keyof T)[];
}> = {
    [P in keyof K]: Pick<T, K[P][number]>;
};
type RestoreTypes = 'after' | 'from-current' | 'current-only';
type CustomValidations<T, J extends {
    [key: string]: (keyof T)[];
}, K extends keyof J> = {
    [P in J[K][number]]?: (currentValue: T[P]) => boolean;
};
export declare function getStepsValue<T, J extends {
    [key: string]: (keyof T)[];
}>(initialValue: T, values: J): KeysMapping<T, J>;
export type StepperOptions<T extends object, J extends {
    [key: string]: (keyof T)[];
}> = {
    restoreWhenPrev?: boolean;
    customValidations?: {
        [P in keyof J]?: CustomValidations<T, J, P>;
    };
    optionalValue?: (keyof T)[];
};
declare const useBulkStep: <T extends object, J extends {
    [key: string]: (keyof T)[];
}, K extends keyof J>(initialValue: T, values: J, configs?: StepperOptions<T, J> | undefined) => {
    currentStep: K;
    setCurrentStep: (step: K, restore?: RestoreTypes) => void;
    allSteps: K[];
    stepValue: KeysMapping<T, J>;
    bulkValue: {
        value: T;
        savedValue: T;
        isMatched: boolean;
        saveCurrentValue: () => void;
        handleByPath: <K_12 extends T extends object ? { [K_1 in Extract<keyof T, string>]: K_1 | `${K_1}.${T[K_1] extends infer T_1 ? T_1 extends T[K_1] ? T_1 extends object ? { [K_2 in Extract<keyof T_1, string>]: K_2 | `${K_2}.${T_1[K_2] extends infer T_2 ? T_2 extends T_1[K_2] ? T_2 extends object ? { [K_3 in Extract<keyof T_2, string>]: K_3 | `${K_3}.${T_2[K_3] extends infer T_3 ? T_3 extends T_2[K_3] ? T_3 extends object ? { [K_4 in Extract<keyof T_3, string>]: K_4 | `${K_4}.${T_3[K_4] extends infer T_4 ? T_4 extends T_3[K_4] ? T_4 extends object ? { [K_5 in Extract<keyof T_4, string>]: K_5 | `${K_5}.${T_4[K_5] extends infer T_5 ? T_5 extends T_4[K_5] ? T_5 extends object ? { [K_6 in Extract<keyof T_5, string>]: K_6 | `${K_6}.${T_5[K_6] extends infer T_6 ? T_6 extends T_5[K_6] ? T_6 extends object ? { [K_7 in Extract<keyof T_6, string>]: K_7 | `${K_7}.${T_6[K_7] extends infer T_7 ? T_7 extends T_6[K_7] ? T_7 extends object ? { [K_8 in Extract<keyof T_7, string>]: K_8 | `${K_8}.${T_7[K_8] extends infer T_8 ? T_8 extends T_7[K_8] ? T_8 extends object ? { [K_9 in Extract<keyof T_8, string>]: K_9 | `${K_9}.${T_8[K_9] extends infer T_9 ? T_9 extends T_8[K_9] ? T_9 extends object ? { [K_10 in Extract<keyof T_9, string>]: K_10 | `${K_10}.${T_9[K_10] extends infer T_10 ? T_10 extends T_9[K_10] ? T_10 extends object ? { [K_11 in Extract<keyof T_10, string>]: K_11 | `${K_11}.${any}`; }[Extract<keyof T_10, string>] : never : never : never}`; }[Extract<keyof T_9, string>] : never : never : never}`; }[Extract<keyof T_8, string>] : never : never : never}`; }[Extract<keyof T_7, string>] : never : never : never}`; }[Extract<keyof T_6, string>] : never : never : never}`; }[Extract<keyof T_5, string>] : never : never : never}`; }[Extract<keyof T_4, string>] : never : never : never}`; }[Extract<keyof T_3, string>] : never : never : never}`; }[Extract<keyof T_2, string>] : never : never : never}`; }[Extract<keyof T_1, string>] : never : never : never}`; }[Extract<keyof T, string>] : never>(target: K_12, value: (K_12 extends `${infer K1}.${infer K2}` ? K1 extends keyof T ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K1] ? any : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1] ? T[K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1] ? T[K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1] ? T[K1][K1][K2] : never : never : K2 extends keyof T[K1] ? T[K1][K2] : never : never : K_12 extends keyof T ? T[K_12] : never) | ((current: K_12 extends `${infer K1}.${infer K2}` ? K1 extends keyof T ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K1] ? any : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1] ? T[K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1] ? T[K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1] ? T[K1][K1][K2] : never : never : K2 extends keyof T[K1] ? T[K1][K2] : never : never : K_12 extends keyof T ? T[K_12] : never, prev: T) => K_12 extends `${infer K1}.${infer K2}` ? K1 extends keyof T ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1] ? K2 extends `${infer K1}.${infer K2}` ? K1 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K1] ? any : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1][K1] ? T[K1][K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1][K1] ? T[K1][K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1][K1] ? T[K1][K1][K1][K2] : never : never : K2 extends keyof T[K1][K1] ? T[K1][K1][K2] : never : never : K2 extends keyof T[K1] ? T[K1][K2] : never : never : K_12 extends keyof T ? T[K_12] : never), callBack?: ((changedDraft: import("immer").Draft<T>) => import("immer").Draft<T>) | undefined) => void;
        initValue: (next?: T | ((prev: T) => T) | undefined) => void;
        handleValues: (next: T | ((prev: T) => T)) => void;
        handleByDraft: (callback: (draft: import("immer").Draft<T>) => void) => void;
        handleByKeyName: <K_13 extends keyof T>(target: K_13, value: T[K_13] | ((current: T[K_13], prev: T) => T[K_13]), callBack?: ((next: T) => T) | undefined) => void;
        restoreToInit: () => void;
        restoreToSaved: () => void;
        restoreByKeyNames: (keyNames: (keyof T)[]) => void;
    };
    checkValidStep: (step: K, customValidations?: CustomValidations<T, J, K> | null | undefined, optional?: (keyof T)[] | undefined) => boolean;
    validSteps: { [P in keyof J]?: boolean | undefined; };
    validAllSteps: boolean;
    prevStep: () => void;
    nextStep: () => void;
};
export default useBulkStep;
