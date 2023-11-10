"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var immer_1 = require("immer");
var lodash_es_1 = require("lodash-es");
var fast_deep_equal_1 = tslib_1.__importDefault(require("fast-deep-equal"));
var react_1 = require("react");
function propsToPreviousCallback(x) {
    return x !== undefined && typeof x === 'function' && x instanceof Function && x.arguments.length === 2;
}
var useBulkState = function (initialValue) {
    var initialValueRef = (0, react_1.useRef)(initialValue);
    var _a = (0, react_1.useState)(initialValueRef.current), value = _a[0], set_value = _a[1];
    var _b = (0, react_1.useState)(initialValueRef.current), savedValue = _b[0], set_savedValue = _b[1];
    var _c = (0, react_1.useState)(true), isMatched = _c[0], setIsMatched = _c[1];
    (0, react_1.useEffect)(function () {
        var debouncedCheck = (0, lodash_es_1.debounce)(function () {
            setIsMatched((0, fast_deep_equal_1.default)(value, savedValue));
        }, 300);
        debouncedCheck();
        return function () { return debouncedCheck.cancel(); };
    }, [value, savedValue]);
    var initValue = (0, react_1.useCallback)(function (next) {
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
    var saveCurrentValue = (0, react_1.useCallback)(function () {
        set_value(function (currentValue) {
            var nextState = (0, immer_1.produce)(currentValue, function () { });
            set_savedValue(nextState);
            return nextState;
        });
    }, []);
    var restoreToSaved = (0, react_1.useCallback)(function () {
        set_value(savedValue);
    }, [savedValue]);
    var restoreToInit = (0, react_1.useCallback)(function () {
        set_value((0, immer_1.produce)(initialValueRef.current, function () { }));
    }, []);
    var restoreByKeyNames = (0, react_1.useCallback)(function (keyNames) {
        set_value(function (currentValue) { return (0, immer_1.produce)(currentValue, function (draft) {
            keyNames.forEach(function (keyName) {
                draft[keyName] = initialValueRef.current[keyName];
            });
        }); });
    }, []);
    var handleValues = (0, react_1.useCallback)(function (next) {
        if (typeof next === 'function') {
            set_value(function (prev) { return next(prev); });
        }
        else {
            set_value(next);
        }
    }, []);
    var handleByPath = (0, react_1.useCallback)(function (target, value, callBack) {
        set_value(function (prev) { return (0, immer_1.produce)(prev, function (draft) {
            var cloned = tslib_1.__assign({}, draft);
            if (typeof value === 'function' && propsToPreviousCallback(value)) {
                cloned = (0, lodash_es_1.set)(draft, target, value((0, lodash_es_1.get)(draft, target), prev));
            }
            else {
                cloned = (0, lodash_es_1.set)(draft, target, value);
            }
            if (callBack) {
                callBack(cloned);
            }
            draft = cloned;
        }); });
    }, []);
    var handleByDraft = (0, react_1.useCallback)(function (callback) {
        set_value(function (prev) { return (0, immer_1.produce)(prev, function (draft) {
            callback(draft);
        }); });
    }, []);
    var handleByKeyName = (0, react_1.useCallback)(function (target, value, callBack) {
        set_value(function (prev) {
            var _a, _b;
            var next = tslib_1.__assign({}, prev);
            if (typeof value === 'function' && propsToPreviousCallback(value)) {
                next = tslib_1.__assign(tslib_1.__assign({}, next), (_a = {}, _a[target] = value(prev[target], prev), _a));
            }
            else {
                next = tslib_1.__assign(tslib_1.__assign({}, next), (_b = {}, _b[target] = value, _b));
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
        handleByPath: handleByPath,
        initValue: initValue,
        handleValues: handleValues,
        handleByDraft: handleByDraft,
        handleByKeyName: handleByKeyName,
        restoreToInit: restoreToInit,
        restoreToSaved: restoreToSaved,
        restoreByKeyNames: restoreByKeyNames,
    };
};
exports.default = useBulkState;
