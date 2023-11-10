import { __assign } from "tslib";
import React from 'react';
import useBulkState from '../useBulkState';
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
    return React.createElement("div", null, value.foo);
};
export var Demo = function () {
    var bulkState = useBulkState(initialState);
    var value = bulkState.value, isMatched = bulkState.isMatched, handleByPath = bulkState.handleByPath, handleByDraft = bulkState.handleByDraft, handleByKeyName = bulkState.handleByKeyName, initValue = bulkState.initValue, saveCurrentValue = bulkState.saveCurrentValue, restoreToSaved = bulkState.restoreToSaved;
    React.useEffect(function () {
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
    return (React.createElement("div", null,
        React.createElement("div", null,
            "foo: ",
            value.foo),
        React.createElement("div", null,
            "qux.quux: ",
            value.qux.quux),
        React.createElement("div", null,
            "qux.c.d: ",
            value.qux.c.d),
        React.createElement("div", null,
            "isMatched: ",
            isMatched ? 'true' : 'false'),
        React.createElement("div", null,
            "baz: ",
            value.baz ? 'true' : 'false'),
        React.createElement("div", null,
            "qux.c.e: ",
            value.qux.c.e),
        React.createElement("div", null,
            React.createElement("input", { value: value.qux.quux, onChange: function (e) {
                    handleByDraft(function (draft) {
                        draft.qux.quux = e.target.value;
                    });
                } })),
        React.createElement("div", null,
            React.createElement("button", { onClick: function () {
                    handleByPath('baz', function (prev) { return !prev; }, function (draft) {
                        draft.qux.c.e++;
                        return draft;
                    });
                } }, "baz update and count++")),
        React.createElement("div", null,
            React.createElement("input", { value: value.foo, onChange: function (e) {
                    handleByKeyName('foo', e.target.value);
                } })),
        React.createElement("div", null,
            React.createElement("input", { value: value.qux.c.d, onChange: function (e) {
                    handleByPath('qux.c.d', e.target.value);
                } })),
        React.createElement("div", null,
            React.createElement("button", { onClick: function () { return initValue(); } }, "initValue")),
        React.createElement("div", null,
            React.createElement("button", { onClick: saveCurrentValue }, "saveCurrentValue")),
        React.createElement("div", null,
            React.createElement("button", { onClick: restoreToSaved }, "restoreToSaved")),
        React.createElement(DemoChild, __assign({}, bulkState))));
};
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
export default meta;
