---
title: What is a Chunk?
---

# What is a Chunk?

A **chunk** is the smallest unit of state in Stunk. It holds a value and provides methods to **get, set, and subscribe** to changes. Unlike traditional state management, chunks are **independent, reactive, and highly flexible**.

## Creating a Chunk

A chunk is created using the `chunk` function:

```typescript
import { chunk } from "stunk";

// Create a chunk holding a number
const count = chunk(0);

// Create a chunk holding a string
const name = chunk("Olamide");

// Create a chunk with an object
const user = chunk({ name: "Olamide", age: 24 });
```

> **Note:** Chunks cannot be initialized with `null` values. This prevents common runtime errors and ensures type safety.

## Interacting with a Chunk

You can interact with chunks using several core methods:

```typescript
// Get the current value
console.log(count.get()); // 0

// Set a new value
count.set(10);

// Update based on the previous value
count.set((prev) => prev + 1);

// Reset to the initial value
count.reset();

// Destroy the chunk and all its subscribers
count.destroy();
```

### Functional Updates

Chunks support functional updates, making it easy to update values based on their current state:

```typescript
const todos = chunk([]);

// Add a new todo
todos.set(current => [...current, { id: 1, text: "Learn Stunk" }]);

// Toggle completion status
todos.set(current => 
  current.map(todo => 
    todo.id === 1 ? { ...todo, completed: !todo.completed } : todo
  )
);
```

## Reactivity with Subscriptions

Chunks allow you to react to state changes by subscribing:

```typescript
// Subscribe returns an unsubscribe function
const unsubscribe = count.subscribe((value) => {
  console.log("Count changed:", value);
});

count.set(5); // Logs: "Count changed: 5"

// Clean up when done
unsubscribe();
```

> **Important:** Subscribers are called immediately upon subscription with the current value, and then on every subsequent change.

## Batching Updates

When updating multiple chunks simultaneously, you can batch updates to prevent unnecessary re-renders:

```typescript
import { batch } from "stunk";

const firstName = chunk("John");
const lastName = chunk("Doe");

batch(() => {
  firstName.set("Jane");
  lastName.set("Smith");
});
// Both updates are processed together in a single batch
```

## Deriving New Chunks

With Stunk, you can create **derived chunks** that automatically update when their source changes:

```typescript
const count = chunk(5);

// Create a derived chunk that doubles the count
const doubleCount = count.derive((value) => value * 2);

// Subscribe to receive updates
count.subscribe((newValue) => console.log("Count:", newValue));
doubleCount.subscribe((newValue) => console.log("Double count:", newValue));

count.set(10);
// Will log:
// "Count: 10"
// "Double count: 20"
```

### Deriving Chunks with Objects

You can return complex objects from `derive`, and everything inside stays reactive:

```typescript
const name = chunk("Olamide");
const age = chunk(24);

// Create a derived chunk with a summary object
const userInfo = age.derive((userAge) => ({
  greeting: `Hello, ${name.get()}!`,
  isAdult: userAge >= 18,
  category: userAge < 13 ? 'child' : userAge < 20 ? 'teen' : 'adult'
}));

userInfo.subscribe((info) => {
  console.log(info.greeting); // "Hello, Olamide!"
  console.log("Is adult?", info.isAdult);
  console.log("Category:", info.category);
});

age.set(17);
// Logs:
// Hello, Olamide!
// Is adult? false
// Category: teen
```

## Advanced Features

### Middleware Support

Chunks support middleware for intercepting and transforming values during updates:

```typescript
const loggerMiddleware = (value, next) => {
  console.log('Setting value:', value);
  next(value);
};

const validationMiddleware = (value, next) => {
  if (typeof value === 'number' && value >= 0) {
    next(value);
  } else {
    throw new Error('Value must be a non-negative number');
  }
};

const count = chunk(0, [loggerMiddleware, validationMiddleware]);
```

### Memory Management

Chunks automatically manage their internal state and subscriptions:

```typescript
const chunk1 = chunk("hello");
const derived = chunk1.derive(value => value.toUpperCase());

// When you destroy the parent chunk, derived chunks are also cleaned up
chunk1.destroy();
```

## Best Practices

1. **Initialize with meaningful defaults**: Always provide sensible initial values
2. **Use functional updates**: For complex state updates, prefer functional updates over direct mutations
3. **Clean up subscriptions**: Always unsubscribe when components unmount or cleanup is needed
4. **Batch related updates**: Use `batch()` when updating multiple related chunks
5. **Keep chunks focused**: Each chunk should represent a single concern or piece of state

## What's Next?

Now that you understand chunks, you can explore more advanced features:
- **State Selection**: Learn how to efficiently select parts of your state
- **Computed Values**: Discover how to create reactive computations from multiple chunks
- **Async Chunks**: Handle asynchronous state with built-in loading and error states

Chunks are the foundation of Stunk's reactivity system. Master them, and you'll have a powerful tool for managing application state!
