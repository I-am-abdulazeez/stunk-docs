---
title: useComputed Hook
---

# 🧩 useComputed

`useComputed` lets you **reactively compute a value** from multiple chunks.  
It automatically recalculates whenever any dependency changes — perfect for derived or combined state.

## 💡 Example

```tsx
import { chunk } from "stunk";
import { useComputed } from "stunk/react";

const count = chunk(2);
const multiplier = chunk(3);

function Product() {
  const product = useComputed([count, multiplier], (c, m) => c * m);
  return <p>Product: {product}</p>;
}
````

## ⚙️ How It Works

`useComputed([chunk1, chunk2], computeFn)`
→ Takes an array of chunks and a compute function.
→ Returns a reactive value that updates when any chunk changes.
→ Only re-renders when the computed result changes.

## 🧮 Real Example

```tsx
const price = chunk(100);
const discount = chunk(0.2);

function DiscountedPrice() {
  const finalPrice = useComputed([price, discount], (p, d) => p * (1 - d));
  return <p>Final Price: {finalPrice}</p>;
}
```

If either `price` or `discount` updates, the computed value refreshes automatically.

## ✅ Why Use `useComputed`?

* Compute values from multiple chunks
* Fully reactive updates
* Optimized rendering
* Clean, declarative API

Next up → **`useAsyncChunk`** for handling async reactive state. ⚡
