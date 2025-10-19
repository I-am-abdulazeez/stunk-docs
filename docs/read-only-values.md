---
title: Readonly State Hooks
---

# 🧩 Readonly & Optimized State Hooks

Stunk gives you simple hooks to read state efficiently — perfect for components that don’t need to modify anything.

## 🔍 `useChunkValue`

A lightweight hook that subscribes to a chunk and returns **only its current value**.  
Ideal for read-only components.

```tsx
import { chunk } from "stunk";
import { useChunkValue } from "stunk/react";

const count = chunk(0);

function CounterDisplay() {
  const value = useChunkValue(count);
  return <p>Count: {value}</p>;
}
````

✅ **No extra functions** — just reads the value
✅ **Selector support** — read a specific part of the chunk

```tsx
const user = chunk({ name: "Fola", age: 30 });

function UserAge() {
  const age = useChunkValue(user, (u) => u.age);
  return <p>Age: {age}</p>;
}
```

## 🧱 `useChunkProperty`

Subscribe to a single property inside an object chunk.
The component re-renders **only when that property changes**.

```tsx
import { chunk } from "stunk";
import { useChunkProperty } from "stunk/react";

const user = chunk({ name: "Abdulzeez", age: 25 });

function UserName() {
  const name = useChunkProperty(user, "name");
  return <p>Name: {name}</p>;
}
```

✅ Prevents extra re-renders
✅ Perfect for object-based state

## 🔗 `useChunkValues`

Read multiple chunks at once.
Re-renders only when any of them change.

```tsx
const firstName = chunk("Qudus");
const lastName = chunk("Asake");

function FullName() {
  const [first, last] = useChunkValues([firstName, lastName]);
  return <p>{first} {last}</p>;
}
```

✅ Reactive across multiple chunks
✅ Clean and easy to read

## ⚡ Summary

| Hook               | Purpose                             |
| ------------------ | ----------------------------------- |
| `useChunkValue`    | Read-only access to a chunk         |
| `useChunkProperty` | Subscribe to one property only      |
| `useChunkValues`   | Combine values from multiple chunks |

These keep your components **fast, reactive, and clean** — no wasted re-renders, no boilerplate. 🚀

```
