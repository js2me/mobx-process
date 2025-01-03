import { action, computed, makeObservable, observable } from 'mobx';
import { Class, Maybe } from 'yummies/utils/types';

import { ProcessModel } from './process-model';
import { ProcessModelImpl } from './process-model.impl';
import { ProcessStore } from './process-store';

export class ProcessStoreImpl implements ProcessStore {
  protected processes = observable.map<Class<ProcessModel>, ProcessModelImpl>(
    [],
    { deep: false },
  );

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

  protected getProcess<T extends ProcessModel>(Process: Class<T>): T | null {
    return (this.processes.get(Process) as Maybe<T>) ?? null;
  }

  protected setProcess(
    process: Class<ProcessModel>,
    instance: ProcessModelImpl,
  ) {
    this.processes.set(process, instance);
  }

  protected deleteProcess(process: Class<ProcessModel>) {
    this.processes.delete(process);
  }

  get<T extends ProcessModel>(Process: Class<T>): T | null {
    return this.getProcess(Process);
  }

  protected createProcess(Process: Class<ProcessModel>) {
    return new Process({
      processes: this,
    }) as ProcessModelImpl;
  }

  async load(
    payload: Class<ProcessModel> | Class<ProcessModel>[],
  ): Promise<void> {
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

  async unload(
    payload: Class<ProcessModel> | Class<ProcessModel>[],
  ): Promise<void> {
    const processes = Array.isArray(payload) ? payload : [payload];

    await Promise.all(
      processes.map(async (Process) => {
        await this.getProcess(Process)?.stop?.();
        this.deleteProcess(Process);
      }),
    );
  }

  async reload(
    payload: Class<ProcessModel> | Class<ProcessModel>[],
  ): Promise<void> {
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
