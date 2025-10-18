---
title: What is a Chunk?
---

# What is a Chunk?

A **chunk** is the smallest unit of state in Stunk.  
It holds a value and gives you simple tools to **get**, **set**, **subscribe**, and **react** to changes — without all the boilerplate of traditional state management.

Chunks are **independent, reactive, and efficient**.  
Each chunk manages its own state and subscribers, making it super easy to build responsive apps.

## Creating a Chunk

You create a chunk using the `chunk()` function.

```ts
import { chunk } from "stunk";

// A number chunk
const count = chunk(0);

// A string chunk
const name = chunk("Abdulzeez");

// An object chunk
const user = chunk({ name: "Fola", age: 25 });
````

> ⚠️ **Note:** Chunks cannot start with `null`.
> This helps prevent common runtime errors and keeps your data consistent.


## Working with a Chunk

Chunks have simple methods for interacting with the value.

```ts
// Get the current value
console.log(count.get()); // 0

// Set a new value
count.set(10);

// Update based on the current value
count.set(prev => prev + 1);

// Reset back to the initial value
count.reset();

// Destroy the chunk completely
count.destroy();
```

## Functional Updates

When your new value depends on the current one, you can pass a function to `set()`:

```ts
const todos = chunk([]);

// Add a new todo
todos.set(current => [...current, { id: 1, task: "Learn Stunk" }]);

// Toggle completion
todos.set(current =>
  current.map(todo =>
    todo.id === 1 ? { ...todo, done: !todo.done } : todo
  )
);
```

## Reactivity with Subscriptions

You can listen for changes using `subscribe()`.
It runs immediately with the current value and again whenever the chunk updates.

```ts
const count = chunk(0);

const unsubscribe = count.subscribe((value) => {
  console.log("Count changed:", value);
});

count.set(5); // → "Count changed: 5"

// Stop listening
unsubscribe();
```

## Batching Multiple Updates

When changing multiple chunks at once, use `batch()` to avoid unnecessary re-renders.

```ts
import { batch, chunk } from "stunk";

const firstName = chunk("Aduke");
const lastName = chunk("Asake");

batch(() => {
  firstName.set("Fola");
  lastName.set("Qudus");
});
// Both updates run together in one efficient batch
```

## Derived Chunks

A **derived chunk** creates a new chunk whose value depends on another chunk.
It updates automatically whenever the source chunk changes.

```ts
const count = chunk(5);
const doubleCount = count.derive(value => value * 2);

count.subscribe(v => console.log("Count:", v));
doubleCount.subscribe(v => console.log("Double:", v));

count.set(10);
// → Count: 10
// → Double: 20
```

### Example with Objects

Derived chunks can return objects too:

```ts
const age = chunk(24);
const name = chunk("Fola");

const userInfo = age.derive(userAge => ({
  message: `Hi ${name.get()}!`,
  isAdult: userAge >= 18,
  stage: userAge < 13 ? "child" : userAge < 20 ? "teen" : "adult"
}));

userInfo.subscribe(info => {
  console.log(info.message);
  console.log("Adult?", info.isAdult);
  console.log("Stage:", info.stage);
});

age.set(17);
// → Hi Fola!
// → Adult? false
// → Stage: teen
```

## Middleware

Chunks can use **middleware** to control or modify values before they’re stored.
You can use it for logging, validation, or data transformation.

```ts
const logger = (value, next) => {
  console.log("Setting value:", value);
  next(value);
};

const validateAge = (value, next) => {
  if (typeof value === "number" && value >= 0) {
    next(value);
  } else {
    throw new Error("Age must be a non-negative number");
  }
};

const age = chunk(24, [logger, validateAge]);
age.set(30); // Logs: "Setting value: 30"
```

You can also name your middleware for better debugging:

```ts
const middleware = [
  { name: "logger", fn: logger },
  { name: "validator", fn: validateAge }
];

const age = chunk(20, middleware);
```

## Validation Warnings

Stunk helps catch mistakes by warning when you add **unexpected properties** to an object.

```ts
const user = chunk({ name: "Fola", age: 25 });

// This triggers a warning
user.set({ name: "Fola", age: 25, city: "Lagos" });
```

The console will show a clear warning that “city” is not part of the original shape.


## Cleaning Up

When you’re done with a chunk, call `destroy()` to clean up its state and subscribers.

```ts
const message = chunk("Hello");
const upper = message.derive(value => value.toUpperCase());

message.destroy(); // cleans up everything, including derived chunks
```

## Best Practices

1. **Start with meaningful defaults** – never initialize with `null`.
2. **Use functional updates** when the new value depends on the current one.
3. **Unsubscribe** when you no longer need updates.
4. **Batch related updates** for performance.
5. **Keep chunks focused** — each should represent a single piece of state.

## Summary

Chunks are the **core of Stunk’s reactivity system**.
They’re small, fast, and easy to reason about — perfect for building clean, maintainable apps.

Once you understand chunks, you’re ready to move on to:

* **State Selection**
* **Computed Chunks**
* **Async State**

Master chunks, and you’ve mastered the heart of Stunk.
