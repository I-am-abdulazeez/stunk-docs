---
title: Async State
---

# ⚡ Async State – Managing Asynchronous Data

Stunk's `asyncChunk` eliminates the boilerplate of async state management by automatically handling loading states, errors, retries, and caching. Built for modern applications that need robust data fetching.

## 🚀 Key Features

✅ **Automatic State Management** → Loading, error, and data states handled automatically  
✅ **Smart Caching & Refresh** → Configurable stale time and cache invalidation  
✅ **Retry Logic** → Built-in retry with exponential backoff  
✅ **Optimistic Updates** → Mutate data optimistically with rollback support  
✅ **Type-Safe** → Full TypeScript support with proper error typing  
✅ **Framework Agnostic** → Works everywhere, React hooks included  

## 🔗 Basic Usage

### Simple Data Fetching

```typescript
import { asyncChunk } from "stunk";

type User = {
  id: number;
  name: string;
  email: string;
};


// Basic async chunk
const userChunk = asyncChunk<User>(async () => {
  const response = await fetch("/api/user");
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
});


// Subscribe to state changes
userChunk.subscribe(({ loading, error, data }) => {
  if (loading) console.log("Loading user...");
  if (error) console.log("Error:", error.message);
  if (data) console.log("User loaded:", data.name);
});
```

### Parameterized Fetching

```typescript
// Async chunk with parameters
const userChunk = asyncChunk<User, Error, [number]>(
  async (userId: number) => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error("User not found");
    return response.json();
  }
);

// Load specific user
await userChunk.reload(123);


// Or set params for future calls
userChunk.setParams(123);
```

## ⚙️ Advanced Configuration

### Caching and Refresh Strategies

```typescript
const userChunk = asyncChunk<User>(fetchUser, {
  refresh: {
    staleTime: 60000,      // Data fresh for 1 minute
    cacheTime: 300000,     // Cache for 5 minutes
    refetchInterval: 30000 // Auto-refresh every 30 seconds
  },
  retryCount: 3,           // Retry failed requests 3 times
  retryDelay: 1000,        // Wait 1 second between retries
  enabled: true,           // Start fetching immediately
});
```

### Conditional Fetching

```typescript
const userChunk = asyncChunk<User>(fetchUser, {
  enabled: false // Don't fetch on creation
});

// Enable fetching when needed
userChunk.reload(); // Manually trigger fetch
// Or with parameters
const postChunk = asyncChunk<Post[], Error, [string]>(
  async (userId: string) => {
    if (!userId) throw new Error("User ID required");
    return fetchUserPosts(userId);
  },
  { enabled: false }
);

// Only fetch when we have a valid user ID
if (currentUserId) {
  postChunk.reload(currentUserId);
}
```

## 🔄 Data Operations

### Manual Reloading


```typescript
// Force reload (ignores cache)
await userChunk.reload();

// Smart refresh (respects stale time)
await userChunk.refresh();

// With parameters
await userChunk.reload(newUserId);
```

### Optimistic Updates

```typescript
// Optimistically update user data
userChunk.mutate((currentUser) => {
  if (!currentUser) return { id: 0, name: "New User", email: "" };
  
  return {
    ...currentUser,
    name: "Updated Name"
  };
});

// The mutation is type-safe - TypeScript will catch errors
userChunk.mutate((user) => ({
  ...user,
  invalidProperty: "value" // ❌ TypeScript Error
}));
```

### State Management

```typescript
// Reset to initial state
userChunk.reset();

// Destroy the chunk completely
userChunk.destroy();
```

### Performance Optimization

```typescript
// Use stale-while-revalidate pattern
const dataChunk = asyncChunk(fetchData, {
  refresh: {
    staleTime: 30000,    // Consider data stale after 30 seconds
    cacheTime: 600000,   // Keep in cache for 10 minutes
  }
});

// Preload data
dataChunk.refresh(); // Load in background
// Use optimistic updates for better UX
function updateUser(updates: Partial<User>) {
  // Update UI immediately
  userChunk.mutate(user => ({ ...user, ...updates }));
  // Send to server
  updateUserAPI(updates).catch(() => {
    // Revert on error
    userChunk.reload();
  });
}
```

## 🔧 API Reference

### AsyncChunk Interface


```typescript
interface AsyncChunk<T, E extends Error = Error> {
  // Core chunk methods
  get(): AsyncState<T, E>;
  set(state: AsyncState<T, E>): void;
  subscribe(callback: (state: AsyncState<T, E>) => void): () => void;
  destroy(): void;
  
  // Async-specific methods
  reload(...params: P): Promise<void>;     // Force reload
  refresh(...params: P): Promise<void>;    // Smart refresh
  mutate(mutator: (data: T | null) => T): void;  // Optimistic update
  reset(): void;                           // Reset to initial state
  cleanup(): void;                         // Clean up timers
  setParams(...params: P): void;           // Set parameters
}

interface AsyncState<T, E extends Error> {
  loading: boolean;
  error: E | null;
  data: T | null;
  lastFetched?: number;
}
```
---

Next: Before we learn how to merge multiple async states efficiently, let me introduce the ```once``` utility function. 🚀
