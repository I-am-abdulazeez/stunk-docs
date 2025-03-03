---
title: Async State
---

# ⚡ Async State – Managing Asynchronous Data

Stunk's `asyncChunk` simplifies handling asynchronous state by automatically managing loading, error, and data states. Perfect for working with APIs and async operations.

🚀 Key Features

✅ Built-in Loading & Error Handling – Tracks async state automatically.  
✅ Type-Safe – Fully typed in TypeScript, ensuring correct data handling.  
✅ Optimistic Updates – Modify data optimistically before confirmation.

## 🔗 Creating an Async Chunk

```typescript
import { asyncChunk } from "stunk";

type User = {
  id: number;
  name: string;
  email: string;
};

// Fetch user data asynchronously
const user = asyncChunk<User>(async () => {
  const response = await fetch("/api/user");
  return response.json(); // TypeScript enforces this to return User
});
```

## 📡 Subscribing to Async State

`asyncChunk` exposes `{ data, loading, error }` properties to track request status:

```typescript
user.subscribe(({ loading, error, data }) => {
  if (loading) console.log("Loading...");
  if (error) console.log("Error:", error);
  if (data) console.log("User:", data);
});
```

::: tip 💡 TypeScript Advantage
`data` is typed as `User | null`, ensuring safe access to properties.
:::

## 🔄 Reloading Data

Need to refetch the data? Just call `.reload()`:

```typescript
await user.reload(); // Triggers a fresh API request
```

## ⚡ Optimistic Updates

Modify state before confirmation and revert if needed:

```typescript
// Optimistically update the user's name
user.mutate((currentData) => ({
  ...currentData,
  name: "Fola",
}));
```

✔️ Ensures TypeScript enforces correct property updates:

```typescript
user.mutate((currentUser) => ({
  id: currentUser?.id ?? 0,
  name: "Olamide",
  email: "olamide@gmail.com",
  age: 70, // ❌ TypeScript Error: Unknown property 'age'
}));
```

## Why Use Async Chunks?

✔️ Simplifies API requests with automatic state tracking.  
✔️ Eliminates boilerplate by handling loading and errors natively.  
✔️ Ensures type safety and prevents incorrect updates.

---

Next: Before we learn how to merge multiple async states efficiently, let's me introduce the `once` utilities function. 🚀
