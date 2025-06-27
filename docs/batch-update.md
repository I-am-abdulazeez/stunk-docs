---
title: Batch Updates
---

# 🚀 Batch Updates

When updating multiple chunks at once, you don't want unnecessary re-renders. **Stunk** provides a `batch` function to group multiple updates and notify subscribers only once. This is particularly useful for optimizing performance when you need to update multiple chunks simultaneously.

## The Problem: Multiple Updates = Multiple Renders

Without batching, each chunk update triggers its subscribers immediately:

```typescript
import { chunk, batch } from "stunk";

// Define multiple chunks
const firstName = chunk("AbdulAzeez");
const lastName = chunk("Olanrewaju"); 
const age = chunk(50);

// Subscribe to all chunks
firstName.subscribe(name => console.log("First Name:", name));
lastName.subscribe(name => console.log("Last Name:", name));
age.subscribe(age => console.log("Age:", age));
```

### Normal Updates (Multiple Renders)

```typescript
// Each update triggers subscribers immediately
firstName.set("AbdulQuddus"); // Logs: "First Name: AbdulQuddus"
lastName.set("Aliu");         // Logs: "Last Name: Aliu"  
age.set(35);                  // Logs: "Age: 35"

// Result: 3 separate render cycles
```

### Batch Updates (Single Render)

```typescript
// Use batch to group updates (only triggers a single render cycle)
batch(() => {
  firstName.set("AbdulQuddus");
  lastName.set("Aliu");
  age.set(35);
});

// Result: All updates applied, then subscribers notified once:
// "First Name: AbdulQuddus"
// "Last Name: Aliu"
// "Age: 35"
```

## Advanced Batching Scenarios

### Nested Batches

Batches can be nested without issues - the outermost batch controls the notification timing:

```typescript
batch(() => {
  firstName.set("Olamide");
  
  // Nested batch - still part of the parent batch
  batch(() => {
    lastName.set("Johnson");
    age.set(29);
  });
  
  // More updates in the parent batch
  const email = chunk("olamide@example.com");
  email.set("olamide.johnson@example.com");
});

// Only one notification cycle occurs after all updates complete
```

### Complex State Updates

Batching is especially useful for complex state transformations:

```typescript
const userChunk = chunk({
  profile: { name: "John", email: "john@example.com" },
  settings: { theme: "light", notifications: true },
  stats: { posts: 0, followers: 0 }
});

const themeChunk = chunk("light");
const notificationChunk = chunk(true);

// Update multiple related chunks atomically
batch(() => {
  // Update user profile
  userChunk.set(current => ({
    ...current,
    profile: { ...current.profile, name: "John Doe" }
  }));
  
  // Update related chunks
  themeChunk.set("dark");
  notificationChunk.set(false);
  
  // Update user settings to match
  userChunk.set(current => ({
    ...current,
    settings: {
      theme: themeChunk.get(),
      notifications: notificationChunk.get()
    }
  }));
});
```

## Batch with Derived Chunks and Selectors

Batching works seamlessly with derived chunks and selectors:

```typescript
const baseData = chunk({ count: 0, multiplier: 2 });
const doubled = baseData.derive(data => data.count * data.multiplier);
const tripled = baseData.derive(data => data.count * 3);

// Subscribe to derived chunks
doubled.subscribe(value => console.log("Doubled:", value));
tripled.subscribe(value => console.log("Tripled:", value));

// Batch update affects all derived chunks
batch(() => {
  baseData.set(current => ({ ...current, count: 5 }));
  baseData.set(current => ({ ...current, multiplier: 4 }));
});

// Results in single notification cycle:
// "Doubled: 20"  (5 * 4)
// "Tripled: 15"  (5 * 3)
```

## Error Handling in Batches

If an error occurs during a batch, the batch is automatically completed and notifications are sent for successful updates:

```typescript
const safeChunk = chunk("valid");
const errorChunk = chunk("test");

try {
  batch(() => {
    safeChunk.set("updated"); // This succeeds
    
    // Simulate an error in middleware or validation
    errorChunk.set(null); // This might throw if null validation is enabled
  });
} catch (error) {
  console.log("Batch error:", error.message);
  // safeChunk subscribers still get notified of the successful update
}
```

## Performance Considerations

### When to Use Batching

```typescript
// ✅ Good use cases for batching:

// 1. Form submissions with multiple fields
batch(() => {
  nameChunk.set(formData.name);
  emailChunk.set(formData.email);
  ageChunk.set(formData.age);
});

// 2. Bulk data operations
batch(() => {
  items.forEach(item => {
    itemsChunk.set(current => [...current, item]);
  });
});

// 3. Coordinated UI state changes
batch(() => {
  modalVisible.set(false);
  overlayVisible.set(false);
  focusedElement.reset();
});

// 4. API response processing
batch(() => {
  userChunk.set(response.user);
  settingsChunk.set(response.settings);
  preferencesChunk.set(response.preferences);
});
```

### When NOT to Use Batching

```typescript
// ❌ Unnecessary batching:

// Single update - no benefit
batch(() => {
  singleChunk.set("value");
});

// Updates to unrelated chunks that don't need coordination
batch(() => {
  userNameChunk.set("John");    // User-related
  weatherDataChunk.set(data);   // Completely unrelated
});
```

## Integration with Async Operations

Batching works well with async operations, but remember that only synchronous updates within the batch callback are grouped:

```typescript
// ✅ Synchronous batch - all updates grouped
batch(() => {
  chunk1.set("value1");
  chunk2.set("value2");
  chunk3.set("value3");
});

// ❌ Async operations break the batch
batch(async () => {
  chunk1.set("value1");        // Batched
  await someAsyncOperation();   
  chunk2.set("value2");        // Not batched - executes separately
});

// ✅ Better approach for async scenarios
const results = await someAsyncOperation();
batch(() => {
  chunk1.set(results.data1);
  chunk2.set(results.data2);
  chunk3.set(results.data3);
});
```

## Debugging Batched Updates

You can add logging to understand batch behavior:

```typescript
const debugBatch = (name: string, callback: () => void) => {
  console.log(`Starting batch: ${name}`);
  batch(() => {
    callback();
    console.log(`Batch ${name} updates applied, notifications pending...`);
  });
  console.log(`Batch ${name} completed, subscribers notified`);
};

debugBatch("user-profile-update", () => {
  firstName.set("New Name");
  lastName.set("New Last Name");
  age.set(30);
});
```

## Memory and Performance Impact

- **Memory Efficient**: Batching doesn't store extra data - it just delays notifications
- **CPU Optimized**: Reduces the number of subscription callback executions
- **Framework Friendly**: Reduces render cycles in UI frameworks like React, Vue, etc.

```typescript
// Performance comparison
console.time("without-batch");
for (let i = 0; i < 1000; i++) {
  counter.set(i); // 1000 individual notifications
}
console.timeEnd("without-batch");

console.time("with-batch");
batch(() => {
  for (let i = 0; i < 1000; i++) {
    counter.set(i); // 1 notification after all updates
  }
});
console.timeEnd("with-batch");
```

## Why Use Batch Updates?

✅ **Optimized Performance** → Reduces redundant renders and subscription callbacks  
✅ **Atomic State Changes** → Ensures consistency across multiple related updates  
✅ **Better User Experience** → Eliminates visual flicker from multiple rapid updates  
✅ **Framework Agnostic** → Works with any UI framework or vanilla JavaScript  
✅ **Memory Efficient** → No additional memory overhead, just smarter notification timing  
✅ **Error Resilient** → Partial failures don't prevent successful updates from being applied

Batching ensures your app runs efficiently by reducing redundant updates and providing atomic state changes.

---

🚀 Next, let's explore how **Computed Values** work in Stunk and learn to create reactive calculations from multiple chunks!
