---
title: useChunk Hook
---

# 🎯 useChunk

`useChunk` connects your React components to a Stunk chunk — it automatically re-renders when the chunk’s state changes.

---

## 💡 Basic Example

```tsx
import { chunk } from "stunk";
import { useChunk } from "stunk/react";

const count = chunk(0);

function Counter() {
  const [value, set, reset] = useChunk(count);

  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={() => set((prev) => prev + 1)}>+1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
````

---

## 📦 What It Returns

`useChunk(chunk)` gives you a tuple:

| Item        | Description                 |                  |
| ----------- | --------------------------- | ---------------- |
| `value`     | The current state           |                  |
| `set(value  | updaterFn)`                 | Update the chunk |
| `reset()`   | Reset to the initial value  |                  |
| `destroy()` | Remove the chunk completely |                  |

## 🎯 Using Selectors

You can track only part of the chunk to avoid extra renders.

```tsx
const user = chunk({ name: "Aduke", age: 25 });

function NameOnly() {
  const [name] = useChunk(user, (state) => state.name);
  return <p>{name}</p>;
}
```

Without a selector, every change (like `age`) would re-render this component.
With a selector, it re-renders **only** when `name` changes.

## ✅ Why Use `useChunk`?

* Auto-reactive updates
* Works with primitives, objects, and async chunks
* Supports selectors for better performance

Next up: check out **`useDerive`** — create derived state easily from one or more chunks. ⚡
