import React, { useEffect, useState } from 'react';
import useBulkStep from '../useBulkStep';
var initialValues = {
    hello: 'world',
    a: 1,
    b: {
        c: '',
        d: 1,
    },
    e: '',
    f: '',
    g: false,
};
export var StepperSample = function () {
    var _a;
    var _b = useBulkStep(initialValues, {
        stepOne: ['hello', 'a'],
        stepTwo: ['b', 'e'],
        stepThree: ['f', 'g'],
    }, {
        restoreWhenPrev: true,
        customValidations: {
            stepOne: {
                hello: function (value) {
                    return value === 'world';
                },
            },
            stepTwo: {
                b: function (value) {
                    return !!value.c && value.d > 0;
                },
                e: function (value) {
                    return value === '2';
                },
            },
        },
        optionalValue: ['f'],
    }), currentStep = _b.currentStep, bulkValue = _b.bulkValue, stepValue = _b.stepValue, validSteps = _b.validSteps, validAllSteps = _b.validAllSteps, prevStep = _b.prevStep, nextStep = _b.nextStep;
    useEffect(function () {
        console.log('currentStep', currentStep);
    }, [stepValue]);
    var _c = useState(''), result = _c[0], set_result = _c[1];
    return (React.createElement(React.Fragment, null,
        React.createElement("div", null,
            React.createElement("div", null, currentStep),
            React.createElement("div", null,
                currentStep === 'stepOne' && (React.createElement("div", null,
                    React.createElement("input", { value: bulkValue.value.hello, placeholder: "must be world", onChange: function (e) {
                            bulkValue.handleByKeyName('hello', e.target.value);
                        } }),
                    React.createElement("input", { type: "number", value: (_a = bulkValue.value.a) !== null && _a !== void 0 ? _a : '', placeholder: "must be not empty", onChange: function (e) {
                            bulkValue.handleByKeyName('a', e.target.value ? Number(e.target.value) : null);
                        } }),
                    React.createElement("div", null, stepValue[currentStep].hello))),
                currentStep === 'stepTwo' && (React.createElement("div", null,
                    React.createElement("div", null, stepValue[currentStep].b.c),
                    React.createElement("input", { value: bulkValue.value.b.c, placeholder: "must be not empty", onChange: function (e) {
                            bulkValue.handleByPath('b.c', e.target.value);
                        } }),
                    React.createElement("input", { value: bulkValue.value.e, placeholder: "must be 2", onChange: function (e) {
                            bulkValue.handleByPath('e', e.target.value);
                        } }))),
                currentStep === 'stepThree' && (React.createElement("div", null,
                    React.createElement("div", null, stepValue[currentStep].f),
                    React.createElement("input", { value: bulkValue.value.f, placeholder: "must be not empty", onChange: function (e) {
                            bulkValue.handleByKeyName('f', e.target.value);
                        } }),
                    React.createElement("button", { onClick: function () {
                            bulkValue.handleByKeyName('g', !bulkValue.value.g);
                        } }, bulkValue.value.g ? 'true' : 'false')))),
            React.createElement("div", null,
                React.createElement("button", { disabled: currentStep === 'stepOne', onClick: prevStep }, "prev"),
                React.createElement("button", { disabled: !validSteps[currentStep] || currentStep === 'stepThree', onClick: nextStep }, "next")),
            React.createElement("div", null,
                React.createElement("button", { disabled: !validAllSteps, onClick: function () {
                        set_result(JSON.stringify(bulkValue.value));
                    } }, "handleSubmit")),
            React.createElement("div", { id: "result" }, result))));
};
var meta = {
    title: 'State/useBulkStep',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {},
};
export default meta;
