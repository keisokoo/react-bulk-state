import { act, renderHook } from '@testing-library/react'
import useBulkState from "../src/useBulkState"

describe('useBulkState', () => {
  it('should be defined', () => {
    expect(useBulkState).toBeDefined()
  })
  function getHook(initialStates: any = { a: 1, b: 2, c: '3', d: { e: 4 } }) {
    return renderHook(({ initialStates }) => useBulkState(initialStates), { initialProps: { initialStates } })
  }
  it('should return a bulk state array', () => {
    const result = getHook().result.current
    expect(result).toStrictEqual(
      [
        { a: 1, b: 2, c: '3', d: { e: 4 } },
        {
          savedState: expect.any(Object),
          isMatched: expect.any(Boolean),
          saveCurrentValue: expect.any(Function),
          init: expect.any(Function),
          setState: expect.any(Function),
          setByPath: expect.any(Function),
          setByImmer: expect.any(Function),
          restoreToInit: expect.any(Function),
          restoreToSaved: expect.any(Function),
          restoreByKeyNames: expect.any(Function),
        }
      ]
    )
  });

  it('should be return a is 1', () => {
    expect(getHook().result.current[0].a).toBe(1)
  });

  describe('setState()', () => {
    it(`should be return state is { a: 3, b: 2, c: '1' }`, () => {
      const hook = getHook();
      expect(hook.result.current[0]).toStrictEqual({ a: 1, b: 2, c: '3', d: { e: 4 } });
      act(() =>
        hook.result.current[1].setState({ a: 3, b: 2, c: '1', d: { e: 5 } })
      );
      expect(hook.result.current[0]).toStrictEqual({ a: 3, b: 2, c: '1', d: { e: 5 } });
    })
  })
  describe('setByPath()', () => {
    it('should be return a is 2', () => {
      const hook = getHook();
      expect(hook.result.current[0].a).toBe(1);

      act(() =>
        hook.result.current[1].setByPath('a', 2)
      );
      expect(hook.result.current[0].a).toBe(2);

      act(() =>
        hook.result.current[1].setByPath('d.e', 6)
      );
      expect(hook.result.current[0].d.e).toBe(6);
    })
  })
})