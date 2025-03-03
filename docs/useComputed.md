---
title: useComputed Hook
---

# useComputed

`useComputed` is a React hook that derives a computed value from multiple Chunks. It automatically re-evaluates when any of its dependencies change, ensuring efficient and reactive computation.

## Basic Usage

```tsx
import { chunk } from "stunk";
import { useComputed } from "stunk/react";

const count = chunk(2);
const multiplier = chunk(3);

const ComputedExample = () => {
  const product = useComputed([count, multiplier], (c, m) => c * m);

  return <p>Product: {product}</p>;
};
```

## How It Works

- `useComputed([chunk1, chunk2], computeFn)` takes an array of **chunks** and a computation function.
- It returns a reactive computed value that updates when any dependency changes.
- The computation is memoized for efficiency.
- Components using `useComputed` only re-render when the computed result changes.

## Example: Dependent Computation

```tsx
const price = chunk(100);
const discount = chunk(0.2);

const DiscountedPrice = () => {
  const finalPrice = useComputed([price, discount], (p, d) => p * (1 - d));

  return <p>Final Price: {finalPrice}</p>;
};
```

If either `price` or `discount` changes, `finalPrice` updates automatically.

## Why Use `useComputed`?

✅ Multi-Chunk Computation – Easily derive values from multiple Chunks.  
✅ Automatic Reactivity – Updates when any dependency changes.  
✅ Optimized Performance – Uses memoization to prevent unnecessary re-renders.  
✅ Simplified API – No need to manually subscribe to multiple chunks.

## 🚀 Conclusion

`useComputed` is a powerful way to derive state from multiple reactive sources in Stunk. It ensures that computations stay in sync with state changes while keeping the UI efficient and performant.

---

Next up, let's explore `useAsyncChunk`.
