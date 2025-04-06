import {
  ProcessGetPayload,
  ProcessLoadPayload,
} from './process-store.types.js';
import { Process } from './process.js';

export interface ProcessStore {
  /**
   * Are there "blocking" processes (processes with a true isBlocking flag)
   */
  readonly hasBlockingProcesses: boolean;

  currentProcesses: Process[];

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
  get<T extends Process>(lookup: ProcessGetPayload<T>): T | null;
}
