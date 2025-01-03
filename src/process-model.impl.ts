import { LinkedAbortController } from 'linked-abort-controller';
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import { Class } from 'yummies/utils/types';

import { ProcessModel } from './process-model';
import { ProcessModelConfig, ProcessStatus } from './process-model.types';
import { ProcessStore } from './process-store';

declare const process: { env: { NODE_ENV?: string } };

export class ProcessModelImpl implements ProcessModel {
  protected abortController: AbortController;
  protected processes: ProcessStore;

  childProcesses: Class<ProcessModel>[] = [];
  isBlocking: boolean = true;
  status = ProcessStatus.Initialized;

  id =
    process.env.NODE_ENV === 'production'
      ? `p_${globalThis.crypto.randomUUID()}`
      : `${(this as any).constructor.name}_p_${globalThis.crypto.randomUUID()}`;

  constructor({ processes, abortSignal }: ProcessModelConfig) {
    this.processes = processes;
    this.abortController = new LinkedAbortController(abortSignal);

    observable.ref(this, 'status');
    observable.ref(this, 'childProcesses');
    observable.ref(this, 'isBlocking');
    computed(this, 'isWorking');
    action.bound(this, 'restart');
    action.bound(this, 'start');
    action.bound(this, 'stop');

    makeObservable(this);
  }

  get isWorking() {
    return (
      this.status === ProcessStatus.Working &&
      this.childProcesses.every(
        (childProcess) => this.processes.get(childProcess)?.isWorking,
      )
    );
  }

  async restart() {
    await this.processes.reload((this as any).constructor);
  }

  async start() {
    this.status = ProcessStatus.Starting;

    if (this.childProcesses?.length) {
      await this.processes.load(this.childProcesses);
    }

    runInAction(() => {
      this.status = ProcessStatus.Working;
    });
  }

  async stop() {
    this.status = ProcessStatus.Stopping;
    this.abortController.abort();

    if (this.childProcesses?.length) {
      await this.processes.unload(this.childProcesses);
    }

    runInAction(() => {
      this.status = ProcessStatus.Stopped;
    });
  }
}
