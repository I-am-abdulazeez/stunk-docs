---
title: useInfiniteAsyncChunk Hook
---

# 🔁 useInfiniteAsyncChunk

`useInfiniteAsyncChunk` is a React hook for **infinite scrolling** powered by Stunk’s async chunks.  
It automatically fetches more data as the user scrolls, while managing pagination, loading, and reactivity.

## ⚡ Basic Example

```tsx
import { useInfiniteAsyncChunk } from "stunk/react";
import { paginatedAsyncChunk } from "stunk";

const postsChunk = paginatedAsyncChunk(async ({ page, pageSize }) => {
  const res = await fetch(`/api/posts?page=${page}&limit=${pageSize}`);
  return res.json();
});

export function PostsList() {
  const {
    data,
    loadMore,
    observerTarget,
    hasMore,
    isFetchingMore,
  } = useInfiniteAsyncChunk(postsChunk);

  return (
    <div>
      {data?.map((post) => (
        <p key={post.id}>{post.title}</p>
      ))}

      {isFetchingMore && <p>Loading more...</p>}
      {!hasMore && <p>No more posts</p>}

      {/* Sentinel for infinite scroll */}
      <div ref={observerTarget} style={{ height: 1 }} />

      {/* Manual trigger */}
      <button onClick={loadMore}>Load More</button>
    </div>
  );
}
````

## 🧠 How It Works

`useInfiniteAsyncChunk` builds on top of `useAsyncChunk` with added pagination logic and scroll observation:

* Automatically starts from `page = 1`.
* Uses `IntersectionObserver` to detect when the bottom sentinel enters view.
* Calls `nextPage()` to fetch and append more data.
* Handles both **manual** and **automatic** loading modes.

## ⚙️ Options

| Option          | Type         | Default | Description                                          |
| --------------- | ------------ | ------- | ---------------------------------------------------- |
| `initialParams` | `Partial<P>` | `{}`    | Initial parameters (excluding `page` and `pageSize`) |
| `autoLoad`      | `boolean`    | `true`  | Enables automatic loading when scrolling to bottom   |
| `threshold`     | `number`     | `1.0`   | Intersection observer threshold                      |

All other `useAsyncChunk` options (e.g., `onError`, `onSuccess`) are also supported.

## 🧩 Returned Values

| Property         | Type                  | Description                       |
| ---------------- | --------------------- | --------------------------------- |
| `data`           | `T[]`                 | The loaded list of items          |
| `loading`        | `boolean`             | Whether data is currently loading |
| `hasMore`        | `boolean`             | Whether more data is available    |
| `loadMore`       | `() => void`          | Manually loads the next page      |
| `observerTarget` | `Ref<HTMLDivElement>` | Attach to the scroll sentinel     |
| `isFetchingMore` | `boolean`             | True if fetching additional pages |

## 🚀 Features

✅ Automatic infinite scroll with `IntersectionObserver`
✅ Manual “Load More” control
✅ Preserves previously loaded data
✅ Works seamlessly with paginated async chunks
✅ Fully reactive with minimal setup

`useInfiniteAsyncChunk` makes it effortless to add infinite scrolling and pagination to your Stunk-powered React apps — no complex state management required.
