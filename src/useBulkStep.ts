import { useCallback, useMemo, useState } from 'react'
import useBulkState from './useBulkState'

export const objectKeys = <T extends object, K extends keyof T>(
  value: T
): K[] => {
  return Object.keys(value) as K[]
}

type KeysMapping<T, K extends { [key: string]: (keyof T)[] }> = {
  [P in keyof K]: Pick<T, K[P][number]>
}
type RestoreTypes = 'after' | 'from-current' | 'current-only'

type CustomValidations<
  T,
  J extends { [key: string]: (keyof T)[] },
  K extends keyof J,
> = {
    [P in J[K][number]]?: (currentValue: T[P]) => boolean
  }
export function getStepsValue<T, J extends { [key: string]: (keyof T)[] }>(
  initialValue: T,
  values: J
): KeysMapping<T, J> {
  return Object.keys(values).reduce(
    (prev, curr) => {
      prev[curr as keyof typeof prev] = values[
        curr as keyof typeof prev
      ].reduce(
        (prevInner, currInner) => {
          prevInner[currInner as keyof typeof prevInner] =
            initialValue[currInner as keyof typeof prevInner]
          return prevInner
        },
        {} as Pick<T, keyof T>
      )
      return prev
    },
    {} as KeysMapping<T, J>
  )
}
export type StepperOptions<
  T extends object,
  J extends { [key: string]: (keyof T)[] },
// K extends keyof J
> = {
  restoreWhenPrev?: boolean
  customValidations?: {
    [P in keyof J]?: CustomValidations<T, J, P>
  }
  optionalValue?: (keyof T)[]
}
const useBulkStep = <
  T extends object,
  J extends { [key: string]: (keyof T)[] },
  K extends keyof J,
>(
  initialValue: T,
  values: J,
  configs?: StepperOptions<T, J>
) => {
  const bulkValue = useBulkState(initialValue)
  const [stepper, set_stepper] = useState<K | null>()

  const stepValue = useMemo(() => {
    return getStepsValue(bulkValue.value, values)
  }, [bulkValue.value])

  const allSteps = useMemo(() => {
    return objectKeys(stepValue) as K[]
  }, [stepValue])

  const currentStep = useMemo(() => {
    let currentStepper = stepper ? stepper : (objectKeys(stepValue)[0] as K)
    return currentStepper
  }, [stepper, stepValue])

  const checkValidStep = useCallback<
    (
      step: K,
      customValidations?: CustomValidations<T, J, K> | null,
      optional?: (keyof T)[]
    ) => boolean
  >(
    (step, customValidations, optional) => {
      let isValid = true
      let stepValues = stepValue[step]
      let stepValuesKeyNames = objectKeys(stepValues)
      let stepValuesValid = stepValuesKeyNames.every((keyName) => {
        if (optional && optional.includes(keyName)) return true
        let value = stepValues[keyName]
        if (customValidations && customValidations[keyName]) {
          return customValidations[keyName]!(value)
        }
        const checkValid = Array.isArray(value)
          ? (value as Array<unknown>).length > 0
          : typeof value === 'boolean' || typeof value === 'string'
            ? !!value
            : value !== undefined && value !== null
        return checkValid
      })
      if (!stepValuesValid) {
        isValid = false
      }
      return isValid
    },
    [stepValue]
  )

  // checkValidStep을 이용하여, 각 스테퍼 별로 유효성 검사를 수행하고, 각 각 스테퍼별로 유효성 검사를 수행한 결과를 반환한다.
  const validSteps = useMemo(
    () => {
      let stepsValid: { [P in keyof J]?: boolean } = {}
      allSteps.forEach((step) => {
        stepsValid[step] = checkValidStep(
          step,
          configs?.customValidations?.[step],
          configs?.optionalValue
        )
      })
      return stepsValid
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSteps, checkValidStep]
  )

  const validAllSteps = useMemo(
    () => {
      let isValid = true
      let allStepsValid = allSteps.every((step) => {
        return checkValidStep(
          step,
          configs?.customValidations?.[step],
          configs?.optionalValue
        )
      })
      if (!allStepsValid) {
        isValid = false
      }
      return isValid
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSteps, checkValidStep]
  )

  const callRestoreByKeyNames = useCallback(
    (restoreSteps: K[]) => {
      let restoreValuesKeyNames = restoreSteps
        .map((step) => {
          return objectKeys(stepValue[step])
        })
        .flat()
      bulkValue.restoreByKeyNames(restoreValuesKeyNames)
    },
    [bulkValue, stepValue]
  )

  const nextStep = useCallback(() => {
    let currentStepper = stepper ? stepper : (objectKeys(stepValue)[0] as K)
    let currentIndex = allSteps.indexOf(currentStepper)
    if (currentIndex < allSteps.length - 1) {
      set_stepper(allSteps[currentIndex + 1])
    }
  }, [allSteps, stepper, stepValue])

  const prevStep = useCallback(() => {
    let currentStepper = stepper ? stepper : (objectKeys(stepValue)[0] as K)
    let currentIndex = allSteps.indexOf(currentStepper)
    if (currentIndex > 0) {
      if (configs?.restoreWhenPrev) {
        let restoreSteps = allSteps.slice(currentIndex)
        callRestoreByKeyNames(restoreSteps)
      }
      set_stepper(allSteps[currentIndex - 1])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepper, stepValue, allSteps, callRestoreByKeyNames])

  const setCurrentStep = useCallback(
    (step: K, restore?: RestoreTypes) => {
      if (restore) {
        let currentIndex = allSteps.indexOf(step) + restore === 'after' ? 1 : 0
        if (currentIndex > 0) {
          let restoreSteps = allSteps.slice(currentIndex)
          callRestoreByKeyNames(
            restore === 'current-only' ? [step] : restoreSteps
          )
        }
      }
      set_stepper(step)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSteps, callRestoreByKeyNames]
  )

  return {
    currentStep,
    setCurrentStep,
    allSteps,
    stepValue,
    bulkValue,
    checkValidStep,
    validSteps,
    validAllSteps,
    prevStep,
    nextStep,
  }
}
export default useBulkStep