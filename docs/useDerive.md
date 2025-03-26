---
title: useDerive Hook
---

# useDerive

`useDerive` is a React hook that allows you to create a read-only derived state from a Chunk. It ensures that the derived value remains reactive and updates automatically when the source Chunk changes.

## Basic Usage

```tsx
import { chunk } from "stunk";
import { useDerive } from "stunk/react";

const count = chunk(0);

const DoubledCount = () => {
  const double = useDerive(count, (value) => value * 2);

  return <p>Double: {double}</p>;
};
```

## How It Works

- `useDerive(chunk, fn)` takes a source chunk and a derivation function.
- It returns a **reactive computed value** based on the chunk’s state.
- The component re-renders only when the derived value changes.

## Using useDerive with Objects

```tsx
const user = chunk({ name: "John", age: 30 });

const UserInfo = () => {
  const userAgeText = useDerive(user, (state) => `Age: ${state.age}`);

  return <p>{userAgeText}</p>;
};
```

Even if other properties of `user` change, the component only re-renders if `age` updates.

### Why Use `useDerive`?

✅ **Derived Reactivity** → Keeps computed values in sync with state.  
✅ **Optimized Performance** → Only re-renders when the derived value changes.  
✅ **Read-Only Computation** → Prevents accidental state mutations.  
✅ **Memoized for Efficiency** → Avoids unnecessary recalculations.

## 🚀 Conclusion

`useDerive` is a powerful way to compute reactive values in React applications using Stunk. It ensures efficient state derivation with minimal boilerplate.

Next up, let's explore `useComputed`.
