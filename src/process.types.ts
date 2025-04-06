import { Class } from 'yummies/utils/types';

import { ProcessStore } from './process-store.js';
import { Process } from './process.js';

export enum ProcessStatus {
  Initialized,
  Starting,
  Working,
  Stopping,
  Stopped,
}

export interface ProcessConfig {
  processes: ProcessStore;
  abortSignal?: AbortSignal;
  childProcesses?: Class<Process>[];
}
