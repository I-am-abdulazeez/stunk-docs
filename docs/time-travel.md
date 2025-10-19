---
title: Time Travel (Undo & Redo)
---

# ⏳ Time Travel (Undo & Redo)

`withHistory` lets you **undo**, **redo**, and track all changes made to a chunk.  
It’s perfect for forms, editors, or anywhere you want “go back” and “go forward” behavior.

## ⚙️ Basic Example

```ts
import { chunk } from "stunk";
import { withHistory } from "stunk/middleware";

const counterChunk = withHistory(chunk(0));

counterChunk.set(1);
counterChunk.set(2);

counterChunk.undo(); // → goes back to 1
counterChunk.undo(); // → goes back to 0
counterChunk.redo(); // → moves forward to 1
````

## 🔍 Checking History

```ts
counterChunk.canUndo(); // true if you can go back
counterChunk.canRedo(); // true if you can go forward
```

## 📜 View or Clear History

```ts
counterChunk.getHistory(); 
// [0, 1, 2] — full list of past values

counterChunk.clearHistory(); 
// clears all history, keeps current value only
```

## 🎚️ Limit History Size

To prevent memory issues, you can limit how many changes to store:

```ts
const counter = withHistory(chunk(0), { maxHistory: 5 });
// Keeps only the last 5 states (default is 100)
```

## 🧠 Real Example — Form Undo/Redo

```ts
const formChunk = withHistory(chunk({
  name: "Aduke",
  age: 24,
}));

formChunk.set({ name: "Asake", age: 24 });
formChunk.set({ name: "Fola", age: 25 });

formChunk.undo(); // back to Asake
formChunk.undo(); // back to Aduke
formChunk.redo(); // forward to Asake
```

## 🧩 API Overview

| Method           | Description                          |
| ---------------- | ------------------------------------ |
| `set(value)`     | Update the chunk and push to history |
| `undo()`         | Move to previous value               |
| `redo()`         | Move to next value                   |
| `canUndo()`      | Check if undo is possible            |
| `canRedo()`      | Check if redo is possible            |
| `getHistory()`   | Returns all past values              |
| `clearHistory()` | Clears all past values               |
| `destroy()`      | Destroys chunk and history           |

## ✅ Why Use `withHistory`

* **Undo mistakes easily**
* **Improve UX** — users can go back to previous input
* **Debugging** — track how state changed step-by-step
* **Simple integration** — wrap any chunk instantly

## ⚡ Example: Text Editor Undo/Redo

```ts
const textChunk = withHistory(chunk("Hello"));

textChunk.set("Hello Abdulzeez");
textChunk.set("Hello Qudus");

textChunk.undo(); // back to "Hello Abdulzeez"
textChunk.undo(); // back to "Hello"
textChunk.redo(); // forward to "Hello Abdulzeez"
```

💡 **Tip:** Combine `withHistory` with `withPersistence` to get **undo + localStorage** support.


Next: Learn how to **persist state across reloads** with `withPersistence` 💾
