---
title: Batch Update
---

# Batch Updates

When updating multiple chunks at once, you don’t want unnecessary re-renders. **Stunk** provides a `batch` function to group multiple updates and notify subscribers only once. This is particularly useful for optimizing performance when you need to update multiple chunks at the same time.

**Usage (Normal Updates vs Batch Updates)**

```typescript
import { chunk, batch } from "stunk";

// Define multiple chunks
const firstName = chunk("AbdulAzeez");
const lastName = chunk("Olanrewaju");
const age = chunk(50);
```

**Normal updates**

```typescript
// Update chunks individually (triggers multiple renders)
firstName.set("AbdulQuddus"); // AbdulQuddus
lastName.set("Aliu"); // Aliu
age.set(35); // 35
```

**Batch updates**

```typescript
// Use batch to group updates (only triggers a single render)
batch(() => {
  firstName.set("AbdulQuddus");
  lastName.set("Aliu");
  age.set(35);
}); // Only one notification will be sent to subscribers

// Logs all changes at once:
// "First Name: AbdulQuddus"
// "Last Name: Aliu"
// "Age: 35"
```

## Nested batches

```typescript
// Nested batches are also supported
batch(() => {
  firstName.set("Olamide");
  batch(() => {
    age.set(29);
  });
}); // Only one notification will be sent to subscribers here
```

### Why Use Batch Updates?

✅ **Optimized Performance** → Avoids redundant renders.  
✅ **Grouped State Changes** → Ensures consistency across updates.  
✅ **Automatic Subscription Notification** → Subscribers are only notified after all updates are applied.

Batching ensures your app runs efficiently by reducing redundant updates.

🚀 Next, let’s explore how **Computed** works in Stunk!
