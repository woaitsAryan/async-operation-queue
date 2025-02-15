import type { JobsOptions as BullMQJobOptions, WorkerOptions as BullMQWorkerOptions, RedisClient as BullMQRedisClient, QueueOptions as BullMQQueueOptions } from "bullmq";

export type FunctionRegistryType = Record<string, (...args: any[]) => Promise<any>>;

export type JobData<S extends FunctionRegistryType> = {
  functionName: keyof S;
  args: Parameters<S[keyof S]>;
}

export interface DefaultLogger {
  info: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

export type QueueOptions = Omit<BullMQQueueOptions, 'connection'>;
export type JobsOptions = BullMQJobOptions;
export type WorkerOptions = Omit<BullMQWorkerOptions, 'connection'>;
export type RedisClient = BullMQRedisClient;