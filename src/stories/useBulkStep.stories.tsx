import React, { useEffect, useState } from 'react'
import useBulkState from '../useBulkState'
import { Meta } from '@storybook/react'
import useBulkStep from '../useBulkStep'

const initialValues = {
  hello: 'world',
  a: 1 as null | number,
  b: {
    c: '',
    d: 1,
  },
  e: '',
  f: '',
  g: false,
}

export const StepperSample = () => {
  const {
    currentStep,
    bulkValue,
    stepValue,
    validSteps,
    validAllSteps,
    prevStep,
    nextStep,
  } = useBulkStep(
    initialValues,
    {
      stepOne: ['hello', 'a'],
      stepTwo: ['b', 'e'],
      stepThree: ['f', 'g'],
    },
    {
      restoreWhenPrev: true,
      customValidations: {
        stepOne: {
          hello: (value) => {
            return value === 'world'
          },
        },
        stepTwo: {
          b: (value) => {
            return !!value.c && value.d > 0
          },
          e: (value) => {
            return value === '2'
          },
        },
      },
      optionalValue: ['f'],
    }
  )
  useEffect(() => {
    console.log('currentStep', currentStep)
  }, [stepValue])
  const [result, set_result] = useState<string>('')
  return (
    <>
      <div>
        <div>{currentStep}</div>
        <div>
          {currentStep === 'stepOne' && (
            <div>
              <input
                value={bulkValue.value.hello}
                placeholder="must be world"
                onChange={(e) => {
                  bulkValue.handleByKeyName('hello', e.target.value)
                }}
              />
              <input
                type="number"
                value={bulkValue.value.a ?? ''}
                placeholder="must be not empty"
                onChange={(e) => {
                  bulkValue.handleByKeyName(
                    'a',
                    e.target.value ? Number(e.target.value) : null
                  )
                }}
              />
              <div>{stepValue[currentStep].hello}</div>
            </div>
          )}
          {currentStep === 'stepTwo' && (
            <div>
              <div>{stepValue[currentStep].b.c}</div>
              <input
                value={bulkValue.value.b.c}
                placeholder="must be not empty"
                onChange={(e) => {
                  bulkValue.handleByPath('b.c', e.target.value)
                }}
              />
              <input
                value={bulkValue.value.e}
                placeholder="must be 2"
                onChange={(e) => {
                  bulkValue.handleByPath('e', e.target.value)
                }}
              />
            </div>
          )}
          {currentStep === 'stepThree' && (
            <div>
              <div>{stepValue[currentStep].f}</div>
              <input
                value={bulkValue.value.f}
                placeholder="must be not empty"
                onChange={(e) => {
                  bulkValue.handleByKeyName('f', e.target.value)
                }}
              />
              <button
                onClick={() => {
                  bulkValue.handleByKeyName('g', !bulkValue.value.g)
                }}
              >
                {bulkValue.value.g ? 'true' : 'false'}
              </button>
            </div>
          )}
        </div>
        <div>
          <button disabled={currentStep === 'stepOne'} onClick={prevStep}>
            prev
          </button>
          <button
            disabled={!validSteps[currentStep] || currentStep === 'stepThree'}
            onClick={nextStep}
          >
            next
          </button>
        </div>
        <div>
          <button
            disabled={!validAllSteps}
            onClick={() => {
              set_result(JSON.stringify(bulkValue.value))
            }}
          >
            handleSubmit
          </button>
        </div>
        <div id="result">{result}</div>
      </div>
    </>
  )
}

const meta = {
  title: 'State/useBulkStep',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof useBulkState>

export default meta
