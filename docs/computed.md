---
title: Computed
---

# Computed

Computed Chunks in Stunk allow you to create state derived from other chunks in a reactive way. Unlike derived chunks, computed chunks can depend on multiple sources, and they automatically recalculate when any of the source chunks change.

```typescript
import { chunk, computed } from "stunk";

// Define base chunks
const firstNameChunk = chunk("Olamide");
const lastNameChunk = chunk("David");
const ageChunk = chunk(25);

// Create a computed chunk
const fullInfoChunk = computed(
  // takes the multiple chunk as dependecy array.
  [firstNameChunk, lastNameChunk, ageChunk],
  (firstName, lastName, age) => ({
    fullName: `${firstName} ${lastName}`,
    isAdult: age >= 18,
  })
);

// Subscribe to changes
fullInfoChunk.subscribe((info) => console.log("Updated Info:", info));

// Update dependencies
firstNameChunk.set("John"); // ✅ fullInfoChunk updates automatically
ageChunk.set(16); // ✅ isAdult will update to false
```

## Why Use Computed Chunks?

✔️ Automatic Updates → Recomputes when dependencies change.  
✔️ Optimized Performance → Only recomputes when needed.  
✔️ Derived State → Keeps logic clean and centralized.

**`computed` chunks** are ideal for scenarios where state depends on multiple sources or needs complex calculations. They ensure your application remains performant and maintainable.
