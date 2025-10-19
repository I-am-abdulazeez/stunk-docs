---
title: Computed
---

# ⚡ Computed

`computed` lets you create reactive state derived from one or more chunks.  
When any dependency changes, the computed chunk updates automatically.


## Basic Example

```ts
import { chunk, computed } from "stunk";

const firstName = chunk("Abdulzeez");
const lastName = chunk("Fola");
const age = chunk(25);

const userInfo = computed(
  [firstName, lastName, age],
  (first, last, years) => ({
    fullName: `${first} ${last}`,
    isAdult: years >= 18,
  })
);

userInfo.subscribe((info) => console.log("Updated:", info));


firstName.set("Qudus"); // ✅ userInfo updates automatically
age.set(16); // ✅ isAdult becomes false
```


## Cart Total Example

```ts
const cartItems = chunk([
  { name: "Laptop", price: 1000, qty: 1 },
  { name: "Mouse", price: 50, qty: 2 },
]);

const cartTotal = computed([cartItems], (items) => ({
  totalItems: items.reduce((sum, i) => sum + i.qty, 0),
  totalPrice: items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));

cartTotal.subscribe((total) => console.log("Cart:", total));

cartItems.set([
  ...cartItems.get(),
  { name: "Keyboard", price: 80, qty: 1 },
]);
// ✅ totals update instantly
```

## Advanced Example

```ts
const users = chunk([
  { id: 1, name: "Aduke", online: true },
  { id: 2, name: "Asake", online: false },
]);

const showOnlineOnly = chunk(false);

const userStats = computed([users, showOnlineOnly], (list, onlineOnly) => {
  const filtered = onlineOnly ? list.filter(u => u.online) : list;
  return {
    total: list.length,
    online: list.filter(u => u.online).length,
    offline: list.filter(u => !u.online).length,
    visible: filtered,
  };
});

userStats.subscribe(console.log);
```

```ts
showOnlineOnly.set(true);
users.set([...users.get(), { id: 3, name: "Fola", online: true }]);
```

## Recompute and Reset

Each computed chunk has:

```ts
userInfo.recompute(); // Manually force recalculation
userInfo.reset();     // Resets dependencies and recomputes
userInfo.isDirty();   // Check if recomputation is pending
```


## Why Computed?

✅ Updates automatically
✅ Keeps logic clean
✅ Depends on multiple chunks
✅ Optimized with shallow comparison

Use `computed` when your state is **derived** from other chunks — like totals, filters, or combined data.

```
