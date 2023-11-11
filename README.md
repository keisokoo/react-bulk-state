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
          setByPath('count', (prev)=> prev++)
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


