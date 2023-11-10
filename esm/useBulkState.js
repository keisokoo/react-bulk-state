import { __assign, __awaiter, __generator } from "tslib";
import { cloneDeep, get, isEqual, set } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';
function isFunction(x) {
    return x !== undefined && typeof x === 'function' && x instanceof Function;
}
var useBulkState = function (initialValue) {
    var _a = useState(cloneDeep(__assign({}, initialValue))), value = _a[0], set_value = _a[1];
    var _b = useState(cloneDeep(__assign({}, initialValue))), existValue = _b[0], set_existValue = _b[1];
    var bulkInit = useCallback(function (next) {
        if (typeof next === 'function') {
            set_value(function (prev) { return next(prev); });
            set_existValue(function (prev) { return next(prev); });
        }
        else {
            set_value(next);
            set_existValue(cloneDeep(next));
        }
    }, []);
    var syncCurrentValue = useCallback(function () {
        set_value(function (prev) {
            set_existValue(cloneDeep(prev));
            return prev;
        });
    }, []);
    var restoreValues = useCallback(function () {
        set_value(cloneDeep(initialValue));
        set_existValue(cloneDeep(initialValue));
    }, []);
    var restoreByKeyNames = useCallback(function (keyNames) {
        // set_value(produce((draft) => {
        //   keyNames.forEach((keyName) => {
        //     draft[keyName] = { ...initialValue }[keyName]
        //   })
        // }))
        set_value(function (prev) {
            var cloned = cloneDeep(prev);
            var partialInitial = keyNames.reduce(function (prev, keyName) {
                prev[keyName] = get(cloneDeep(__assign({}, initialValue)), keyName);
                return prev;
            }, {});
            return __assign(__assign({}, cloned), partialInitial);
        });
    }, []);
    var handleValues = useCallback(function (next) {
        if (typeof next === 'function') {
            set_value(function (prev) { return next(prev); });
        }
        else {
            set_value(next);
        }
    }, []);
    var pickAndUpdate = useCallback(function (target, value) {
        set_value(function (prev) { return cloneDeep(__assign({}, set(prev, target, value))); });
    }, []);
    var handleByKeyName = useCallback(function (target, value, callBack) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            set_value(function (prev) {
                var _a, _b;
                var next = __assign({}, prev);
                if (typeof value === 'function' && isFunction(value)) {
                    next = __assign(__assign({}, next), (_a = {}, _a[target] = value(prev), _a));
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
            return [2 /*return*/];
        });
    }); }, []);
    var returnToOriginal = useCallback(function () {
        set_value(cloneDeep(__assign({}, existValue)));
    }, [existValue]);
    var isMatched = useMemo(function () {
        return isEqual(existValue, value);
    }, [value, existValue]);
    return {
        value: value,
        existValue: existValue,
        isMatched: isMatched,
        syncCurrentValue: syncCurrentValue,
        pickAndUpdate: pickAndUpdate,
        bulkInit: bulkInit,
        handleValues: handleValues,
        handleByKeyName: handleByKeyName,
        returnToOriginal: returnToOriginal,
        restoreValues: restoreValues,
        restoreByKeyNames: restoreByKeyNames,
    };
};
export default useBulkState;
