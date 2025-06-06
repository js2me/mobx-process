import { action, computed, makeObservable, observable } from 'mobx';
import { Class, Maybe } from 'yummies/utils/types';

import { ProcessStore } from './process-store.js';
import { ProcessGetPayload } from './process-store.types.js';
import { Process } from './process.js';

export class ProcessStoreImpl implements ProcessStore {
  protected processes = observable.map<Class<Process>, Process>([], {
    deep: false,
  });

  constructor() {
    computed(this, 'currentProcesses');
    computed(this, 'hasBlockingProcesses');
    action(this, 'setProcess');
    action(this, 'deleteProcess');

    makeObservable(this);
  }

  get currentProcesses() {
    return [...this.processes.values()];
  }

  get hasBlockingProcesses() {
    return this.currentProcesses.some((process) => {
      return !process.isWorking && process.isBlocking;
    });
  }

  protected getProcess<T extends Process>(
    lookup: ProcessGetPayload<T>,
  ): T | null {
    if (typeof lookup === 'string') {
      return (this.currentProcesses.find((process) => process.id === lookup) ??
        null) as T;
    }
    return (this.processes.get(lookup) as Maybe<T>) ?? null;
  }

  protected setProcess(process: Class<Process>, instance: Process) {
    this.processes.set(process, instance);
  }

  protected deleteProcess(process: Class<Process>) {
    this.processes.delete(process);
  }

  get<T extends Process>(lookup: ProcessGetPayload<T>): T | null {
    return this.getProcess(lookup);
  }

  protected createProcess(Process: Class<Process>): Process {
    return new Process({
      processes: this,
    });
  }

  async load(payload: Class<Process> | Class<Process>[]): Promise<void> {
    const processes = Array.isArray(payload) ? payload : [payload];

    await Promise.all(
      processes.map(async (Process) => {
        const instance = this.createProcess(Process);
        this.setProcess(Process, instance);
        await instance.start?.();
        return instance;
      }),
    );
  }

  async unload(payload: Class<Process> | Class<Process>[]): Promise<void> {
    const processes = Array.isArray(payload) ? payload : [payload];

    await Promise.all(
      processes.map(async (Process) => {
        await this.getProcess(Process)?.stop?.();
        this.deleteProcess(Process);
      }),
    );
  }

  async reload(payload: Class<Process> | Class<Process>[]): Promise<void> {
    const processes = Array.isArray(payload) ? payload : [payload];

    await Promise.all(
      processes.map(async (Process) => {
        await this.getProcess(Process)?.stop?.();
        const instance = this.createProcess(Process);
        await instance.start?.();
        this.setProcess(Process, instance);
        return instance;
      }),
    );
  }
}
