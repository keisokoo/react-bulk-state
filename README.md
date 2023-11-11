# react-bulk-state

`react-bulk-state` is a utility for batch updating the state in a React application.

It uses `immer` and the `set` function from `lodash-es` for convenient state updates.

Additional features include saving and restoring previous states, as well as checking whether the state has changed.

## install

```bash
npm install react-bulk-state

# or

yarn add react-bulk-state
```

## usage

```tsx
import { useBulkState } from 'react-bulk-state';

export function Component(){
  const [state, {
    setByPath
  }] = useBulkState({ count: 0, text: '', foo: { bar: { baz: 'hello' } } });
  const { count, text, foo } = state;
  return (
    <div>
      <p>count: {count}</p>
      <button
        onClick={() =>
          setByPath('count', (prev)=> prev+1)
        }
      >
        increment
      </button>
      <input
        value={text}
        onChange={(e) => setByPath('text', e.target.value)}
      />
      <button
        onClick={() =>
          setByPath('foo.bar.baz', (current) => current + ' world!')
        }
      >
        {foo.bar.baz}
      </button>
    </div>
  );
}
```

## Reference
```tsx
const [state, {
    savedState,
    isMatched,
    saveCurrentValue,
    init,
    setState,
    setByPath,
    setByImmer,
    restoreToInit,
    restoreToSaved,
    restoreByKeyNames,
  }] = useBulkState<T extends object>(initialState: T = {});
  ```

  - **`state`**_`: T`_&mdash; The current state.
  - **`savedState`**_`: T`_&mdash; The value of the state when `saveCurrentValue` is called.
  - **`isMatched`**_`: boolean`_&mdash; Whether the current state is the same as the saved state.
  - **`saveCurrentValue`**_`: void`_&mdash; Save the current state.
  - **`init(next?: T | ((prev: T) => T) | undefined)`**_`: void`_&mdash; Re-Initialize the `state` and `savedState`.
  - **`setState(next: T | ((prev: T) => T))`**_`: void`_&mdash; Update the state.
  - **`setByPath(target: string, data: T[target] | (currentValue: T[target], state: T), afterChange?: (Draft<T>) => void)`**_`: void`_&mdash; 
    Update the state by path.
    ```tsx
    setByPath('foo.bar.baz', (current) => current + ' world!', (draft) => {
      // draft.foo.bar.baz === 'hello world!'
      // then do something with draft(like using immer)
    })
    ```
  - **`setByImmer: (Draft<T>)`**_`: void`_&mdash; Update the state by immer.
  - **`restoreToInit`**_`: void`_&mdash; Restore the state to the initial state.
  - **`restoreToSaved`**_`: void`_&mdash; Restore the state to the saved state.
  - **`restoreByKeyNames`**_`: void`_&mdash; Restore the state to the saved state by key names.
