---
title: State Persistence
---

# 💾 Persistence

`withPersistence` lets your chunks save and restore state automatically — even after page reloads.

## Basic Example

```ts
import { chunk } from "stunk";
import { withPersistence } from "stunk/middleware";

const counter = withPersistence(chunk({ count: 0 }), {
  key: "counter-state",
});

counter.set({ count: 1 });
// ✅ Saved to localStorage automatically
````

## Custom Storage

Use `sessionStorage` or any custom `Storage` object.

```ts
const score = withPersistence(chunk(0), {
  key: "game-score",
  storage: sessionStorage,
});
```

## Custom Serialization

Transform data before saving — for example, encrypting it.

```ts
const userData = withPersistence(chunk({ token: "abcd1234" }), {
  key: "secure-user",
  serialize: (v) => encrypt(JSON.stringify(v)),
  deserialize: (v) => JSON.parse(decrypt(v)),
});
```

## Why Use It?

✅ Keeps state after reloads
✅ Works with any storage
✅ Supports custom encode/decode logic

Use `withPersistence` for things like user sessions, app settings, or saved form data.

```
Next one up — do you want me to rewrite **AsyncChunk** next (same tone, short and clear)?
```
