"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var immer_1 = require("immer");
var lodash_es_1 = require("lodash-es");
var fast_deep_equal_1 = tslib_1.__importDefault(require("fast-deep-equal"));
var react_1 = require("react");
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
    var initialValueRef = (0, react_1.useRef)(initialValue);
    var _a = (0, react_1.useState)(initialValueRef.current), bulkState = _a[0], set_bulkState = _a[1];
    var _b = (0, react_1.useState)(initialValueRef.current), savedValue = _b[0], set_savedValue = _b[1];
    var _c = (0, react_1.useState)(true), isMatched = _c[0], setIsMatched = _c[1];
    (0, react_1.useEffect)(function () {
        var debouncedCheck = (0, lodash_es_1.debounce)(function () {
            setIsMatched((0, fast_deep_equal_1.default)(bulkState, savedValue));
        }, 300);
        debouncedCheck();
        return function () { return debouncedCheck.cancel(); };
    }, [bulkState, savedValue]);
    var initValue = (0, react_1.useCallback)(function (next) {
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
    var saveCurrentValue = (0, react_1.useCallback)(function () {
        set_bulkState(function (currentValue) {
            var savingValue = (0, immer_1.produce)(currentValue, function () { });
            set_savedValue(savingValue);
            return currentValue;
        });
    }, []);
    var restoreToSaved = (0, react_1.useCallback)(function () {
        set_bulkState(savedValue);
    }, [savedValue]);
    var restoreToInit = (0, react_1.useCallback)(function () {
        set_bulkState((0, immer_1.produce)(initialValueRef.current, function () { }));
    }, []);
    var restoreByKeyNames = (0, react_1.useCallback)(function (keyNames) {
        set_bulkState(function (currentValue) { return (0, immer_1.produce)(currentValue, function (draft) {
            keyNames.forEach(function (keyName) {
                draft[keyName] = initialValueRef.current[keyName];
            });
        }); });
    }, []);
    var setBulkState = (0, react_1.useCallback)(function (next) {
        if (typeof next === 'function') {
            set_bulkState(function (prev) { return next(prev); });
        }
        else {
            set_bulkState(next);
        }
    }, []);
    var setByPath = (0, react_1.useCallback)(function (target, data, recipe) {
        set_bulkState(function (prev) {
            var changedValue = (0, immer_1.produce)(prev, function (draft) {
                if (typeof data === 'function' && propsToPreviousCallback(data)) {
                    (0, lodash_es_1.set)(draft, target, data((0, lodash_es_1.get)(draft, target), prev));
                }
                else {
                    (0, lodash_es_1.set)(draft, target, data);
                }
            });
            if (recipe) {
                changedValue = (0, immer_1.produce)(changedValue, recipe);
            }
            return changedValue;
        });
    }, []);
    var setByImmer = (0, react_1.useCallback)(function (recipe) {
        set_bulkState(function (prev) { return (0, immer_1.produce)(prev, recipe); });
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
exports.default = useBulkState;
