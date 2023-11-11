import { produce } from 'immer';
import { debounce, get, set } from 'lodash-es';
import equal from 'fast-deep-equal';
import { useCallback, useEffect, useRef, useState } from 'react';
function propsToPreviousCallback(x) {
    return x !== undefined && typeof x === 'function' && x instanceof Function;
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
var useBulkState = function (initialValue) {
    var initialValueRef = useRef(initialValue);
    var _a = useState(initialValueRef.current), bulkState = _a[0], set_bulkState = _a[1];
    var _b = useState(initialValueRef.current), savedValue = _b[0], set_savedValue = _b[1];
    var _c = useState(true), isMatched = _c[0], setIsMatched = _c[1];
    useEffect(function () {
        var debouncedCheck = debounce(function () {
            setIsMatched(equal(bulkState, savedValue));
        }, 300);
        debouncedCheck();
        return function () { return debouncedCheck.cancel(); };
    }, [bulkState, savedValue]);
    var initValue = useCallback(function (next) {
        if (!next) {
            set_bulkState(initialValue);
            set_savedValue(initialValue);
        }
        else {
            if (typeof next === 'function') {
                set_bulkState(function (prev) { return next(prev); });
                set_savedValue(function (prev) { return next(prev); });
            }
            else {
                set_bulkState(next);
                set_savedValue(next);
            }
        }
    }, []);
    var saveCurrentValue = useCallback(function () {
        set_bulkState(function (currentValue) {
            var savingValue = produce(currentValue, function () { });
            set_savedValue(savingValue);
            return currentValue;
        });
    }, []);
    var restoreToSaved = useCallback(function () {
        set_bulkState(savedValue);
    }, [savedValue]);
    var restoreToInit = useCallback(function () {
        set_bulkState(produce(initialValueRef.current, function () { }));
    }, []);
    var restoreByKeyNames = useCallback(function (keyNames) {
        set_bulkState(function (currentValue) { return produce(currentValue, function (draft) {
            keyNames.forEach(function (keyName) {
                draft[keyName] = initialValueRef.current[keyName];
            });
        }); });
    }, []);
    var setBulkState = useCallback(function (next) {
        if (typeof next === 'function') {
            set_bulkState(function (prev) { return next(prev); });
        }
        else {
            set_bulkState(next);
        }
    }, []);
    var setByPath = useCallback(function (target, data, recipe) {
        set_bulkState(function (prev) {
            var changedValue = produce(prev, function (draft) {
                if (typeof data === 'function' && propsToPreviousCallback(data)) {
                    set(draft, target, data(get(draft, target), prev));
                }
                else {
                    set(draft, target, data);
                }
            });
            if (recipe) {
                changedValue = produce(changedValue, recipe);
            }
            return changedValue;
        });
    }, []);
    var setByImmer = useCallback(function (recipe) {
        set_bulkState(function (prev) { return produce(prev, recipe); });
    }, []);
    return [bulkState, {
            savedValue: savedValue,
            isMatched: isMatched,
            saveCurrentValue: saveCurrentValue,
            initValue: initValue,
            setBulkState: setBulkState,
            setByPath: setByPath,
            setByImmer: setByImmer,
            restoreToInit: restoreToInit,
            restoreToSaved: restoreToSaved,
            restoreByKeyNames: restoreByKeyNames,
        }];
};
export default useBulkState;
