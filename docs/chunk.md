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
```

## Interacting with a Chunk

You can `get`, `set`, `destroy` and `reset` a chunk’s value:

```typescript
// Get the current value
console.log(count.get()); // 0

// Set a new value
count.set(10);

// Update based on the previous value
count.set((prev) => prev + 1);

// Reset to the initial value
count.reset();

// Destroy the chunk and all its subscribers.
count.destroy();
```

## Reactivity with Subscriptions

Chunks allow you to react to state changes by subscribing:

```typescript
count.subscribe((value) => {
  console.log("Count changed:", value);
});

count.set(5); // Logs: "Count changed: 5"
```

## Deriving New Chunks

With Stunk, you can create **derived chunks**. This means you can create a new chunk based on the value of another chunk. When the original chunk changes, the **derived chunk** will automatically update.

```typescript
const count = chunk(5);

// Create a derived chunk that doubles the count
const doubleCount = count.derive((value) => value * 2);

count.subscribe((newValue) => console.log("Count:", newValue));
doubleCount.subscribe((newValue) => console.log("Double count:", newValue));

count.set(10);
// Will log:
// "Count: 10"
// "Double count: 20"
```

Simple, right? But there's more! Next, let's explore State Selection and how to pick specific parts of your state efficiently.
