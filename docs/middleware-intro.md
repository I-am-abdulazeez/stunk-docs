---
title: Middleware
---

# 🔗 Middleware

Middleware in Stunk lets you intercept and modify state updates before they happen. You can use middleware to:

✅ Log state changes 📜  
✅ Validate input values ✅  
✅ Transform data before updating 🔄  
✅ Trigger side effects ⚙️

Instead of modifying chunks manually, you can attach **multiple middlewares** to a chunk at creation.

---

## **Built-in Middleware in Stunk**

Stunk comes with some useful built-in middleware, such as logging and validation. You can use them out of the box like this:

```typescript
import { chunk } from "stunk";
import { logger, nonNegativeValidator } from "stunk/middleware";

// Create a chunk with built-in middleware
const age = chunk(25, [logger, nonNegativeValidator]);

age.set(30);
// Logs: "Updating from 25 to 30"

age.set(-5);
// Throws: "Value must be non-negative!" (update prevented)
```

## How Stunk Implements Middleware

Internally, Stunk's middleware system works like this:

```typescript
export const logger: Middleware<any> = (value, next, prev) => {
  console.log(`Updating from ${prev} to ${value}`);
  next(value);
};

export const nonNegativeValidator: Middleware<number> = (value, next) => {
  if (value < 0) {
    throw new Error("Value must be non-negative!");
  }
  next(value); // If validation passes, proceed with the update
};
```

## Creating Your Own Middleware

You can create your custom middleware using the same pattern. Here’s an example that caps a number at a **maximum value**:

```typescript
export const maxValue =
  (max: number): Middleware<number> =>
  (value, next) => {
    if (value > max) {
      console.warn(`Value exceeded max (${max}), setting to ${max}`);
      next(max);
    } else {
      next(value);
    }
  };

// Usage:
const score = chunk(0, [maxValue(100)]);

score.set(120);
// Logs: "Value exceeded max (100), setting to 100"
```

Here's another middleware example: **minMaxRange**, which ensures a number stays within a specified range.

```typescript
export const minMaxRange =
  (min: number, max: number): Middleware<number> =>
  (value, next) => {
    if (value < min) {
      console.warn(`Value below min (${min}), setting to ${min}`);
      next(min);
    } else if (value > max) {
      console.warn(`Value exceeded max (${max}), setting to ${max}`);
      next(max);
    } else {
      next(value);
    }
  };

// Usage:
const temperature = chunk(25, [minMaxRange(0, 50)]);

temperature.set(60); // Logs: "Value exceeded max (50), setting to 50"
console.log(temperature.get()); // 50

temperature.set(-10); // Logs: "Value below min (0), setting to 0"
console.log(temperature.get()); // 0
```

Here's another middleware example: `debounceSet`, which delays updates to prevent rapid state changes.

```typescript
export const debounceSet =
  (delay: number): Middleware<any> =>
  (value, next) => {
    clearTimeout((next as any)._debounceTimer);
    (next as any)._debounceTimer = setTimeout(() => next(value), delay);
  };

// Usage:
const searchQuery = chunk("", [debounceSet(300)]);

searchQuery.set("Hel");
searchQuery.set("Hello"); // Only "Hello" will be set after 300ms
```

## Why Use Middleware?

✅ **Encapsulate Logic** → Keep validation and transformation separate from app logic.  
✅ **Chain Multiple Behaviors** → Stack middlewares for powerful state control.  
✅ **Reusability** → Use the same middleware across different chunks.

---

Want to `undo` or `redo` state changes? Let’s explore **time travel** in Stunk! 🚀
