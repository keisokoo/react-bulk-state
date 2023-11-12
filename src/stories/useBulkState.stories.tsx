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
type BulkProperties = BulkStateReturnType<typeof initialState>
interface DemoChildProps extends BulkProperties {}

const DemoChild = ({ setState }: DemoChildProps) => {
  return (
    <div>
      <button onClick={() => setState('foo', 'gogo')}>run from child</button>
    </div>
  )
}
export const Demo = () => {
  const data = useBulkState(initialState)
  const {
    state: value,
    setState,
    init,
    saveCurrentValue,
    restoreToSaved,
    isMatched,
  } = data
  React.useEffect(() => {
    init({
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
      <div>
        bar: {value.bar}
        <button onClick={() => setState('bar', (prev) => prev++)}>
          increment
        </button>
      </div>
      <div>qux.quux: {value.qux.quux}</div>
      <div>qux.c.d: {value.qux.c.d}</div>
      <div>isMatched: {isMatched ? 'true' : 'false'}</div>
      <div>baz: {value.baz ? 'true' : 'false'}</div>
      <div>qux.c.e: {value.qux.c.e}</div>
      <div>
        <input
          value={value.qux.quux}
          onChange={(e) => {
            setState('qux.quux', e.target.value)
          }}
        />
      </div>
      <div>
        <button
          onClick={() => {
            setState('qux.c.e', (prev) => prev + 1)
          }}
        >
          qux.c.e count++
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            setState(
              'baz',
              (prev) => !prev,
              (draft) => {
                draft.qux.c.e++
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
            setState('foo', e.target.value)
          }}
        />
      </div>
      <div>
        <input
          value={value.qux.c.d}
          onChange={(e) => {
            setState('qux.c.d', e.target.value)
          }}
        />
      </div>
      <div>
        <button onClick={() => init()}>init</button>
      </div>
      <div>
        <button onClick={saveCurrentValue}>saveCurrentValue</button>
      </div>
      <div>
        <button onClick={restoreToSaved}>restoreToSaved</button>
      </div>
      <DemoChild {...data} />
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
