---
title: useAsyncChunk Hook
---

# ⚡ useAsyncChunk

`useAsyncChunk` helps you manage async state in React using Stunk’s `AsyncChunk`.  
It tracks **loading**, **error**, and **data** automatically — keeping your UI reactive and clean.

## 💡 Example

```tsx
import { asyncChunk } from "stunk";
import { useAsyncChunk } from "stunk/react";

const fetchUser = asyncChunk(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  return res.json();
});

function UserProfile() {
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
}
````

## ⚙️ What It Does

`useAsyncChunk(chunk)` gives you reactive async control.

You get:

* `data` → the fetched value
* `loading` → true while fetching
* `error` → any caught error
* `reload()` → refetch the data
* `mutate()` → update data locally
* `reset()` → clear everything

## 🔁 Reloading Data

```tsx
<button onClick={reload}>Reload</button>
```

This re-fetches the async data using the original fetcher.

## ✏️ Mutating Data Locally

```tsx
const { mutate } = useAsyncChunk(fetchUser);

function changeName() {
  mutate((prev) => ({ ...prev, name: "Aduke" }));
}
```

Updates the local data without triggering a new fetch.

## 🔄 Resetting State

```tsx
const { reset } = useAsyncChunk(fetchUser);

<button onClick={reset}>Reset</button>;
```

Resets everything — data, error, and loading.

## ✅ Why Use `useAsyncChunk`?

* Auto reactive state for async data
* Built-in loading & error handling
* Easy `reload`, `mutate`, and `reset`
* Works great with pagination and params

Next up → learn about handling **pagination and params** with async chunks. 🚀
