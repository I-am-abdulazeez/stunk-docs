---
title: Middleware
---

# 🔗 Middleware

Middleware lets you intercept or modify updates before they happen.  
Use it to:

✅ Log changes  
✅ Validate inputs  
✅ Transform data  
✅ Trigger side effects  

You can attach one or more middlewares when creating a chunk.

## Built-in Middleware

Stunk includes some ready-to-use middleware like `logger` and `nonNegativeValidator`.

```ts
import { chunk } from "stunk";
import { logger, nonNegativeValidator } from "stunk/middleware";

const age = chunk(25, [logger, nonNegativeValidator]);

age.set(30);
// → Updating from 25 to 30

age.set(-5);
// ❌ Value must be non-negative!
````

## How It Works

A middleware receives:

* The new value
* The `next()` function to continue
* The previous value (optional)

```ts
export const logger = (value, next, prev) => {
  console.log(`Updating from ${prev} to ${value}`);
  next(value);
};

export const nonNegativeValidator = (value, next) => {
  if (value < 0) throw new Error("Value must be non-negative!");
  next(value);
};
```

## Custom Middleware

You can build your own.
Example: cap a value at a max limit.

```ts
export const maxValue =
  (max) => (value, next) => {
    if (value > max) {
      console.warn(`Above ${max}, setting to ${max}`);
      next(max);
    } else next(value);
  };

const score = chunk(0, [maxValue(100)]);

score.set(120); // → Above 100, setting to 100
```

## Range Middleware

Keep a number within a range.

```ts
export const minMaxRange =
  (min, max) => (value, next) => {
    if (value < min) {
      console.warn(`Below ${min}, using ${min}`);
      next(min);
    } else if (value > max) {
      console.warn(`Above ${max}, using ${max}`);
      next(max);
    } else next(value);
  };

const temp = chunk(25, [minMaxRange(0, 50)]);

temp.set(60);  // → Above 50, using 50
temp.set(-10); // → Below 0, using 0
```

## Debounce Middleware

Delay updates — useful for search or inputs.

```ts
export const debounceSet =
  (delay) => (value, next) => {
    clearTimeout((next as any)._t);
    (next as any)._t = setTimeout(() => next(value), delay);
  };

const search = chunk("", [debounceSet(300)]);

search.set("Hel");
search.set("Hello"); // Only "Hello" applies after 300ms
```

## Why Middleware?

✅ Keeps logic separate
✅ Stack multiple effects
✅ Reuse across chunks

Next: ready to undo or redo changes?
Let’s jump into **Time Travel** 🕒
