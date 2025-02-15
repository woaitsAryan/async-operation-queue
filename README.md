# async-operation-queue

TLDR: Ever wanted to run asynchronous functions without blocking the request (main thread)? This library allows you to run async functions in the background using Redis-backed queues with a lot of built-in features.

A TypeScript library for managing asynchronous operations using Redis-backed queues powered by BullMQ. This library provides a robust and type-safe way to handle background jobs with automatic retries, logging, and error handling.

## Features

- 🚀 Fully type-safe function registry
- 📝 Configurable logging support for Winston loggers
- 🔄 Redis-backed durable queue
- ⚡ Powered by BullMQ
- 🛠️ Customizable worker and job options
- 🔍 Built-in error handling and job monitoring

## Installation

```bash
npm install async-operation-queue
```

or 

```bash
bun install async-operation-queue
```

## Usage

To use the `async-operation-queue` library, you need to define your async function to execute in a registry.

### Step 1: Define Your Functions in a Registry

First, create a function registry that contains the functions you want to execute asynchronously. Each function should return a `Promise`.

```typescript
async function asyncOperation1(arg1: string, arg2: number) {
  return result;
}

const functionRegistry = {
    asyncOperation1,
};
```

### Step 2: Create a Queue Manager

Next, create a operation queue instance with the function registry and redis.

```typescript
import { AsyncOperationQueue } from "async-operation-queue";
import { Redis } from "ioredis";

const redisClient = new Redis("redis://localhost:6379", { maxRetriesPerRequest: null });

operationQueue = new AsyncOperationQueue(functionRegistry, redisClient);
```

### Step 3: Enqueue a Job

Finally, enqueue a job with the function name and arguments.

```typescript

operationQueue.push("asyncOperation1", ["arg1", 2]);
```

That's it! The job will be executed asynchronously in the background.

The push method is fully type-safe and will throw a compile-time error if the function name or arguments are incorrect.

### Step 4: Shutdown the Queue

You can shutdown the queue when you're done. (for example: when the server gracefully shuts down)

```typescript
operationQueue.shutdown();
```

## Additional configuration

You can configure the operation queue with additional options.

```typescript
import type { JobsOptions, WorkerOptions } from "async-operation-queue";

const workerOptions: WorkerOptions = { concurrency: 5, lockDuration: 30000 }

const jobOptions: JobsOptions = { attempts: 3, backoff: { type: "exponential", delay: 1000 } }

const winstonLogger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});

operationQueue = new AsyncOperationQueue(functionRegistry, redisClient, {
  workerOptions,
  jobOptions,
  logger: winstonLogger,
  queueName: "my-queue",
  jobName: "my-job",
  isSilent: false
});
```

For workerOptions and jobOptions, you can refer to the BullMQ documentation for more information.

1. Worker options: https://api.docs.bullmq.io/interfaces/v4.WorkerOptions.html. I've choosen to omit the connection type from this for internal connection
2. Job options: https://api.docs.bullmq.io/interfaces/v5.BaseJobOptions.html
3. Queue options: https://api.docs.bullmq.io/interfaces/v5.QueueOptions.html