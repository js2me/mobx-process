import { Class } from 'yummies/utils/types';

import { ProcessStatus } from './process-model.types';

export interface ProcessModel {
  readonly status: ProcessStatus;

  /**
   * Unique process identifier
   */
  readonly id: string;

  /**
   * Blocking process. Additional state that can be useful for detecting processes
   * that should not continue executing certain code
   */
  readonly isBlocking: boolean;

  /**
   * Process state that indicates the process has been successfully started
   * and is in a working state
   */
  readonly isWorking: boolean;

  /**
   * Starts the process and all nested processes described in {childProcesses}
   */
  start?(): Promise<void>;

  /**
   * Stops the process and all nested processes
   */
  stop?(): Promise<void>;

  /**
   * Restarts the process
   */
  restart(): Promise<void>;

  /**
   * Child processes that should be automatically started with the process (Based on the library implementation)
   */
  childProcesses?: Class<ProcessModel>[];
}
