import { act, renderHook } from '@testing-library/react'
import useBulkState from "../src/useBulkState"
jest.useFakeTimers();
const initialState = { a: 1, b: 2, c: '3', d: { e: 4 } }
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
      {
        state: { a: 1, b: 2, c: '3', d: { e: 4 } },
        setState: expect.any(Function),
        savedState: { a: 1, b: 2, c: '3', d: { e: 4 } },
        isMatched: true,
        saveCurrentValue: expect.any(Function),
        init: expect.any(Function),
        setBulkState: expect.any(Function),
        setByImmer: expect.any(Function),
        restoreToInit: expect.any(Function),
        restoreToSaved: expect.any(Function),
        restoreByKeyNames: expect.any(Function),
      }
    )
  });

  it('should be return a is 1', () => {
    expect(getHook().result.current.state.a).toBe(1)
    expect(getHook().result.current.savedState.a).toBe(1)
  });

  describe('setBulkState()', () => {
    it(`should be return state is { a: 3, b: 2, c: '1' }`, () => {
      const hook = getHook();
      expect(hook.result.current.state).toStrictEqual({ a: 1, b: 2, c: '3', d: { e: 4 } });
      act(() =>
        hook.result.current.setBulkState({ a: 3, b: 2, c: '1', d: { e: 5 } })
      );
      expect(hook.result.current.state).toStrictEqual({ a: 3, b: 2, c: '1', d: { e: 5 } });
      act(() =>
        hook.result.current.setBulkState((prev) => ({ ...prev, a: 4 }))
      );
      expect(hook.result.current.state).toStrictEqual({ a: 4, b: 2, c: '1', d: { e: 5 } });
    })
  })
  describe('setState()', () => {
    it('should be return a is 2, d.e is 6, c is hello', () => {
      const hook = getHook();
      expect(hook.result.current.state.a).toBe(1);

      act(() =>
        hook.result.current.setState('a', 2)
      );
      expect(hook.result.current.state.a).toBe(2);

      act(() =>
        hook.result.current.setState('d.e', (current) => current + 2, (next) => { next.c = 'hello' })
      );
      expect(hook.result.current.state.d.e).toBe(6);
      expect(hook.result.current.state.c).toBe('hello');
    })
  })
  describe('setByImmer()', () => {
    it('should be return a is 2', () => {
      const hook = getHook();
      expect(hook.result.current.state.a).toBe(1);

      act(() =>
        hook.result.current.setByImmer(draft => {
          draft.a = 2
        })
      );
      expect(hook.result.current.state.a).toBe(2);

      act(() =>
        hook.result.current.setByImmer(draft => {
          draft.d.e = 6
        })
      );
      expect(hook.result.current.state.d.e).toBe(6);
    })
  }
  )
  describe('saveCurrentValue()', () => {
    it('should be return a is 2', () => {
      const hook = getHook();
      expect(hook.result.current.state.a).toBe(1);

      act(() =>
        hook.result.current.setState('a', 2)
      );
      expect(hook.result.current.state.a).toBe(2);

      act(() =>
        hook.result.current.saveCurrentValue()
      );
      expect(hook.result.current.savedState.a).toBe(2);

    })
  })
  describe('restoreToSaved()', () => {
    it('should be return a is 2', () => {
      const hook = getHook();
      expect(hook.result.current.state.a).toBe(1);

      act(() =>
        hook.result.current.setState('a', 2)
      );
      expect(hook.result.current.state.a).toBe(2);

      act(() =>
        hook.result.current.saveCurrentValue()
      );
      expect(hook.result.current.savedState.a).toBe(2);

      act(() =>
        hook.result.current.setState('a', 3)
      );
      expect(hook.result.current.state.a).toBe(3);

      act(() =>
        hook.result.current.restoreToSaved()
      );
      expect(hook.result.current.state.a).toBe(2);
    })
  })
  describe('restoreToInit()', () => {
    it('should be return a is 1', () => {
      const hook = getHook();
      expect(hook.result.current.state.a).toBe(1);

      act(() =>
        hook.result.current.setState('a', 2)
      );
      expect(hook.result.current.state.a).toBe(2);

      act(() =>
        hook.result.current.restoreToInit()
      );
      expect(hook.result.current.state.a).toBe(1);
    })
  })
  describe('restoreByKeyNames()', () => {
    it('should be return a is 1, b is 2', () => {
      const hook = getHook();
      expect(hook.result.current.state.a).toBe(1);

      act(() =>
        hook.result.current.setState('a', 2)
      );
      expect(hook.result.current.state.a).toBe(2);

      act(() =>
        hook.result.current.setState('b', 14)
      );
      expect(hook.result.current.state.b).toBe(14);

      act(() =>
        hook.result.current.restoreByKeyNames(['a', 'b'])
      );
      expect(hook.result.current.state.a).toBe(1);
      expect(hook.result.current.state.b).toBe(2);
    })
  })
  describe('init()', () => {
    it('should be return a is 1, b is 2', () => {
      const hook = getHook();
      expect(hook.result.current.state.a).toBe(1);

      act(() =>
        hook.result.current.setState('a', 2)
      );
      expect(hook.result.current.state.a).toBe(2);

      act(() =>
        hook.result.current.setState('b', 14)
      );
      expect(hook.result.current.state.b).toBe(14);

      act(() =>
        hook.result.current.init()
      );
      expect(hook.result.current.state.a).toBe(1);
      expect(hook.result.current.state.b).toBe(2);
      act(() =>
        hook.result.current.init({ ...initialState, a: 3 })
      )
      expect(hook.result.current.state.a).toBe(3);
      act(() =>
        hook.result.current.init((prev) => ({ ...prev, a: 4 }))
      )
      expect(hook.result.current.state.a).toBe(4);

    })
  })
  describe('isMatched', () => {
    it('should be return true', () => {
      const hook = getHook();
      expect(hook.result.current.isMatched).toBe(true);

      act(() =>
        hook.result.current.setState('a', 2)
      );
      act(() =>
        jest.advanceTimersByTime(350)
      );
      expect(hook.result.current.isMatched).toBe(false);

      act(() =>
        hook.result.current.saveCurrentValue()
      );
      act(() =>
        jest.advanceTimersByTime(350)
      );
      expect(hook.result.current.isMatched).toBe(true);

      act(() =>
        hook.result.current.setState('a', 3)
      );
      act(() =>
        jest.advanceTimersByTime(350)
      );
      expect(hook.result.current.isMatched).toBe(false);

      act(() =>
        hook.result.current.restoreToSaved()
      );
      act(() =>
        jest.advanceTimersByTime(350)
      );
      expect(hook.result.current.isMatched).toBe(true);
    })
  })

})