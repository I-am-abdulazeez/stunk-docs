---
title: useChunk Hook
---

# useChunk

`useChunk` is a React hook that integrates with Stunk, allowing components to reactively read and update state stored in a Chunk. It supports optional selectors for optimized state selection and minimal re-renders.

## Basic Usage

```tsx
import { chunk } from "stunk";
import { useChunk } from "stunk/react";

const count = chunk(0);

const Counter = () => {
  const [value, _, update, reset] = useChunk(count);

  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={() => update((prev) => prev + 1)}>Increment</button>
      <button onClick={() => reset()}>Reset</button>
    </div>
  );
};
```

### Understanding the Return Values

`useChunk(chunk)` returns a tuple:

- `value` – The current state.
- `set(newValue)` – Directly sets a new value.
- `update(updaterFn)` – Updates the state using the previous value.
- `reset()` - Reset the `chunk` to its initial value. .
- `destroy()` - Destroy the `chunk` and all its subscribers.

  Use `set` when replacing state entirely and `update` when modifying based on the previous value.

## Using a Selector for Optimized Re-renders

By default, `useChunk` causes a component to re-render whenever any part of the chunk changes. However, using a selector ensures that the component only re-renders when the selected part of the state updates.

```tsx
const count = chunk({ value: 0, timestamp: Date.now() });

const SelectorExample = () => {
  const [value] = useChunk(count, (state) => state.value);

  return <p>Selected Count: {value}</p>;
};
```

### Why use a selector?

Without a selector, changes to `timestamp` would trigger re-renders even if `value` remains the same.
With a selector, the component only updates when `state.value` changes.

## Why Use `useChunk`?

✅ **Automatic Reactivity** – Components re-render only when relevant state changes.  
✅ **Selector Support** – Reduces unnecessary re-renders by picking only necessary parts of the state.  
✅ **Simplified API** – Easy-to-use functions for setting and updating state.

## Edge Cases & Considerations

- If the selector always returns the same value (e.g., `() => 1`), the component won’t re-render.
- `useChunk` ensures stable references for set and update, so they don’t cause unnecessary renders.
- Avoid selecting deep objects unless using memoization, as new object references trigger renders.

## 🚀 Conclusion

`useChunk` provides an efficient and ergonomic way to integrate Stunk with React applications. By leveraging selectors and reactivity, it ensures performant state management with minimal boilerplate.

---

Next up, let's explore `useDerive` and how we can use this powerful hook.
