import { __assign } from "tslib";
import { produce } from 'immer';
import { debounce, get, set } from 'lodash-es';
import equal from 'fast-deep-equal';
import { useCallback, useEffect, useRef, useState } from 'react';
function propsToPreviousCallback(x) {
    return x !== undefined && typeof x === 'function' && x instanceof Function;
}
var useBulkState = function (initialValue) {
    var initialValueRef = useRef(initialValue);
    var _a = useState(initialValueRef.current), value = _a[0], set_value = _a[1];
    var _b = useState(initialValueRef.current), savedValue = _b[0], set_savedValue = _b[1];
    var _c = useState(true), isMatched = _c[0], setIsMatched = _c[1];
    useEffect(function () {
        var debouncedCheck = debounce(function () {
            setIsMatched(equal(value, savedValue));
        }, 300);
        debouncedCheck();
        return function () { return debouncedCheck.cancel(); };
    }, [value, savedValue]);
    var initValue = useCallback(function (next) {
        if (!next) {
            set_value(initialValue);
            set_savedValue(initialValue);
        }
        else {
            if (typeof next === 'function') {
                set_value(function (prev) { return next(prev); });
                set_savedValue(function (prev) { return next(prev); });
            }
            else {
                set_value(next);
                set_savedValue(next);
            }
        }
    }, []);
    var saveCurrentValue = useCallback(function () {
        set_value(function (currentValue) {
            var nextState = produce(currentValue, function () { });
            set_savedValue(nextState);
            return nextState;
        });
    }, []);
    var restoreToSaved = useCallback(function () {
        set_value(savedValue);
    }, [savedValue]);
    var restoreToInit = useCallback(function () {
        set_value(produce(initialValueRef.current, function () { }));
    }, []);
    var restoreByKeyNames = useCallback(function (keyNames) {
        set_value(function (currentValue) { return produce(currentValue, function (draft) {
            keyNames.forEach(function (keyName) {
                draft[keyName] = initialValueRef.current[keyName];
            });
        }); });
    }, []);
    var handleValues = useCallback(function (next) {
        if (typeof next === 'function') {
            set_value(function (prev) { return next(prev); });
        }
        else {
            set_value(next);
        }
    }, []);
    var handleByPath = useCallback(function (target, value, callBack) {
        set_value(function (prev) { return produce(prev, function (draft) {
            var cloned = __assign({}, draft);
            if (typeof value === 'function' && propsToPreviousCallback(value)) {
                cloned = set(draft, target, value(get(draft, target), prev));
            }
            else {
                cloned = set(draft, target, value);
            }
            if (callBack) {
                callBack(cloned);
            }
            draft = cloned;
        }); });
    }, []);
    var handleByDraft = useCallback(function (callback) {
        set_value(function (prev) { return produce(prev, function (draft) {
            callback(draft);
        }); });
    }, []);
    var handleByKeyName = useCallback(function (target, value, callBack) {
        set_value(function (prev) {
            var _a, _b;
            var next = __assign({}, prev);
            if (typeof value === 'function' && propsToPreviousCallback(value)) {
                next = __assign(__assign({}, next), (_a = {}, _a[target] = value(prev[target], prev), _a));
            }
            else {
                next = __assign(__assign({}, next), (_b = {}, _b[target] = value, _b));
            }
            if (callBack) {
                return callBack(next);
            }
            else {
                return next;
            }
        });
    }, []);
    return {
        value: value,
        savedValue: savedValue,
        isMatched: isMatched,
        saveCurrentValue: saveCurrentValue,
        initValue: initValue,
        handleByPath: handleByPath,
        handleValues: handleValues,
        handleByDraft: handleByDraft,
        handleByKeyName: handleByKeyName,
        restoreToInit: restoreToInit,
        restoreToSaved: restoreToSaved,
        restoreByKeyNames: restoreByKeyNames,
    };
};
export default useBulkState;
