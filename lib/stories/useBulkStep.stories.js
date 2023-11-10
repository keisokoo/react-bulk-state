"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepperSample = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var useBulkStep_1 = tslib_1.__importDefault(require("../useBulkStep"));
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
var StepperSample = function () {
    var _a;
    var _b = (0, useBulkStep_1.default)(initialValues, {
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
    (0, react_1.useEffect)(function () {
        console.log('currentStep', currentStep);
    }, [stepValue]);
    var _c = (0, react_1.useState)(''), result = _c[0], set_result = _c[1];
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", null,
            react_1.default.createElement("div", null, currentStep),
            react_1.default.createElement("div", null,
                currentStep === 'stepOne' && (react_1.default.createElement("div", null,
                    react_1.default.createElement("input", { value: bulkValue.value.hello, placeholder: "must be world", onChange: function (e) {
                            bulkValue.handleByKeyName('hello', e.target.value);
                        } }),
                    react_1.default.createElement("input", { type: "number", value: (_a = bulkValue.value.a) !== null && _a !== void 0 ? _a : '', placeholder: "must be not empty", onChange: function (e) {
                            bulkValue.handleByKeyName('a', e.target.value ? Number(e.target.value) : null);
                        } }),
                    react_1.default.createElement("div", null, stepValue[currentStep].hello))),
                currentStep === 'stepTwo' && (react_1.default.createElement("div", null,
                    react_1.default.createElement("div", null, stepValue[currentStep].b.c),
                    react_1.default.createElement("input", { value: bulkValue.value.b.c, placeholder: "must be not empty", onChange: function (e) {
                            bulkValue.handleByPath('b.c', e.target.value);
                        } }),
                    react_1.default.createElement("input", { value: bulkValue.value.e, placeholder: "must be 2", onChange: function (e) {
                            bulkValue.handleByPath('e', e.target.value);
                        } }))),
                currentStep === 'stepThree' && (react_1.default.createElement("div", null,
                    react_1.default.createElement("div", null, stepValue[currentStep].f),
                    react_1.default.createElement("input", { value: bulkValue.value.f, placeholder: "must be not empty", onChange: function (e) {
                            bulkValue.handleByKeyName('f', e.target.value);
                        } }),
                    react_1.default.createElement("button", { onClick: function () {
                            bulkValue.handleByKeyName('g', !bulkValue.value.g);
                        } }, bulkValue.value.g ? 'true' : 'false')))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("button", { disabled: currentStep === 'stepOne', onClick: prevStep }, "prev"),
                react_1.default.createElement("button", { disabled: !validSteps[currentStep] || currentStep === 'stepThree', onClick: nextStep }, "next")),
            react_1.default.createElement("div", null,
                react_1.default.createElement("button", { disabled: !validAllSteps, onClick: function () {
                        set_result(JSON.stringify(bulkValue.value));
                    } }, "handleSubmit")),
            react_1.default.createElement("div", { id: "result" }, result))));
};
exports.StepperSample = StepperSample;
var meta = {
    title: 'State/useBulkStep',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {},
};
exports.default = meta;
