"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Demo = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var useBulkState_1 = tslib_1.__importDefault(require("../useBulkState"));
var initialState = {
    foo: 'foo',
    bar: 0,
    baz: false,
    qux: {
        quux: '1',
        a: 0,
        b: false,
        c: {
            d: 'd',
            e: 0,
            f: false,
        },
    },
};
var DemoChild = function (props) {
    var value = props.value;
    return react_1.default.createElement("div", null, value.foo);
};
var Demo = function () {
    var bulkState = (0, useBulkState_1.default)(initialState);
    var value = bulkState.value, isMatched = bulkState.isMatched, handleByPath = bulkState.handleByPath, handleByDraft = bulkState.handleByDraft, handleByKeyName = bulkState.handleByKeyName, initValue = bulkState.initValue, saveCurrentValue = bulkState.saveCurrentValue, restoreToSaved = bulkState.restoreToSaved;
    react_1.default.useEffect(function () {
        initValue({
            foo: 'bar',
            bar: 0,
            baz: false,
            qux: {
                quux: '2',
                a: 0,
                b: false,
                c: {
                    d: 'zzz',
                    e: 0,
                    f: false,
                },
            },
        });
    }, []);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", null,
            "foo: ",
            value.foo),
        react_1.default.createElement("div", null,
            "qux.quux: ",
            value.qux.quux),
        react_1.default.createElement("div", null,
            "qux.c.d: ",
            value.qux.c.d),
        react_1.default.createElement("div", null,
            "isMatched: ",
            isMatched ? 'true' : 'false'),
        react_1.default.createElement("div", null,
            "baz: ",
            value.baz ? 'true' : 'false'),
        react_1.default.createElement("div", null,
            "qux.c.e: ",
            value.qux.c.e),
        react_1.default.createElement("div", null,
            react_1.default.createElement("input", { value: value.qux.quux, onChange: function (e) {
                    handleByDraft(function (draft) {
                        draft.qux.quux = e.target.value;
                    });
                } })),
        react_1.default.createElement("div", null,
            react_1.default.createElement("button", { onClick: function () {
                    handleByPath('baz', function (prev) { return !prev; }, function (draft) {
                        draft.qux.c.e++;
                        return draft;
                    });
                } }, "baz update and count++")),
        react_1.default.createElement("div", null,
            react_1.default.createElement("input", { value: value.foo, onChange: function (e) {
                    handleByKeyName('foo', e.target.value);
                } })),
        react_1.default.createElement("div", null,
            react_1.default.createElement("input", { value: value.qux.c.d, onChange: function (e) {
                    handleByPath('qux.c.d', e.target.value);
                } })),
        react_1.default.createElement("div", null,
            react_1.default.createElement("button", { onClick: function () { return initValue(); } }, "initValue")),
        react_1.default.createElement("div", null,
            react_1.default.createElement("button", { onClick: saveCurrentValue }, "saveCurrentValue")),
        react_1.default.createElement("div", null,
            react_1.default.createElement("button", { onClick: restoreToSaved }, "restoreToSaved")),
        react_1.default.createElement(DemoChild, tslib_1.__assign({}, bulkState))));
};
exports.Demo = Demo;
var meta = {
    title: 'State/useBulkState',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        initialState: initialState,
    },
};
exports.default = meta;
