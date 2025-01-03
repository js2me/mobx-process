import { Class } from 'yummies/utils/types';

import { ProcessModel } from './process-model';
import { ProcessStore } from './process-store';

export enum ProcessStatus {
  Initialized,
  Starting,
  Working,
  Stopping,
  Stopped,
}

export interface ProcessModelConfig {
  processes: ProcessStore;
  abortSignal?: AbortSignal;
  childProcesses?: Class<ProcessModel>[];
}
