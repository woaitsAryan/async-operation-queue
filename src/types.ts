import type { JobsOptions as BullMQJobOptions, WorkerOptions as BullMQWorkerOptions, RedisClient as BullMQRedisClient, QueueOptions as BullMQQueueOptions } from "bullmq";

export type FunctionRegistryType = Record<string, {
  handler: (...args: any[]) => Promise<any>;
  priority?: BullMQJobOptions['priority'];
  attempts?: BullMQJobOptions['attempts'];
}>;

export type JobData<S extends FunctionRegistryType> = {
  functionName: keyof S;
  args: Parameters<S[keyof S]['handler']>;
}

export type QueueOptions = Omit<BullMQQueueOptions, 'connection'>;

export interface DefaultLogger {
  info: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

export type CommonJobsOptions = Omit<BullMQJobOptions, 'priority'>;
export type WorkerOptions = Omit<BullMQWorkerOptions, 'connection'>;
export type RedisClient = BullMQRedisClient;