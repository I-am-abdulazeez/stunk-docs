# Stunk

## API Reference

### **Core API**

#### **`chunk<T>(initialValue: T, middleware?: Middleware<T>[])`**

Creates a new **state chunk**, which holds reactive state and allows updates, subscriptions, and derived state.

##### **Interface**

```ts
interface Chunk<T> {
  get(): T;
  set: (newValueOrUpdater: T | ((currentValue: T) => T)) => void;
  subscribe(callback: (value: T) => void): () => void;
  derive<D>(fn: (value: T) => D): Chunk<D>;
  reset: () => void;
  destroy(): void;
}
```

##### **Example**

```tsx
import { chunk } from "stunk";

const counter = chunk(0);

counter.subscribe((value) => console.log("Counter:", value));

counter.set(10); // Logs: Counter: 10
counter.set((prev) => prev + 1);
```

---

#### **`select<T, S>(sourceChunk: Chunk<T>, selector: (value: T) => S): Chunk<S>`**

Creates a **read-only chunk** that updates **only when the selected value changes**, optimizing reactivity.

##### **Example**

```tsx
const user = chunk({ name: "John", age: 30 });

const userName = select(user, (u) => u.name);

// This component re-renders only when `name` changes, not `age`
const UserName = () => {
  const name = useChunkValue(userName);
  return <p>{name}</p>;
};
```

---

#### **`batch(callback: () => void)`**

Batches multiple updates to prevent unnecessary re-renders.

##### **Example**

```tsx
batch(() => {
  count.set((prev) => prev + 1);
  isLoading.set(false);
});

batch(() => {
  user.set({ name: "Alice", age: 25 });
  batch(() => {
    settings.set({ theme: "dark" });
  });
});
```

✅ **Nested Batching Support** – Ensures efficient updates even inside nested calls.

---

### **State Enhancements**

#### **`withHistory<T>(chunk: Chunk<T>, options?: { maxHistory?: number })`**

Enhances a **chunk** with **undo/redo** capabilities.

##### **Interface**

```ts
interface ChunkWithHistory<T> extends Chunk<T> {
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  getHistory(): T[];
  clearHistory(): void;
}
```

##### **Example**

```tsx
const counter = withHistory(chunk(0));

counter.set(5);
counter.set(10);

counter.undo(); // Reverts to 5
counter.redo(); // Moves forward to 10
```

---

### **Middleware API**

#### **`Middleware<T>`**

Middleware allows custom **processing of state updates** before they are applied.

##### **Type Definition**

```ts
type Middleware<T> = (value: T, next: (newValue: T) => void) => void;
```

##### **Example**

```tsx
const logger: Middleware<number> = (value, next) => {
  console.log("Updating value to:", value);
  next(value); // Continue with update
};

const count = chunk(0, [logger]);

count.set(10); // Logs: "Updating value to: 10"
```

✅ **Middleware Chain Support** – Multiple middlewares can process the state before it updates.

---

### **Derived & Computed State**

#### **Key Differences: `derive` vs `computed`**

| Feature      | `derive` (Single Chunk) | `computed` (Multiple Chunks)     |
| ------------ | ----------------------- | -------------------------------- |
| Dependencies | One chunk               | Multiple chunks                  |
| Caching      | No caching              | Cached until dependencies change |
| Use Case     | Simple transformations  | Complex calculations             |

#### **Reactivity in Computed Properties**

A **computed property** **automatically tracks its dependencies**, ensuring it updates when relevant state changes.

---

## **React API**

### **`useChunk<T, S = T>(chunk: Chunk<T>, selector?: (value: T) => S): readonly [S, (valueOrUpdater: T | ((currentValue: T) => T)) => void, () => void, () => void]`**

Subscribes a React component to a chunk, triggering re-renders when the chunk changes.

##### **Example**

```tsx
const counter = chunk(0);

const CounterComponent = () => {
  const [count, set] = useChunk(counter);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => set((prev) => prev + 1)}>Increment</button>
    </div>
  );
};
```

---

### **`useDerive<T, D>(chunk: Chunk<T>, fn: (value: T) => D): D`**

Creates a derived **read-only value** from a chunk.

##### **Example**

```tsx
const user = chunk({ firstName: "John", lastName: "Doe" });
const fullName = useDerive(user, (u) => `${u.firstName} ${u.lastName}`);
```

---

### **`useComputed<TDeps extends Chunk<any>[], TResult>(dependencies: [...TDeps], computeFn: (...args: DependencyValues<TDeps>) => TResult): TResult`**

Computes a value based on multiple chunks.

##### **Example**

```tsx
const price = chunk(100);
const tax = chunk(0.2);
const total = useComputed([price, tax], (p, t) => p + p * t);
```

---

### **`useAsyncChunk<T>(asyncChunk: AsyncChunk<T>)`**

Handles async state with loading, error, and data properties.

##### **Example**

```tsx
const dataChunk = asyncChunk(fetchData);
const { data, loading, error, reload } = useAsyncChunk(dataChunk);
```

### **`useChunkValue<T, S = T>(chunk: Chunk<T>, selector?: (value: T) => S): S`**

Hook that subscribes to a chunk and returns only its current value.

##### **Example**

```tsx
const count = chunk(0);

const CounterDisplay = () => {
  const value = useChunkValue(count);

  return <p>Count: {value}</p>;
};
```

### **`useChunkValues<T extends Chunk<any>[]>(chunks: [...T])`**

Hook to read values from multiple chunks at once.

##### **Example**

```tsx
const firstName = chunk("John");
const lastName = chunk("Doe");

const FullName = () => {
  const [first, last] = useChunkValues([firstName, lastName]);

  return (
    <p>
      Full Name: {first} {last}
    </p>
  );
};
```

### **`useChunkProperty<T, K extends keyof T>(chunk: Chunk<T>, property: K)`**

A hook that subscribes to a specific property of a chunk.

##### **Example**

```tsx
import { chunk } from "stunk";
import { useChunkProperty } from "stunk/react";

const user = chunk({ name: "John", age: 30 });

const UserName = () => {
  const name = useChunkProperty(user, "name");

  return <p>Name: {name}</p>;
};
```

---

## **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

[Pull Request](https://github.com/I-am-abdulazeez/stunk/pulls)

## **License**

This is licence under MIT
