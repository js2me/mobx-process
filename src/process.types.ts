import { Class } from 'yummies/utils/types';

import { Process } from './process';
import { ProcessStore } from './process-store';

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
