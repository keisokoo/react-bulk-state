import React from 'react'
import useBulkState, { BulkStateReturnType } from '../useBulkState'
import { Meta } from '@storybook/react'
const initialState = {
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
}
type BulkProperties = BulkStateReturnType<typeof initialState>[1]
interface DemoChildProps extends BulkProperties {}

const DemoChild = ({ setByPath }: DemoChildProps) => {
  return (
    <div>
      <button onClick={() => setByPath('foo', 'gogo')}>run from child</button>
    </div>
  )
}
export const Demo = () => {
  const data = useBulkState(initialState)
  const [value, methods] = data
  const { setByPath, initValue, saveCurrentValue, restoreToSaved, isMatched } =
    methods
  React.useEffect(() => {
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
    })
  }, [])
  return (
    <div>
      <div>foo: {value.foo}</div>
      <div>qux.quux: {value.qux.quux}</div>
      <div>qux.c.d: {value.qux.c.d}</div>
      <div>isMatched: {isMatched ? 'true' : 'false'}</div>
      <div>baz: {value.baz ? 'true' : 'false'}</div>
      <div>qux.c.e: {value.qux.c.e}</div>
      <div>
        <input
          value={value.qux.quux}
          onChange={(e) => {
            setByPath('qux.quux', e.target.value)
          }}
        />
      </div>
      <div>
        <button
          onClick={() => {
            setByPath(
              'baz',
              (prev) => !prev,
              (draft) => {
                draft.qux.c.e++
                return draft
              }
            )
          }}
        >
          baz update and count++
        </button>
      </div>
      <div>
        <input
          value={value.foo}
          onChange={(e) => {
            setByPath('foo', e.target.value)
          }}
        />
      </div>
      <div>
        <input
          value={value.qux.c.d}
          onChange={(e) => {
            setByPath('qux.c.d', e.target.value)
          }}
        />
      </div>
      <div>
        <button onClick={() => initValue()}>initValue</button>
      </div>
      <div>
        <button onClick={saveCurrentValue}>saveCurrentValue</button>
      </div>
      <div>
        <button onClick={restoreToSaved}>restoreToSaved</button>
      </div>
      <DemoChild {...methods} />
    </div>
  )
}

const meta = {
  title: 'State/useBulkState',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    initialState,
  },
} satisfies Meta<typeof useBulkState>

export default meta
