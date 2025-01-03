import { ProcessStore } from './process-store';

export const enum ProcessStatus {
  Initialized,
  Starting,
  Working,
  Stopping,
  Stopped,
}

export interface ProcessModelConfig {
  processes: ProcessStore;
  abortSignal?: AbortSignal;
}