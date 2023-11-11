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
 * const [state, { setByPath }] = useBulkState({ foo: 'bar' })
 * return <div onClick={() => setByPath('foo', 'baz')}>{state.foo}</div>
 * @example
 * const [state, { setByPath }] = useBulkState({ foo: { bar: { baz: 'hello' }} })
 * return <div onClick={() => setByPath('foo.bar.baz', (current) => current + ' world!')}>{state.foo.bar.baz}</div>
 *
 */
var useBulkState = function (initialValue) {
    var initialValueRef = useRef(initialValue);
    var _a = useState(initialValueRef.current), state = _a[0], set_state = _a[1];
    var _b = useState(initialValueRef.current), savedState = _b[0], set_savedState = _b[1];
    var _c = useState(true), isMatched = _c[0], setIsMatched = _c[1];
    useEffect(function () {
        var debouncedCheck = debounce(function () {
            setIsMatched(equal(state, savedState));
        }, 300);
        debouncedCheck();
        return function () { return debouncedCheck.cancel(); };
    }, [state, savedState]);
    var init = useCallback(function (next) {
        if (!next) {
            set_state(initialValue);
            set_savedState(initialValue);
        }
        else {
            if (typeof next === 'function') {
                set_state(function (prev) { return next(prev); });
                set_savedState(function (prev) { return next(prev); });
            }
            else {
                set_state(next);
                set_savedState(next);
            }
        }
    }, []);
    var saveCurrentValue = useCallback(function () {
        set_state(function (currentValue) {
            var savingValue = produce(currentValue, function () { });
            set_savedState(savingValue);
            return currentValue;
        });
    }, []);
    var restoreToSaved = useCallback(function () {
        set_state(savedState);
    }, [savedState]);
    var restoreToInit = useCallback(function () {
        set_state(produce(initialValueRef.current, function () { }));
    }, []);
    var restoreByKeyNames = useCallback(function (keyNames) {
        set_state(function (currentValue) { return produce(currentValue, function (draft) {
            keyNames.forEach(function (keyName) {
                draft[keyName] = initialValueRef.current[keyName];
            });
        }); });
    }, []);
    var setState = useCallback(function (next) {
        if (typeof next === 'function') {
            set_state(function (prev) { return next(prev); });
        }
        else {
            set_state(next);
        }
    }, []);
    var setByPath = useCallback(function (target, data, recipe) {
        set_state(function (prev) {
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
        set_state(function (prev) { return produce(prev, recipe); });
    }, []);
    return [state, {
            savedState: savedState,
            isMatched: isMatched,
            saveCurrentValue: saveCurrentValue,
            init: init,
            setState: setState,
            setByPath: setByPath,
            setByImmer: setByImmer,
            restoreToInit: restoreToInit,
            restoreToSaved: restoreToSaved,
            restoreByKeyNames: restoreByKeyNames,
        }];
};
export default useBulkState;
