---
title: Time Travel (Undo & Redo)
---

# ⏳ Time Travel (Undo & Redo)

Stunk provides time-travel debugging with withHistory, allowing you to `undo`, `redo`, and track state changes effortlessly.

## Enabling History in a Chunk

To enable time travel for a `chunk`, wrap it with `withHistory`:

```typescript
import { chunk } from "stunk";
import { withHistory } from "stunk/middleware";

const counterChunk = withHistory(chunk(0));

counterChunk.set(1);
counterChunk.set(2);
```

Now, we can move back and forth through state changes:

```typescript
counterChunk.undo(); // Goes back to 1
counterChunk.undo(); // Goes back to 0

counterChunk.redo(); // Goes forward to 1
```

## Checking History State

You can check if `undo/redo` is possible:

```typescript
counterChunk.canUndo(); // Returns `true` if a previous state exists
counterChunk.canRedo(); // Returns `true` if a next state exists
```

## Managing History

Retrieve the full history of the chunk:

```typescript
counterChunk.getHistory();
// Returns an array of all previous states
```

Clear the history, keeping only the current value:

```typescript
counterChunk.clearHistory();
```

## Limiting History Size (Optional)

You can specify a max history size to prevent excessive memory usage.

```typescript
const counter = withHistory(chunk(0), { maxHistory: 5 });
// Only keeps the last 5 changes -- default is 100.
```

This prevents the history from growing indefinitely and ensures efficient memory usage.

## Why Use Time Travel?

✅ Undo Mistakes – Easily revert state changes  
✅ User-Friendly – Implement undo/redo features in UI  
✅ Debugging – Track and analyze state changes over time

---

Next: Learn how to persist Stunk state across page refreshes! 🚀
