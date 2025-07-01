---
title: useAsyncChunk Hook
---

# useAsyncChunk

`useAsyncChunk` is a React hook that manages asynchronous state using Stunk's AsyncChunk. It provides built-in reactivity, handling loading, error, and data states while keeping the UI in sync with async operations.

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

## Parameterized Usage

For async chunks that require parameters, pass them as the second argument:

```tsx
import { asyncChunk } from "stunk";
import { useAsyncChunk } from "stunk/react";

const fetchUserById = asyncChunk(async (userId: number) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
});

const UserProfile = ({ userId }: { userId: number }) => {
  const { data, loading, error, reload, setParams } = useAsyncChunk(
    fetchUserById, 
    [userId]
  );

  if (loading) return <p>Loading user...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No user data</p>;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
      <button onClick={() => reload(userId)}>Reload</button>
      <button onClick={() => setParams(userId + 1)}>Load Next User</button>
    </div>
  );
};
```

### Conditional Fetching

When you don't want to fetch immediately (e.g., when parameters are undefined):

```tsx
const UserProfile = ({ userId }: { userId?: number }) => {
  // Only fetch when userId is available
  const { data, loading, error } = useAsyncChunk(
    fetchUserById, 
    userId ? [userId] : undefined
  );

  if (!userId) return <p>Select a user</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>{data?.name}</div>;
};
```

### Multiple Parameters

For async chunks with multiple parameters:

```tsx
const fetchUserPosts = asyncChunk(async (userId: number, limit: number) => {
  const res = await fetch(`/api/users/${userId}/posts?limit=${limit}`);
  return res.json();
});

const UserPosts = ({ userId, limit }: { userId: number; limit: number }) => {
  const { data: posts, loading, error, reload } = useAsyncChunk(
    fetchUserPosts,
    [userId, limit]
  );

  // ... render logic
};
```

## How It Works

`useAsyncChunk(asyncChunk, params?)` subscribes to an asynchronous state:

- **Automatic Parameter Updates**: When `params` change, the hook automatically calls `setParams` and triggers a new fetch
- **Reactive State**: Provides a reactive object containing:
  - `data` – The resolved value (or null initially)
  - `loading` – `true` while the request is in progress
  - `error` – An error object if the request fails
  - `lastFetched` – Timestamp of the last successful fetch
- **Automatic Cleanup**: Handles subscription cleanup and async chunk cleanup on unmount

## Controlling Async State

### Manually Reloading Data

```tsx
const { reload } = useAsyncChunk(fetchUserById, [userId]);

// Force reload with current parameters
<button onClick={() => reload()}>Reload</button>

// Reload with specific parameters
<button onClick={() => reload(newUserId)}>Load Different User</button>
```

### Smart Refresh (Respects Cache)

```tsx
const { refresh } = useAsyncChunk(fetchUserById, [userId]);

// Only refetch if data is stale
<button onClick={() => refresh()}>Refresh</button>
```

### Mutating Data Locally

```tsx
const { mutate } = useAsyncChunk(fetchUser);

const handleMutation = () => {
  mutate((prev) => ({ ...prev, name: "Folashade" }));
};

return (
  <div>
    <button onClick={handleMutation}>Change Name</button>
  </div>
);
```

Modifies `data` without triggering a new request.

### Resetting to Initial State

```tsx
const { reset } = useAsyncChunk(fetchUser);

<button onClick={reset}>Reset</button>
```

Clears `data`, `error`, and `loading`, resetting the state.

### Dynamic Parameter Updates

```tsx
const { setParams } = useAsyncChunk(fetchUserById, [userId]);

const loadDifferentUser = (newUserId: number) => {
  setParams(newUserId); // Automatically triggers fetch
};
```

## Advanced Patterns

### Modal with Conditional Loading

```tsx
const UserModal = ({ isOpen, userId }: { isOpen: boolean; userId?: number }) => {
  const { data, loading, error } = useAsyncChunk(
    fetchUserById,
    isOpen && userId ? [userId] : undefined
  );

  if (!isOpen) return null;

  return (
    <Modal>
      {loading && <Spinner />}
      {error && <Error message={error.message} />}
      {data && <UserDetails user={data} />}
    </Modal>
  );
};
```

### Dependent Queries

```tsx
const UserWithPosts = ({ userId }: { userId: number }) => {
  const { data: user } = useAsyncChunk(fetchUserById, [userId]);
  
  // Only fetch posts after user is loaded
  const { data: posts, loading: postsLoading } = useAsyncChunk(
    fetchUserPosts,
    user ? [user.id] : undefined
  );

  return (
    <div>
      {user && <UserCard user={user} />}
      {postsLoading ? <Spinner /> : posts?.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
};
```

### Error Handling with Retry

```tsx
const { data, loading, error, reload } = useAsyncChunk(fetchUserById, [userId]);

if (error) {
  return (
    <div>
      <p>Failed to load user: {error.message}</p>
      <button onClick={() => reload(userId)}>Retry</button>
    </div>
  );
}
```

## Return Value

The hook returns an object with the following properties:

```typescript
interface UseAsyncChunkResult<T, E extends Error = Error> {
  data: T | null;
  loading: boolean;
  error: E | null;
  lastFetched?: number;
  reload: (...params: any[]) => Promise<void>;
  refresh: (...params: any[]) => Promise<void>;
  mutate: (mutator: (currentData: T | null) => T) => void;
  reset: () => void;
  setParams?: (...params: any[]) => void; // Only available for parameterized chunks
}
```

## Why Use `useAsyncChunk`?

✅ **Automatic Reactivity** → UI updates when async state changes  
✅ **Parameter Management** → Handles parameter changes automatically  
✅ **Handles Loading & Errors** → Simplifies async logic  
✅ **Built-in State Controls** → Reload, mutate, and reset data easily  
✅ **Efficient & Performant** → No unnecessary re-renders  
✅ **Smart Caching** → Respects stale time and cache configuration  
✅ **Automatic Cleanup** → Prevents memory leaks  

## Best Practices

1. **Use conditional parameters** for optional fetching:
   ```tsx
   useAsyncChunk(fetchData, condition ? [param] : undefined)
   ```

2. **Handle loading and error states** appropriately in your UI

3. **Use `refresh()` over `reload()`** when you want to respect cache settings

4. **Leverage `mutate()`** for optimistic updates before server confirmation

5. **Clean parameter dependencies** - avoid passing objects that change on every render

## 🚀 Conclusion

`useAsyncChunk` makes handling asynchronous state in React applications seamless. It provides a simple yet powerful API to track async operations with minimal boilerplate, automatic parameter management, and built-in performance optimizations.
