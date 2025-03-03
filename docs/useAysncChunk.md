---
title: useAsyncChunk Hook
---

# useAsyncChunk

`useAsyncChunk` is a React hook that manages asynchronous state using Stunk’s AsyncChunk. It provides built-in reactivity, handling loading, error, and data states while keeping the UI in sync with async operations.

## Basic Usage

```tsx
import { asyncChunk } from "stunk";
import { useAsyncChunk } from "stunk/react";

const fetchUser = asyncChunk(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  return res.json();
});

const UserProfile = () => {
  const { data, loading, error, reload } = useAsyncChunk(fetchUser);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
      <button onClick={reload}>Reload</button>
    </div>
  );
};
```

## How It Works

`useAsyncChunk(asyncChunk)` subscribes to an asynchronous state.

- It provides a reactive object containing:
  - `data` – The resolved value (or null initially).
  - `loading` – `true` while the request is in progress.
  - `error` – An error object if the request fails.
- Automatically re-runs when the asyncChunk updates.

## Controlling Async State

### Manually Reloading Data

```tsx
<button onClick={reload}>Reload</button>
```

Re-fetches the data using the original async function.

## Mutating Data Locally

```tsx
const { mutate } = useAsyncChunk(fetchUser);

<button onClick={() => mutate((prev) => ({ ...prev, name: "Folashade" }))}>
  Change Name
</button>;
```

Modifies `data` without triggering a new request.

## Resetting to Initial State

```tsx
const { reset } = useAsyncChunk(fetchUser);

<button onClick={reset}>Reset</button>;
```

Clears `data`, `error`, and `loading`, resetting the state.

## Why Use `useAsyncChunk`?

✅ Automatic Reactivity – UI updates when async state changes.  
✅ Handles Loading & Errors – Simplifies async logic.  
✅ Built-in State Controls – Reload, mutate, and reset data easily.  
✅ Efficient & Performant – No unnecessary re-renders.

## 🚀 Conclusion

`useAsyncChunk` makes handling asynchronous state in React applications seamless. It provides a simple yet powerful API to track async operations with minimal boilerplate.
