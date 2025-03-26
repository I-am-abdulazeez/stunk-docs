---
title: Computed
---

# Computed

Computed Chunks in Stunk allow you to create state derived from other chunks in a reactive way. Unlike derived chunks, computed chunks can depend on multiple sources, and they automatically recalculate when any of the source chunks change.

```typescript
import { chunk, computed } from "stunk";

// Define base chunks
const firstNameChunk = chunk("Olamide");
const lastNameChunk = chunk("David");
const ageChunk = chunk(25);
```

Create a `computed` chunk, then subscribe to receive updates

```typescript
const fullInfoChunk = computed(
  // takes the multiple chunk as dependecy array.
  [firstNameChunk, lastNameChunk, ageChunk],
  (firstName, lastName, age) => ({
    fullName: `${firstName} ${lastName}`,
    isAdult: age >= 18,
  })
);

// Subscribe to changes
fullInfoChunk.subscribe((info) => console.log("Updated Info:", info));
```

Update dependencies

```typescript
// Update dependencies
firstNameChunk.set("John"); // ✅ fullInfoChunk updates automatically
ageChunk.set(16); // ✅ isAdult will update to false
```

**`computed` example: `cartTotalChunk`, which calculates the total price based on cart items.**

```typescript
import { chunk, computed } from "stunk";

// Define base chunks
const cartItemsChunk = chunk([
  { name: "Laptop", price: 1000, quantity: 1 },
  { name: "Mouse", price: 50, quantity: 2 },
]);
```

**Create a `computed` chunk, then subscribe to receive updates**

```typescript
// Create a computed chunk
const cartTotalChunk = computed([cartItemsChunk], (cartItems) => ({
  totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ),
}));

// Subscribe to changes
cartTotalChunk.subscribe((cartTotal) =>
  console.log("Updated Cart:", cartTotal)
);
```

**Update dependencies**

```typescript
// Update dependencies
cartItemsChunk.set([
  ...cartItemsChunk.get(),
  { name: "Keyboard", price: 80, quantity: 1 },
]);
// ✅ `totalItems` and `totalPrice` update automatically
```

## Advanced Examples

**`computed` example: `userStatusChunk`, which tracks the online status of users and calculates active/inactive counts dynamically.**

```typescript
import { chunk, computed } from "stunk";

// Define base chunks
const usersChunk = chunk([
  { id: 1, name: "Alice", online: true },
  { id: 2, name: "Bob", online: false },
  { id: 3, name: "Charlie", online: true },
]);

const showOnlineOnlyChunk = chunk(false); // Toggle to show only online users
```

**Create a `computed` chunk, then subscribe to receive updates**

```typescript
// Create a computed chunk
const userStatusChunk = computed(
  [usersChunk, showOnlineOnlyChunk],
  (users, showOnlineOnly) => {
    // Filter users if showOnlineOnly is true
    const filteredUsers = showOnlineOnly
      ? users.filter((user) => user.online)
      : users;

    return {
      totalUsers: users.length,
      onlineUsers: users.filter((user) => user.online).length,
      offlineUsers: users.filter((user) => !user.online).length,
      displayedUsers: filteredUsers,
    };
  }
);

// Subscribe to changes
userStatusChunk.subscribe((status) =>
  console.log("Updated User Status:", status)
);
```

**Update dependencies**

```typescript
// Update dependencies
showOnlineOnlyChunk.set(true); // ✅ Only online users will be displayed
usersChunk.set([...usersChunk.get(), { id: 4, name: "David", online: true }]); // ✅ Updates dynamically when users change

usersChunk.set([
  { id: 1, name: "Alice", online: false },
  { id: 2, name: "Bob", online: true },
  { id: 3, name: "Charlie", online: false },
  { id: 4, name: "David", online: true },
]);
// ✅ Updates user counts reactively
```

**`computed` example: `filteredAndSortedTodosChunk`, which dynamically filters and sorts todos based on user-selected criteria.**

```typescript
import { chunk, computed } from "stunk";

// Define base chunks
const todosChunk = chunk([
  { id: 1, text: "Learn Stunk", completed: true, priority: "high" },
  { id: 2, text: "Build a project", completed: false, priority: "medium" },
  { id: 3, text: "Read a book", completed: false, priority: "low" },
]);

const filterChunk = chunk<"all" | "completed" | "active">("all");
const sortChunk = chunk<"priority" | "alphabetical">("priority");
```

```typescript
// Create a computed chunk
const filteredAndSortedTodosChunk = computed(
  [todosChunk, filterChunk, sortChunk],
  (todos, filter, sort) => {
    // Apply filtering
    let filteredTodos = todos;
    if (filter === "completed") {
      filteredTodos = todos.filter((todo) => todo.completed);
    } else if (filter === "active") {
      filteredTodos = todos.filter((todo) => !todo.completed);
    }

    // Apply sorting
    if (sort === "priority") {
      filteredTodos = filteredTodos.sort((a, b) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } else if (sort === "alphabetical") {
      filteredTodos = filteredTodos.sort((a, b) =>
        a.text.localeCompare(b.text)
      );
    }

    return filteredTodos;
  }
);

// Subscribe to changes
filteredAndSortedTodosChunk.subscribe((todos) =>
  console.log("Updated Todos:", todos)
);
```

**Update dependencies**

```typescript
// Update dependencies
filterChunk.set("active"); // ✅ Filters only active todos
sortChunk.set("alphabetical"); // ✅ Sorts alphabetically
todosChunk.set([
  ...todosChunk.get(),
  { id: 4, text: "Workout", completed: false, priority: "high" },
]);
// ✅ Updates reactively based on filter & sort
```

## Why Use Computed Chunks?

✅ **Automatic Updates** → Recomputes when dependencies change.  
✅ **Optimized Performance** → Only recomputes when needed.  
✅ **Derived State** → Keeps logic clean and centralized.

**`computed` chunks** are ideal for scenarios where state depends on multiple sources or needs complex calculations. They ensure your application remains performant and maintainable.
