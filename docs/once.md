---
title: Once
---

# ⏳ Once – Ensure a Function Runs Only Once

The once utility ensures that a function executes only once, even if called multiple times. This is useful for caching expensive computations, preventing redundant function calls, and optimizing performance.

## ⚙️ How It Works

✅ Tracks Execution: Runs the function once and stores the result.  
✅ Returns Cached Result: Subsequent calls return the saved result without re-executing.  
✅ Boosts Performance: Prevents redundant calculations or event handlers.

## 🛠️ Usage Example

```typescript
import { chunk, once } from "stunk";

const numbersChunk = chunk([1, 2, 3, 4, 5]);

// Expensive calculation that should run only once
const expensiveCalculation = once(() => {
  console.log("Expensive calculation running...");
  return numbersChunk.get().reduce((sum, num) => sum + num, 0);
});
```

**Derive the chunk and subscribe**

```typescript
// Derived chunk using the once utility
const totalChunk = numbersChunk.derive(() => expensiveCalculation());

totalChunk.subscribe((total) => {
  console.log("Total:", total);
});

// Even if numbersChunk updates, the calculation runs only once
numbersChunk.set([10, 20, 30, 40, 50]);
```

## Why Use once?

✅ Eliminates redundant computations by ensuring a function runs only once.  
✅ Enhances performance when dealing with costly operations.  
✅ Works seamlessly with chunks for optimized state updates.

---

The wait is over. Learn how to merge multiple async states efficiently! 🚀
