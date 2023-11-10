import { useCallback, useMemo, useState } from 'react';
import useBulkState from './useBulkState';
export var objectKeys = function (value) {
    return Object.keys(value);
};
export function getStepsValue(initialValue, values) {
    return Object.keys(values).reduce(function (prev, curr) {
        prev[curr] = values[curr].reduce(function (prevInner, currInner) {
            prevInner[currInner] =
                initialValue[currInner];
            return prevInner;
        }, {});
        return prev;
    }, {});
}
var useBulkStep = function (initialValue, values, configs) {
    var bulkValue = useBulkState(initialValue);
    var _a = useState(), stepper = _a[0], set_stepper = _a[1];
    var stepValue = useMemo(function () {
        return getStepsValue(bulkValue.value, values);
    }, [bulkValue.value]);
    var allSteps = useMemo(function () {
        return objectKeys(stepValue);
    }, [stepValue]);
    var currentStep = useMemo(function () {
        var currentStepper = stepper ? stepper : objectKeys(stepValue)[0];
        return currentStepper;
    }, [stepper, stepValue]);
    var checkValidStep = useCallback(function (step, customValidations, optional) {
        var isValid = true;
        var stepValues = stepValue[step];
        var stepValuesKeyNames = objectKeys(stepValues);
        var stepValuesValid = stepValuesKeyNames.every(function (keyName) {
            if (optional && optional.includes(keyName))
                return true;
            var value = stepValues[keyName];
            if (customValidations && customValidations[keyName]) {
                return customValidations[keyName](value);
            }
            var checkValid = Array.isArray(value)
                ? value.length > 0
                : typeof value === 'boolean' || typeof value === 'string'
                    ? !!value
                    : value !== undefined && value !== null;
            return checkValid;
        });
        if (!stepValuesValid) {
            isValid = false;
        }
        return isValid;
    }, [stepValue]);
    // checkValidStep을 이용하여, 각 스테퍼 별로 유효성 검사를 수행하고, 각 각 스테퍼별로 유효성 검사를 수행한 결과를 반환한다.
    var validSteps = useMemo(function () {
        var stepsValid = {};
        allSteps.forEach(function (step) {
            var _a;
            stepsValid[step] = checkValidStep(step, (_a = configs === null || configs === void 0 ? void 0 : configs.customValidations) === null || _a === void 0 ? void 0 : _a[step], configs === null || configs === void 0 ? void 0 : configs.optionalValue);
        });
        return stepsValid;
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSteps, checkValidStep]);
    var validAllSteps = useMemo(function () {
        var isValid = true;
        var allStepsValid = allSteps.every(function (step) {
            var _a;
            return checkValidStep(step, (_a = configs === null || configs === void 0 ? void 0 : configs.customValidations) === null || _a === void 0 ? void 0 : _a[step], configs === null || configs === void 0 ? void 0 : configs.optionalValue);
        });
        if (!allStepsValid) {
            isValid = false;
        }
        return isValid;
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSteps, checkValidStep]);
    var callRestoreByKeyNames = useCallback(function (restoreSteps) {
        var restoreValuesKeyNames = restoreSteps
            .map(function (step) {
            return objectKeys(stepValue[step]);
        })
            .flat();
        bulkValue.restoreByKeyNames(restoreValuesKeyNames);
    }, [bulkValue, stepValue]);
    var nextStep = useCallback(function () {
        var currentStepper = stepper ? stepper : objectKeys(stepValue)[0];
        var currentIndex = allSteps.indexOf(currentStepper);
        if (currentIndex < allSteps.length - 1) {
            set_stepper(allSteps[currentIndex + 1]);
        }
    }, [allSteps, stepper, stepValue]);
    var prevStep = useCallback(function () {
        var currentStepper = stepper ? stepper : objectKeys(stepValue)[0];
        var currentIndex = allSteps.indexOf(currentStepper);
        if (currentIndex > 0) {
            if (configs === null || configs === void 0 ? void 0 : configs.restoreWhenPrev) {
                var restoreSteps = allSteps.slice(currentIndex);
                callRestoreByKeyNames(restoreSteps);
            }
            set_stepper(allSteps[currentIndex - 1]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepper, stepValue, allSteps, callRestoreByKeyNames]);
    var setCurrentStep = useCallback(function (step, restore) {
        if (restore) {
            var currentIndex = allSteps.indexOf(step) + restore === 'after' ? 1 : 0;
            if (currentIndex > 0) {
                var restoreSteps = allSteps.slice(currentIndex);
                callRestoreByKeyNames(restore === 'current-only' ? [step] : restoreSteps);
            }
        }
        set_stepper(step);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSteps, callRestoreByKeyNames]);
    return {
        currentStep: currentStep,
        setCurrentStep: setCurrentStep,
        allSteps: allSteps,
        stepValue: stepValue,
        bulkValue: bulkValue,
        checkValidStep: checkValidStep,
        validSteps: validSteps,
        validAllSteps: validAllSteps,
        prevStep: prevStep,
        nextStep: nextStep,
    };
};
export default useBulkStep;
