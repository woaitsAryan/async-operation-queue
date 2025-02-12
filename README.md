# async-operation-queue

A TypeScript library for managing asynchronous operations using Redis-backed queues powered by BullMQ. This library provides a robust and type-safe way to handle background jobs with automatic retries, logging, and error handling.

## Features

- 🚀 Fully type-safe function registry and job handling
- 📝 Configurable logging support
- 🔄 Redis-backed durable queue
- ⚡ Powered by BullMQ
- 🛠️ Customizable worker and job options
- 🔍 Built-in error handling and job monitoring

## Installation

```bash
npm install async-operation-queue
```

## Usage

To use the `async-operation-queue` library, you need to define your async function to execute in a registry.

### Step 1: Define Your Functions

First, create a function registry that contains the functions you want to execute asynchronously. Each function should return a `Promise`.

```typescript
const functionRegistry = {
  asyncOperation: async (arg1: string, arg2: number) => {
    // Your asynchronous operation logic here

    return result;
  }
};
```