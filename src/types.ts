export type FunctionRegistryType = Record<string, (...args: unknown[]) => Promise<unknown>>;

export type JobData<S extends FunctionRegistryType> = {
  functionName: keyof S;
  args: Parameters<S[keyof S]>;
}

export interface DefaultLogger {
  info: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}
