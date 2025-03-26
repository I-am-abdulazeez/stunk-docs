---
title: State Persistence
---

# 💾 Persistence – Save State Across Reloads

Stunk provides state persistence with `withPersistence`, allowing your state to be saved and restored even after a page refresh.

## Enabling Persistence

To persist a chunk’s state, wrap it with `withPersistence` and provide a storage key:

```typescript
import { chunk } from "stunk";
import { withPersistence } from "stunk/middleware";

const counterChunk = withPersistence(chunk({ count: 0 }), {
  key: "counter-state",
});

// State automatically persists to localStorage
counterChunk.set({ count: 1 });
```

## Using Different Storage Options

By default, `withPersistence` uses `localStorage`, but you can switch to `sessionStorage`, etc:

```typescript
const sessionStorageChunk = withPersistence(chunk(0), {
  key: "counter",
  storage: sessionStorage, // Uses sessionStorage instead of localStorage
});
```

## Custom Serialization & Encryption

You can define custom serialization and deserialization to transform data before storing it:

```typescript
const encryptedChunk = withPersistence(chunk({ secret: "1234" }), {
  key: "encrypted-data",
  serialize: (value) => encrypt(JSON.stringify(value)),
  deserialize: (value) => JSON.parse(decrypt(value)),
});
```

## Why Use Persistence?

✅ Save user state across reloads  
✅ Improve user experience by retaining settings  
✅ Support custom storage and security methods

---

Next: `AsyncChunk` – Handling Loading & Errors ⚡

Learn how to manage asynchronous state with built-in loading and error handling! 🚀
