---
title: Infinite Async State
---

# 🔄 Infinite Async Chunk

`infiniteAsyncChunk` is your go-to for **infinite scrolling** and **paginated async data**.  
It automatically handles loading more data, caching, retrying, and stale checks — all in **accumulate mode**.

## 🚀 Basic Example

```ts
import { infiniteAsyncChunk } from "stunk";

const postsChunk = infiniteAsyncChunk(
  async ({ page, pageSize }) => {
    const res = await fetch(`/api/posts?page=${page}&limit=${pageSize}`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  },
  { pageSize: 5 }
);

// Subscribe to updates
postsChunk.subscribe(({ data, loading }) => {
  if (loading) console.log("Loading more posts...");
  if (data) console.log("Loaded:", data.length, "posts");
});

// Load next page
await postsChunk.nextPage();

// Refresh from first page
await postsChunk.reload();
````

## 🧠 Features

✅ Automatic pagination in **accumulate mode**
✅ Keeps old data while fetching new
✅ Caching & stale-time management
✅ Retry with delay
✅ Error callback
✅ Type-safe & composable

## ⚙️ Options

| Option       | Type                 | Default | Description                      |
| ------------ | -------------------- | ------- | -------------------------------- |
| `pageSize`   | `number`             | `10`    | Number of items per page         |
| `staleTime`  | `number`             | -       | Time before data becomes stale   |
| `cacheTime`  | `number`             | -       | How long to keep cached data     |
| `retryCount` | `number`             | -       | How many times to retry on error |
| `retryDelay` | `number`             | -       | Delay between retries (ms)       |
| `onError`    | `(error: E) => void` | -       | Callback for fetch errors        |

---

## 🧩 API

```ts
const chunk = infiniteAsyncChunk(fetcher, options);

chunk.get();              // { data, loading, error, hasMore, total }
chunk.nextPage();         // Load next page (accumulate mode)
chunk.reload();           // Reload from page 1
chunk.refresh();          // Smart refresh (uses cache)
chunk.setParams(params);  // Set query parameters
chunk.subscribe(fn);      // Listen for changes
chunk.destroy();          // Cleanup
```

## 🌍 Example with Filters

```ts
const productsChunk = infiniteAsyncChunk(
  async ({ category, page, pageSize }) => {
    const res = await fetch(`/api/products?cat=${category}&page=${page}&limit=${pageSize}`);
    return res.json();
  },
  { pageSize: 10 }
);

// Apply filter and reload
productsChunk.setParams({ category: "electronics" });
await productsChunk.reload();

// Load more
await productsChunk.nextPage();
```

## 🧠 Best Practices

✅ Use `reload()` when filters or parameters change
✅ Use `refresh()` for background updates
✅ Destroy unused chunks to free memory
✅ Handle errors with `onError` for better UX

## ✅ Summary

`infiniteAsyncChunk` gives you smooth, efficient infinite loading out of the box:

* Auto-pagination in accumulate mode
* Cache, retry, and stale management
* Clean API and type-safe

Perfect for feeds, timelines, product lists, or endless scroll experiences.
