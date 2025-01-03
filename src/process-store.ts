import { Class } from 'yummies/utils/types';

import { ProcessModel } from './process-model';
import { ProcessLoadPayload } from './process-store.types';

export interface ProcessStore {
  /**
   * Are there "blocking" processes (processes with a true isBlocking flag)
   */
  readonly hasBlockingProcesses: boolean;

  currentProcesses: ProcessModel[];

  /**
   * Loads and starts the process
   */
  load(payload: ProcessLoadPayload): Promise<void>;

  /**
   * Stops and unloads the process
   */
  unload(payload: ProcessLoadPayload): Promise<void>;

  /**
   * Triggers process reload (stop - start)
   */
  reload(payload: ProcessLoadPayload): Promise<void>;

  /**
   * Returns the last instance of the process
   */
  get<T extends ProcessModel>(Constructor: Class<T>): T | null;
}