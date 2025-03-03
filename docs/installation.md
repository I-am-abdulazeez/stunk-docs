---
title: Installation
---

# Installation

Get started with Stunk by installing it via your favorite package manager:

```bash
# npm
npm install stunk

# yarn
yarn add stunk

# pnpm
pnpm install stunk

# bun
bun add stunk
```

## Basic Usage

A **chunk** is a small container of state. It holds a value, and you can do some stuffs with it:

```typescript
import { chunk } from "stunk";

// Create a simple counter
const counterChunk = chunk(0);

// Subscribe to changes
counterChunk.subscribe((value) => {
  console.log("Counter changed:", value);
});

// Update the value
counterChunk.set(1);

// Get current value
const value = counterChunk.get(); // 1

// Reset to initial value
counterChunk.reset();
```

Now that Stunk is installed and running, let’s dive deeper into what a **chunk** is and how it works in the next section. 🚀
