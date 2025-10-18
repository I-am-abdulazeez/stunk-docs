---
title: Batch Updates
---

# 🚀 Batch Updates

Use `batch()` to group multiple chunk updates and trigger subscribers only once.  
It makes your app faster and avoids extra renders.

---

## Example

```ts
import { chunk, batch } from "stunk";

const firstName = chunk("Abdulzeez");
const lastName = chunk("Fola");
const age = chunk(25);

firstName.subscribe(v => console.log("First:", v));
lastName.subscribe(v => console.log("Last:", v));
age.subscribe(v => console.log("Age:", v));

batch(() => {
  firstName.set("Qudus");
  lastName.set("Aduke");
  age.set(26);
});

// → First: Qudus
// → Last: Aduke
// → Age: 26
````

All updates fire once.

---

## Nested Batches

You can nest batches — only the outer one matters.

```ts
batch(() => {
  firstName.set("Asake");

  batch(() => {
    lastName.set("Lawal");
    age.set(30);
  });
});
```

---

## Real Use

```ts
const user = chunk({ name: "Fola", theme: "light" });
const theme = chunk("light");

batch(() => {
  theme.set("dark");
  user.set(c => ({ ...c, name: "Fola Ade", theme: theme.get() }));
});
```

---

## Derived Chunks

Derived chunks update once too.

```ts
const base = chunk({ count: 0, mult: 2 });
const double = base.derive(v => v.count * v.mult);

batch(() => {
  base.set(v => ({ ...v, count: 5 }));
  base.set(v => ({ ...v, mult: 4 }));
});

// → Double: 20
```

---

## Errors

If one update fails, others still apply.

```ts
const good = chunk("ok");
const bad = chunk("value");

try {
  batch(() => {
    good.set("fine");
    bad.set(null); // throws
  });
} catch (e) {
  console.log("Error:", e.message);
}
```

---

## Async Note

Only sync updates are batched.

```ts
// ✅ Works
batch(() => {
  a.set(1);
  b.set(2);
});

// ❌ Async breaks it
batch(async () => {
  a.set(1);
  await delay();
  b.set(2); // runs later
});
```

---

## Quick Tips

✅ Use for related updates
✅ Skip for single changes
✅ Great for forms, bulk updates, and API results

---

## Perf Check

```ts
console.time("with-batch");
batch(() => {
  for (let i = 0; i < 1000; i++) count.set(i);
});
console.timeEnd("with-batch");
```

One notification, not 1000. ⚡

---

Batching keeps Stunk fast and clean.

```

---
