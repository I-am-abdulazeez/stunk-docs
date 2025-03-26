---
title: Selectors
---

# 🧩 State Selection

Sometimes, you don’t need the entire state—just a specific part of it. With **Stunk**, you can efficiently **select and react to** specific properties without unnecessary re-renders.

## Selecting Specific Properties

Use `select` to create **readonly** chunks derived from an existing chunk:

```typescript
import { chunk, select } from "stunk";

const userChunk = chunk({
  name: "Olamide",
  age: 30,
  email: "olamide@example.com",
});
```

**Select and subscribe**

```typescript
// Select specific properties (readonly) and subscribe to receive updates
const nameChunk = select(userChunk, (state) => state.name);
const ageChunk = select(userChunk, (state) => state.age);

nameChunk.subscribe((name) => console.log("Name changed:", name));
// Will only re-render if `name` changes.
```

**Want to set a selected `chunk`?, set the source instead**

```typescript
// ❌ This will throw an error! nameChunk is readonly.
nameChunk.set("Fola");

// ✅ This is valid.
userChunk.set((state) => ({ ...state, name: "Fola" }));
```

## Selecting Nested Properties

Here's how to efficiently select and react to nested properties:

```typescript
import { chunk, select } from "stunk";

const userChunk = chunk({
  profile: {
    name: "Olamide",
    age: 30,
    email: "olamide@example.com",
  },
  settings: {
    theme: "dark",
    notifications: true,
  },
});
```

**Select and subscribe**

```typescript
// Select deeply nested properties (readonly)
const nameChunk = select(userChunk, (state) => state.profile.name);
const themeChunk = select(userChunk, (state) => state.settings.theme);

// Subscribe to selected properties
nameChunk.subscribe((name) => console.log("Name changed:", name));
themeChunk.subscribe((theme) => console.log("Theme changed:", theme));
```

Updates

```typescript
// Update the original chunk
userChunk.set((state) => {
  state.profile.name = "David"; // ✅ This will trigger `nameChunk` subscribers
});

// Updating unrelated properties does not trigger unnecessary re-renders
userChunk.set((state) => {
  state.settings.theme = "light"; // ✅ This will trigger `themeChunk` subscribers only
});

// ❌ This will throw an error because `select` makes properties readonly
nameChunk.set("John");
```

### Why Use State Selection?

✔️ Optimized Performance → Only updates when the selected value changes.  
✔️ Avoid Unnecessary Renders → Components subscribed to a selection won’t re-render if other properties change.  
✔️ Readonly Safety → Prevents accidental state modifications outside the main chunk.

---

Want to update multiple chunks efficiently while notifying subscribers just once? Let's dive into **Batch Updates** next! 🚀
