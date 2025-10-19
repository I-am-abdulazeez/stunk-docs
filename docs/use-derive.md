---
title: useDerive Hook
---

# 🧮 useDerive

`useDerive` creates a **reactive, read-only value** from an existing chunk.  
It automatically updates whenever the source chunk changes — perfect for computed or dependent state.

## 💡 Example

```tsx
import { chunk } from "stunk";
import { useDerive } from "stunk/react";

const count = chunk(0);

function DoubleCount() {
  const double = useDerive(count, (v) => v * 2);
  return <p>Double: {double}</p>;
}
````

## 📦 How It Works

`useDerive(chunk, fn)`
→ Takes a chunk and a derive function.
→ Returns a computed value that updates when the source changes.
→ Only re-renders when the derived result actually changes.

## 🧱 Working with Objects

```tsx
const user = chunk({ name: "Lara", age: 25 });

function UserAge() {
  const ageText = useDerive(user, (u) => `Age: ${u.age}`);
  return <p>{ageText}</p>;
}
```

Even if `name` changes, this component won’t re-render — only when `age` does.

## ✅ Why Use `useDerive`?

* Auto-reactive derived values
* Prevents accidental state mutation
* Optimized rendering
* Clean, simple API

Next up → **`useComputed`** — for more complex reactive calculations. ⚡
