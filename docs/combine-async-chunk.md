---
title: combineAsyncChunks
---

# 🔗 combineAsyncChunks

`combineAsyncChunks` merges multiple **async chunks** into one reactive chunk.  
It tracks **loading**, **error**, and **data** states across all sources — perfect for managing multiple parallel API calls.

## ⚡ Basic Example

```ts
import { asyncChunk, combineAsyncChunks } from "stunk";

// User data
const userChunk = asyncChunk(async () => {
  const res = await fetch("/api/user");
  return res.json();
});

// User posts
const postsChunk = asyncChunk(async () => {
  const res = await fetch("/api/posts");
  return res.json();
});

// Combine both
const profileChunk = combineAsyncChunks({
  user: userChunk,
  posts: postsChunk,
});
````

Now `profileChunk` is a single **reactive chunk** with this shape:

```ts
{
  loading: boolean;
  error: Error | null;
  errors: Record<string, Error>;
  data: {
    user: User | null;
    posts: Post[] | null;
  };
}
```

## 🔁 Reactivity Example

```ts
profileChunk.subscribe(({ loading, error, data }) => {
  if (loading) console.log("Loading...");
  else if (error) console.error("Error:", error);
  else console.log("Profile data:", data);
});
```

✅ Updates automatically when **any** async chunk changes
✅ Keeps partial results while others are loading
✅ Aggregates errors and loading states cleanly

## 🧠 Why Use It?

| Benefit                           | Description                                           |
| --------------------------------- | ----------------------------------------------------- |
| 🔄 **Synchronized Loading**       | Combines multiple async states into one cohesive view |
| ⚙️ **Centralized Error Handling** | Collects all errors in one place                      |
| 💾 **Partial Data Support**       | Keeps old data while new requests load                |
| ⚡ **Full Reactivity**             | Auto-updates when any source chunk updates            |

### Example Use Case

```ts
const dashboard = combineAsyncChunks({
  profile: profileChunk,
  stats: statsChunk,
  notifications: notificationsChunk,
});
```

You can now manage **entire dashboard state** with one chunk —
reactive, efficient, and fully composable. 🚀
