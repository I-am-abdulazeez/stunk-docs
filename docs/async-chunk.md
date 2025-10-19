---
title: Async State
---

# ⚡ Async State

`asyncChunk` helps you handle loading, errors, retries, and caching automatically — perfect for fetching data or running async operations without stress.

## 🚀 What It Handles for You

✅ Loading, error, and data states  
✅ Caching and background refresh  
✅ Retry with delay  
✅ Optimistic updates  
✅ Type-safe and framework-agnostic  

## Basic Example

```ts
import { asyncChunk } from "stunk";

type User = { id: number; name: string; email: string };

const userChunk = asyncChunk<User>(async () => {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
});

userChunk.subscribe(({ loading, error, data }) => {
  if (loading) console.log("Loading user...");
  if (error) console.log("Error:", error.message);
  if (data) console.log("Loaded:", data.name);
});
````

## Parameterized Fetch

```ts
const userChunk = asyncChunk<User, Error, [number]>(async (id) => {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
});

// Load a specific user
await userChunk.reload(7);

// Or set the param for later
userChunk.setParams(7);
```

## Caching and Refresh

```ts
const dataChunk = asyncChunk(fetchData, {
  refresh: {
    staleTime: 60_000,    // Fresh for 1 min
    cacheTime: 300_000,   // Keep cached for 5 mins
    refetchInterval: 30_000 // Auto-refresh every 30s
  },
  retryCount: 3,
  retryDelay: 1000,
});
```

## Conditional Fetch

```ts
const userChunk = asyncChunk(fetchUser, { enabled: false });

// Fetch manually when ready
await userChunk.reload();

// Or use parameters
const postsChunk = asyncChunk(fetchPosts, { enabled: false });
if (userId) postsChunk.reload(userId);
```

## Reload & Refresh

```ts
await userChunk.reload();  // Force reload
await userChunk.refresh(); // Smart refresh (uses cache)
```

## Optimistic Update

```ts
userChunk.mutate((user) => ({
  ...user!,
  name: "Fola Updated"
}));

// Rollback on failure
try {
  await updateUserAPI({ name: "Fola Updated" });
} catch {
  userChunk.reload(); // revert
}
```

## Pagination Example

```ts
const usersChunk = asyncChunk(fetchUsers, {
  pagination: { pageSize: 10, mode: "accumulate" },
});

await usersChunk.nextPage(); // Load more
await usersChunk.goToPage(3);
```

## Reset and Cleanup

```ts
userChunk.reset();   // Reset to initial
userChunk.destroy(); // Full cleanup
```

## Interface (Summary)

```ts
interface AsyncChunk<T> {
  get(): { loading: boolean; error: Error | null; data: T | null };
  reload(...params: any[]): Promise<void>;
  refresh(...params: any[]): Promise<void>;
  mutate(fn: (data: T | null) => T): void;
  reset(): void;
  destroy(): void;
}
```

## Why Use AsyncChunk?

⚡ Auto-handles loading & errors
🧠 Built-in cache & retry logic
🔒 Type-safe and clean
🌍 Works in any JS or TS app

Next: let’s look at **`once`** — run something only one time, no matter what. 🚀
