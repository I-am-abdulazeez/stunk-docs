---
title: Selectors
---

# 🧩 Selectors

`select` lets you create **readonly derived chunks** from another chunk.  
It helps you listen to just the part of state you care about — without unnecessary updates.

## Basic Example

```ts
import { chunk, select } from "stunk";

const user = chunk({
  name: "Abdulzeez",
  age: 28,
  email: "abdulzeez@example.com",
});

const name = select(user, (u) => u.name);
const age = select(user, (u) => u.age);

name.subscribe((n) => console.log("Name:", n));
age.subscribe((a) => console.log("Age:", a));
````

```ts
user.set((u) => ({ ...u, name: "Fola" }));
// ✅ name updates automatically
```

## Readonly by Design

Selectors can’t be updated directly — only through their source chunk.

```ts
name.set("Qudus"); // ❌ throws error
user.set((u) => ({ ...u, name: "Qudus" })); // ✅ correct way
```

## Nested Selection

You can easily select nested data:

```ts
const app = chunk({
  profile: { name: "Aduke", age: 22 },
  settings: { theme: "dark" },
});

const theme = select(app, (s) => s.settings.theme);
theme.subscribe(console.log); // "dark"

app.set((s) => ({
  ...s,
  settings: { ...s.settings, theme: "light" },
}));
// ✅ only theme subscribers are notified
```

## Shallow Equality Optimization

For arrays or objects, use shallow equality to skip redundant updates.

```ts
const todos = chunk([
  { id: 1, text: "Learn Stunk", done: false },
  { id: 2, text: "Ship feature", done: true },
]);

const completed = select(
  todos,
  (list) => list.filter((t) => t.done),
  { useShallowEqual: true }
);
```

If the content doesn’t actually change, subscribers won’t re-trigger.

## Chaining Selectors

Selectors can derive from each other:

```ts
const app = chunk({
  user: { info: { name: "Asake", theme: "dark" } },
});

const user = select(app, (s) => s.user);
const info = user.derive((u) => u.info);
const theme = info.derive((i) => i.theme);
```

## Cleanup

Selectors unsubscribe automatically when destroyed:

```ts
const source = chunk({ value: 1 });
const selected = select(source, (s) => s.value);

selected.destroy(); // stops listening
```

## Best Practices

✅ Use `useShallowEqual` for arrays/objects
✅ Select only what you need
✅ Avoid heavy transformations (use `computed` instead)
✅ Clean up unused selectors

## Why Use `select`?

⚡ Improves performance
🧠 Prevents unwanted updates
🔒 Readonly and safe
💡 Works great with derived state

Next: **Batch Updates** — update multiple chunks efficiently 🚀
