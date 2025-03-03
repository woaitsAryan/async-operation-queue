import { Queue, Worker } from "bullmq";
import type { DefaultLogger, FunctionRegistryType, JobData, JobsOptions, WorkerOptions, RedisClient, QueueOptions } from "./types";
import type { Logger } from 'winston';

export class AsyncOperationQueue<R extends FunctionRegistryType> {
  private worker?: Worker;
  private queue: Queue;
  private registry: R;
  private workerOptions: WorkerOptions;
  private jobOptions: JobsOptions;
  private isSilent: boolean;
  private logger: Logger | DefaultLogger;
  private jobName: string;
  private queueName: string;
  private redisClient: RedisClient;

  constructor(
    functionRegistery: R,
    redis: RedisClient,
    options?: {
      jobOptions?: JobsOptions,
      workerOptions?: WorkerOptions,
      queueOptions?: QueueOptions,
      isSilent?: boolean;
      logger?: Logger;
      queueName?: string;
      jobName?: string;
    }
  ) {
    const functionsQueue = new Queue<R>(options?.queueName ?? "async-operation-queue", {
      connection: redis,
      ...options?.queueOptions
    });
    this.redisClient = redis;
    this.registry = functionRegistery;
    this.jobOptions = options?.jobOptions || {};
    this.queue = functionsQueue;
    this.workerOptions = options?.workerOptions || {};
    this.isSilent = options?.isSilent ?? false;
    this.queueName = options?.queueName ?? "async-operation-queue";
    this.jobName = options?.jobName ?? "async-operation-job";

    if (this.isSilent) {
      this.logger = {
        info: () => { },
        error: () => { },
      };
    } else if (options?.logger) {
      this.logger = options.logger;
    } else {
      this.logger = {
        info: (message: string) => console.log(message),
        error: (message: string, error?: unknown) => console.error(message, error),
      };
    }

    this.start();
  }

  public async push<T extends keyof R>(functionName: T, args: Parameters<R[T]>, priority?: JobsOptions['priority'], attempts?: JobsOptions['attempts']) {
    try {
      await this.queue.add(
        this.jobName,
        { functionName, args },
        { removeOnComplete: true, removeOnFail: true, ...this.jobOptions, priority, attempts }
      );
      this.logger.info(`Job added to queue: ${String(functionName)}`);
    } catch (error) {
      this.logger.error(`Failed to add job to queue: ${String(functionName)}`, error);
    }
  }

  private start() {
    this.worker = new Worker<JobData<R>>(
      this.queueName,
      async (job) => {
        const { functionName, args } = job.data;
        this.logger.info(`Processing job: ${String(functionName)}`);

        const func = this.registry[functionName];
        if (!func) {
          const errorMsg = `Function ${String(functionName)} is not registered.`;
          this.logger.error(errorMsg);
          throw new Error(errorMsg);
        }

        try {
          const result = await func(...args);
          this.logger.info(`Job completed: ${String(functionName)}`);
          if (result) return result;
        } catch (error) {
          this.logger.error(`Job failed: ${String(functionName)}`, error);
          throw error;
        }
      },
      {
        ...this.workerOptions,
        connection: this.redisClient
      }
    );

    this.worker.on("failed", (job, err) => {
      this.logger.error(`Job ${job?.id} failed`, err);
    });

    this.worker.on("completed", (job, result) => {
      this.logger.info(`Job ${job?.id} completed`, result);
    });

  }

  public async shutdown() {
    if (this.worker) {
      await this.worker.close();
      this.logger.info("Worker shut down");
    }
  }
}

export type { DefaultLogger, FunctionRegistryType, JobData, JobsOptions, WorkerOptions, RedisClient } 