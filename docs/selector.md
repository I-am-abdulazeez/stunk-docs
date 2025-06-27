---
title: Selectors
---

# 🧩 State Selection

Sometimes, you don't need the entire state—just a specific part of it. With **Stunk**, you can efficiently **select and react to** specific properties without unnecessary re-renders using the powerful `select` function.

## Basic Selection

Use `select` to create **readonly** chunks derived from an existing chunk:

```typescript
import { chunk, select } from "stunk";

const userChunk = chunk({
  name: "Olamide",
  age: 30,
  email: "olamide@example.com",
});

// Select specific properties (readonly)
const nameChunk = select(userChunk, (state) => state.name);
const ageChunk = select(userChunk, (state) => state.age);

// Subscribe to receive updates
nameChunk.subscribe((name) => console.log("Name changed:", name));
ageChunk.subscribe((age) => console.log("Age changed:", age));
```

## Readonly Nature of Selectors

Selected chunks are **readonly** - you cannot modify them directly:

```typescript
// ❌ This will throw an error! nameChunk is readonly.
nameChunk.set("Fola");

// ❌ Reset is also not allowed on selectors
nameChunk.reset();

// ✅ Update the source chunk instead
userChunk.set((state) => ({ ...state, name: "Fola" }));
// This will automatically update nameChunk and notify its subscribers
```

## Selecting Nested Properties

Here's how to efficiently select and react to deeply nested properties:

```typescript
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
  preferences: {
    language: "en",
    timezone: "UTC",
  }
});

// Select deeply nested properties (readonly)
const nameChunk = select(userChunk, (state) => state.profile.name);
const themeChunk = select(userChunk, (state) => state.settings.theme);
const languageChunk = select(userChunk, (state) => state.preferences.language);

// Subscribe to selected properties
nameChunk.subscribe((name) => console.log("Name changed:", name));
themeChunk.subscribe((theme) => console.log("Theme changed:", theme));
```

## Optimized Updates

Selectors only trigger updates when their specific selected value changes:

```typescript
// Update the name - only nameChunk subscribers will be notified
userChunk.set((state) => ({
  ...state,
  profile: { ...state.profile, name: "David" }
}));
// Logs: "Name changed: David"

// Update the theme - only themeChunk subscribers will be notified
userChunk.set((state) => ({
  ...state,
  settings: { ...state.settings, theme: "light" }
}));
// Logs: "Theme changed: light"

// Update email - no selector subscribers are notified (optimization!)
userChunk.set((state) => ({
  ...state,
  profile: { ...state.profile, email: "new@example.com" }
}));
// No logs from selectors - they weren't affected
```

## Advanced Selection Options

### Shallow Equality Optimization

For complex objects or arrays, you can enable shallow equality checking to prevent unnecessary updates:

```typescript
const todosChunk = chunk([
  { id: 1, text: "Learn Stunk", completed: false },
  { id: 2, text: "Build app", completed: true },
]);

// Select completed todos with shallow equality checking
const completedTodos = select(
  todosChunk, 
  (todos) => todos.filter(todo => todo.completed),
  { useShallowEqual: true }
);

completedTodos.subscribe((completed) => {
  console.log("Completed todos:", completed.length);
});

// This won't trigger the selector if the filtered result is the same
todosChunk.set(current => [...current]); // Array reference changes but content is same
```

### Chaining Selectors

You can chain selectors to create more focused selections:

```typescript
const appState = chunk({
  user: {
    profile: { name: "Olamide", settings: { theme: "dark" } },
    posts: [{ id: 1, title: "Hello World" }]
  }
});

// First level selection
const userChunk = select(appState, (state) => state.user);

// Second level selection using the derive method (which uses select internally)
const userProfileChunk = userChunk.derive((user) => user.profile);
const userPostsChunk = userChunk.derive((user) => user.posts);

// Third level selection
const themeChunk = userProfileChunk.derive((profile) => profile.settings.theme);
```

## Complex Transformations

Selectors can perform complex transformations on your data:

```typescript
const productsChunk = chunk([
  { id: 1, name: "Laptop", price: 1000, category: "electronics" },
  { id: 2, name: "Book", price: 20, category: "books" },
  { id: 3, name: "Phone", price: 800, category: "electronics" },
]);

// Select and transform data
const expensiveElectronics = select(
  productsChunk,
  (products) => products
    .filter(p => p.category === "electronics" && p.price > 500)
    .map(p => ({ ...p, displayName: `${p.name} ($${p.price})` }))
);

const productStats = select(productsChunk, (products) => ({
  total: products.length,
  categories: [...new Set(products.map(p => p.category))],
  averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
  mostExpensive: products.reduce((max, p) => p.price > max.price ? p : max)
}));
```

## Memory Management

Selectors automatically clean up when destroyed:

```typescript
const sourceChunk = chunk({ value: 1 });
const selectedChunk = select(sourceChunk, (state) => state.value);

// When you destroy a selector, it unsubscribes from the source
selectedChunk.destroy();

// When you destroy the source, all its selectors are also cleaned up
sourceChunk.destroy();
```

## Performance Best Practices

1. **Use shallow equality for objects**: Enable `useShallowEqual` when selecting complex objects or arrays
2. **Keep selectors focused**: Select only what you need to minimize unnecessary computations
3. **Avoid complex transformations**: For heavy computations, consider using `computed` instead
4. **Clean up selectors**: Always destroy selectors when they're no longer needed

```typescript
// ✅ Good - focused selection
const userName = select(userChunk, (user) => user.name);

// ❌ Avoid - selecting entire objects when you only need part
const entireUser = select(appState, (state) => state.user); // If you only need the name

// ✅ Good - using shallow equality for arrays
const filteredItems = select(
  itemsChunk, 
  (items) => items.filter(item => item.active),
  { useShallowEqual: true }
);
```

## Error Handling

Selectors include built-in error handling:

```typescript
const dataChunk = chunk({ user: { name: "John" } });

// Safe selection with optional chaining
const safeNameChunk = select(dataChunk, (data) => data.user?.name || "Unknown");

// The selector will handle cases where the structure changes
dataChunk.set({ user: null }); // safeNameChunk will emit "Unknown"
```

## Why Use State Selection?

✅ **Optimized Performance** → Only updates when the selected value actually changes  
✅ **Avoid Unnecessary Renders** → Components subscribed to a selection won't re-render if other properties change  
✅ **Readonly Safety** → Prevents accidental state modifications outside the main chunk  
✅ **Memory Efficient** → Automatic cleanup and subscription management  
✅ **Type Safe** → Full TypeScript support with proper type inference

## Common Patterns

### Form Field Selection
```typescript
const formChunk = chunk({
  name: "", email: "", age: 0, errors: {}
});

const nameField = select(formChunk, (form) => form.name);
const emailField = select(formChunk, (form) => form.email);
const formErrors = select(formChunk, (form) => form.errors);
```

### UI State Selection
```typescript
const uiState = chunk({
  sidebar: { open: false, width: 250 },
  modal: { visible: false, content: null },
  theme: "light"
});

const sidebarOpen = select(uiState, (state) => state.sidebar.open);
const modalVisible = select(uiState, (state) => state.modal.visible);
const currentTheme = select(uiState, (state) => state.theme);
```

---

Want to update multiple chunks efficiently while notifying subscribers just once? Let's dive into Batch Updates next! 🚀
