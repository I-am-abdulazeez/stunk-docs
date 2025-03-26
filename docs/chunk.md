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
```

```typescript
// Subscribe to recieve updates
count.subscribe((newValue) => console.log("Count:", newValue));
doubleCount.subscribe((newValue) => console.log("Double count:", newValue));

count.set(10);
// Will log:
// "Count: 10"
// "Double count: 20"
```

**Derive support Object Returns!**

You can now return objects directly, and Stunk will keep everything reactive, ensuring object-based derivations remain stable while preventing unnecessary re-renders. Let's take a look at an example:

```typescript
export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  categoryId: string;
  createdAt: Date;
};

// Create the chunk
const todosChunk = chunk<Todo[]>([]);

// Derive an object based on `todosChunk`
export const stats = todosChunk.derive((allTodos) => ({
  total: allTodos.length,
  completed: allTodos.filter((todo) => todo.completed).length,
  active: allTodos.filter((todo) => !todo.completed).length,
}));
```

Let's set todosChunk...

```typescript
// When we set todos
const newTodos = [
  {
    id: "1",
    text: "Learn Stunk",
    completed: true,
    categoryId: "work",
    createdAt: new Date(),
  },
  {
    id: "2",
    text: "Build a project",
    completed: false,
    categoryId: "work",
    createdAt: new Date(),
  },
];
todosChunk.set(newTodos);

// `stats` will be reactive based on changes in `todosChunk`
// Logs: stats: { total: 2, completed: 1, active: 1 }
```

Let's update `todosChunk` again...

```typescript
// Updating a todo
const latestTodos = [
  {
    id: "1",
    text: "Learn Stunk",
    completed: true,
    categoryId: "work",
    createdAt: new Date(),
  },
  {
    id: "2",
    text: "Build a project",
    completed: true,
    categoryId: "work",
    createdAt: new Date(),
  },
];
todosChunk.set(latestTodos);

// Logs: stats: { total: 2, completed: 2, active: 0 }
```

This makes **Stunk** even more powerful when working with `derived` states!

**Why this Matters**

- More efficient updates: Only affected properties trigger re-renders.
- Cleaner & more readable code: Work with structured state directly.

Simple, right? But there's more! Next, let's explore State Selection and how to pick specific parts of your state efficiently.
