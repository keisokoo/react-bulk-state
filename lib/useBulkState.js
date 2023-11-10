"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_es_1 = require("lodash-es");
var react_1 = require("react");
function isFunction(x) {
    return x !== undefined && typeof x === 'function' && x instanceof Function;
}
var useBulkState = function (initialValue) {
    var _a = (0, react_1.useState)((0, lodash_es_1.cloneDeep)(tslib_1.__assign({}, initialValue))), value = _a[0], set_value = _a[1];
    var _b = (0, react_1.useState)((0, lodash_es_1.cloneDeep)(tslib_1.__assign({}, initialValue))), existValue = _b[0], set_existValue = _b[1];
    var bulkInit = (0, react_1.useCallback)(function (next) {
        if (typeof next === 'function') {
            set_value(function (prev) { return next(prev); });
            set_existValue(function (prev) { return next(prev); });
        }
        else {
            set_value(next);
            set_existValue((0, lodash_es_1.cloneDeep)(next));
        }
    }, []);
    var syncCurrentValue = (0, react_1.useCallback)(function () {
        set_value(function (prev) {
            set_existValue((0, lodash_es_1.cloneDeep)(prev));
            return prev;
        });
    }, []);
    var restoreValues = (0, react_1.useCallback)(function () {
        set_value((0, lodash_es_1.cloneDeep)(initialValue));
        set_existValue((0, lodash_es_1.cloneDeep)(initialValue));
    }, []);
    var restoreByKeyNames = (0, react_1.useCallback)(function (keyNames) {
        // set_value(produce((draft) => {
        //   keyNames.forEach((keyName) => {
        //     draft[keyName] = { ...initialValue }[keyName]
        //   })
        // }))
        set_value(function (prev) {
            var cloned = (0, lodash_es_1.cloneDeep)(prev);
            var partialInitial = keyNames.reduce(function (prev, keyName) {
                prev[keyName] = (0, lodash_es_1.get)((0, lodash_es_1.cloneDeep)(tslib_1.__assign({}, initialValue)), keyName);
                return prev;
            }, {});
            return tslib_1.__assign(tslib_1.__assign({}, cloned), partialInitial);
        });
    }, []);
    var handleValues = (0, react_1.useCallback)(function (next) {
        if (typeof next === 'function') {
            set_value(function (prev) { return next(prev); });
        }
        else {
            set_value(next);
        }
    }, []);
    var pickAndUpdate = (0, react_1.useCallback)(function (target, value) {
        set_value(function (prev) { return (0, lodash_es_1.cloneDeep)(tslib_1.__assign({}, (0, lodash_es_1.set)(prev, target, value))); });
    }, []);
    var handleByKeyName = (0, react_1.useCallback)(function (target, value, callBack) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            set_value(function (prev) {
                var _a, _b;
                var next = tslib_1.__assign({}, prev);
                if (typeof value === 'function' && isFunction(value)) {
                    next = tslib_1.__assign(tslib_1.__assign({}, next), (_a = {}, _a[target] = value(prev), _a));
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
            return [2 /*return*/];
        });
    }); }, []);
    var returnToOriginal = (0, react_1.useCallback)(function () {
        set_value((0, lodash_es_1.cloneDeep)(tslib_1.__assign({}, existValue)));
    }, [existValue]);
    var isMatched = (0, react_1.useMemo)(function () {
        return (0, lodash_es_1.isEqual)(existValue, value);
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
exports.default = useBulkState;
