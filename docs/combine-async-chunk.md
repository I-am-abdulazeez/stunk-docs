---
title: Combine Async Chunks
---

# 🔗 Combine Async Chunks

The `combineAsyncChunks` utility lets you merge multiple async chunks into one, ensuring they stay reactive and synchronized. This is useful when handling multiple related API calls, like fetching user data and posts at the same time.

## Key Features?

✅ Automatically re-renders UI when either userChunk or postsChunk updates.  
✅ Handles loading and errors seamlessly.

## Fetching Individual Async Chunks

```typescript
import { asyncChunk, combineAsyncChunks } from "stunk";

// Fetch user data
const userChunk = asyncChunk(async () => {
  const response = await fetch("/api/user");
  return response.json();
});

// Fetch posts with options
const postsChunk = asyncChunk(
  async () => {
    const response = await fetch("/api/posts");
    return response.json();
  },
  {
    initialData: [], // Start with empty data
    retryCount: 3, // Retry up to 3 times on failure
    retryDelay: 2000, // Wait 2 seconds before retrying
    onError: (error) => console.error("Failed to fetch posts:", error),
  }
);
```

## Combining Async Chunks

```typescript
const profileChunk = combineAsyncChunks({
  user: userChunk,
  posts: postsChunk,
});
```

This merges `userChunk` and `postsChunk` into a single reactive `chunk`, keeping their `states` in sync.

## Subscribing to the Combined State

```typescript
profileChunk.subscribe(({ loading, error, data }) => {
  if (loading) {
    showLoadingSpinner();
  } else if (error) {
    showError(error);
  } else {
    updateUI(data);
  }
});
```

## ✨ Why Use `combineAsyncChunks`?

✅ Maintains Reactivity: Automatically updates when any async chunk changes.  
✅ Preserves Data on Reloads: Keeps previous data intact while fetching new updates.  
✅ Handles Errors Gracefully: Propagates errors properly across combined chunks.

More powerful `utils` coming soon! 🔥
