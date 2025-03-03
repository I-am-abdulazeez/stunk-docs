---
title: State Selections - Readonly Values
---

# Optimized State Selection Hooks

Stunk provides powerful hooks for efficient state selection in React. These hooks help optimize re-renders by allowing components to subscribe to specific parts of a Chunk, read-only values, or multiple chunks at once.

## `useChunkValue` – Read-Only Subscription

`useChunkValue` is a lightweight hook that subscribes to a Chunk and returns its current value. It is useful for read-only components that don’t need to modify the state.

## Usage

```tsx
import { chunk } from "stunk";
import { useChunkValue } from "stunk/react";

const count = chunk(0);

const CounterDisplay = () => {
  const value = useChunkValue(count);

  return <p>Count: {value}</p>;
};
```

✅ Minimal Overhead – Only retrieves state without exposing update functions.

✅ Supports Selectors – Can be used with a selector for fine-grained state selection:

```tsx
const user = chunk({ name: "John", age: 30 });

const UserAge = () => {
  const age = useChunkValue(user, (u) => u.age);
  return <p>Age: {age}</p>;
};
```

## `useChunkProperty` – Subscribe to a Specific Property

`useChunkProperty` allows you to subscribe to a specific property of a Chunk. This ensures that components only re-render when the selected property changes, preventing unnecessary updates.

## Usage

```tsx
import { chunk } from "stunk";
import { useChunkProperty } from "stunk/react";

const user = chunk({ name: "John", age: 30 });

const UserName = () => {
  const name = useChunkProperty(user, "name");

  return <p>Name: {name}</p>;
};
```

✅ Optimized Re-renders – The component only updates if name changes, not age.

## `useChunkValues` – Read Multiple Chunks

`useChunkValues` allows you to subscribe to multiple Chunks and retrieve their values as an array-like object. The component only re-renders when any of the values change.

## Usage

```tsx
const firstName = chunk("John");
const lastName = chunk("Doe");

const FullName = () => {
  const [first, last] = useChunkValues([firstName, lastName]);

  return (
    <p>
      Full Name: {first} {last}
    </p>
  );
};
```

✅ Efficient Multi-State Selection – Reacts only when any of the provided Chunks update.

✅ Flexible & Readable – Simplifies state selection for components that rely on multiple Chunks.

## 🚀 Conclusion

These selection hooks provide optimized and fine-grained reactivity in Stunk-powered React apps:

`useChunkProperty` – Subscribe to a specific property inside a Chunk.  
`useChunkValue` – Get a read-only subscription to a Chunk’s value.  
`useChunkValues` – Read multiple Chunks at once efficiently.

By using these **hooks**, you can improve performance and minimize unnecessary re-renders, making your React components more efficient and responsive.
